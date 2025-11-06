import jwt from 'jsonwebtoken';

export default function requireAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return req.status(401).json({ error: 'Unathorized' });
    try {
        const u = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: u.id, username: u.username };
        next();
    }   catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}