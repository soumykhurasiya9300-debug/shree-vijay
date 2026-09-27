export default function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const { password } = body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Master password for Shree Vijay Showroom
  if (password === '1234') {
    const token = `sv_vercel_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: 1,
        username: 'admin',
        name: 'Vijay Kumar',
        role: 'SUPER ADMIN'
      }
    });
  }

  return res.status(401).json({
    error: 'incorrect password',
    remainingAttempts: 4
  });
}
