import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

function setAuthCookie(res, user) {
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

router.post('/signup', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password || password.length < 6) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username: username.trim(), passwordHash });
  setAuthCookie(res, user);
  res.json({ id: user._id, username: user.username });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  setAuthCookie(res, user);
  res.json({ id: user._id, username: user.username });
}));

router.post('/logout', (_req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ user: null });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { id: payload.id, username: payload.username } });
  } catch {
    res.json({ user: null });
  }
});

export default router;