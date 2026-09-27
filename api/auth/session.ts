export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    return res.status(200).json({
      authenticated: true,
      admin: {
        id: 1,
        username: 'admin',
        name: 'Vijay Kumar',
        role: 'SUPER ADMIN'
      }
    });
  }

  return res.status(200).json({
    authenticated: false,
    admin: null
  });
}
