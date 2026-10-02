import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getDb, saveDb } from './db.ts';

export interface AdminSession {
  token: string;
  adminId: number;
  username: string;
  role: string;
  name: string;
  expiresAt: number;
}

// In-memory active sessions map
const activeSessions = new Map<string, AdminSession>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function checkLoginLockout(ip: string): Promise<{ isLocked: boolean; remainingSeconds: number; attemptsCount: number }> {
  const db = await getDb();
  const stmt = db.prepare("SELECT attempts_count, locked_until FROM login_attempts WHERE ip = :ip");
  stmt.bind({ ':ip': ip });

  let isLocked = false;
  let remainingSeconds = 0;
  let attemptsCount = 0;

  if (stmt.step()) {
    const row = stmt.getAsObject() as { attempts_count: number; locked_until: string | null };
    attemptsCount = row.attempts_count || 0;

    if (row.locked_until) {
      const lockTime = new Date(row.locked_until).getTime();
      const now = Date.now();
      if (now < lockTime) {
        isLocked = true;
        remainingSeconds = Math.ceil((lockTime - now) / 1000);
      } else {
        // Lockout expired, reset attempts
        db.run("UPDATE login_attempts SET attempts_count = 0, locked_until = NULL WHERE ip = ?", [ip]);
        saveDb(db);
        attemptsCount = 0;
      }
    }
  }
  stmt.free();

  return { isLocked, remainingSeconds, attemptsCount };
}

export async function recordFailedLogin(ip: string): Promise<{ isLocked: boolean; remainingSeconds: number; attemptsCount: number }> {
  const db = await getDb();
  const now = new Date();
  
  const stmt = db.prepare("SELECT attempts_count FROM login_attempts WHERE ip = :ip");
  stmt.bind({ ':ip': ip });
  let currentAttempts = 0;
  let exists = false;

  if (stmt.step()) {
    exists = true;
    const row = stmt.getAsObject() as { attempts_count: number };
    currentAttempts = (row.attempts_count || 0) + 1;
  } else {
    currentAttempts = 1;
  }
  stmt.free();

  let lockedUntil: string | null = null;
  let isLocked = false;
  let remainingSeconds = 0;

  if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockTime = new Date(Date.now() + LOCKOUT_DURATION_MS);
    lockedUntil = lockTime.toISOString();
    isLocked = true;
    remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
  }

  if (exists) {
    db.run(
      "UPDATE login_attempts SET attempts_count = ?, last_attempt = ?, locked_until = ? WHERE ip = ?",
      [currentAttempts, now.toISOString(), lockedUntil, ip]
    );
  } else {
    db.run(
      "INSERT INTO login_attempts (ip, attempts_count, last_attempt, locked_until) VALUES (?, ?, ?, ?)",
      [ip, currentAttempts, now.toISOString(), lockedUntil]
    );
  }
  saveDb(db);

  return { isLocked, remainingSeconds, attemptsCount: currentAttempts };
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  const db = await getDb();
  db.run("DELETE FROM login_attempts WHERE ip = ?", [ip]);
  saveDb(db);
}

export async function verifyAdminPassword(password: string): Promise<{ admin: any | null; error?: string }> {
  const db = await getDb();
  const stmt = db.prepare("SELECT id, username, password_hash, role, name, phone, email FROM admins LIMIT 1");
  
  if (!stmt.step()) {
    stmt.free();
    return { admin: null, error: 'No administrator configured' };
  }

  const admin = stmt.getAsObject() as any;
  stmt.free();

  const isMatch = bcrypt.compareSync(password, admin.password_hash);
  if (!isMatch) {
    return { admin: null, error: 'Incorrect password' };
  }

  // Omit password_hash before returning
  const { password_hash, ...safeAdmin } = admin;
  return { admin: safeAdmin };
}

export function createSession(admin: { id: number; username: string; role: string; name: string }): AdminSession {
  const token = crypto.randomBytes(32).toString('hex');
  const session: AdminSession = {
    token,
    adminId: admin.id,
    username: admin.username,
    role: admin.role,
    name: admin.name,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  activeSessions.set(token, session);
  return session;
}

export function getSession(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

export function destroySession(token: string): void {
  activeSessions.delete(token);
}

export async function updateAdminPassword(adminId: number, oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  const stmt = db.prepare("SELECT password_hash FROM admins WHERE id = :id");
  stmt.bind({ ':id': adminId });

  if (!stmt.step()) {
    stmt.free();
    return { success: false, error: 'Admin record not found' };
  }

  const { password_hash } = stmt.getAsObject() as { password_hash: string };
  stmt.free();

  if (!bcrypt.compareSync(oldPass, password_hash)) {
    return { success: false, error: 'Current password does not match' };
  }

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPass, salt);

  db.run("UPDATE admins SET password_hash = ? WHERE id = ?", [newHash, adminId]);
  saveDb(db);
  return { success: true };
}
