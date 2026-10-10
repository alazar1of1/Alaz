import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN = 'portfolio_cms_admin_secret_token_secure_2026';

app.use(express.json({ limit: '10mb' }));

// Auth middleware for Admin CMS routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing admin token.' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: Invalid admin token.' });
  }

  next();
}

// ================= API ROUTES =================

// Public: Get aggregated portfolio data
app.get('/api/portfolio', async (_req: Request, res: Response) => {
  try {
    const data = await db.getFullPortfolio();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load portfolio data', details: err.message });
  }
});

// Public: Get DB & Atlas status
app.get('/api/db-status', (_req: Request, res: Response) => {
  try {
    const status = db.getStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get database status', details: err.message });
  }
});

// Dynamic Contact Form submission
app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address provided.' });
    }

    const saved = await db.createMessage({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject ? String(subject).trim() : 'Portfolio Inquiry',
      message: String(message).trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: saved,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to submit contact message', details: err.message });
  }
});

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  // Accept configured password or default admin credentials
  if (password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: {
        email: email || 'admin@portfolio.dev',
        role: 'Administrator',
      },
    });
  }

  res.status(401).json({ error: 'Invalid credentials. Please verify your password.' });
});

// Admin Verify Token
app.get('/api/admin/verify', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ valid: true, role: 'Administrator' });
});

// Admin Connect Atlas
app.post('/api/admin/connect-atlas', requireAdminAuth, async (req: Request, res: Response) => {
  const { uri } = req.body;
  if (!uri) {
    return res.status(400).json({ error: 'MongoDB connection string is required.' });
  }

  const result = await db.connectAtlas(String(uri).trim());
  if (result.success) {
    res.json({ success: true, message: result.message, status: db.getStatus() });
  } else {
    res.status(400).json({ success: false, error: result.message });
  }
});

// Admin Messages
app.get('/api/admin/messages', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const messages = await db.getMessages();
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
});

app.patch('/api/admin/messages/:id/read', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const updated = await db.markMessageRead(id, !!read);
    if (!updated) return res.status(404).json({ error: 'Message not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update message', details: err.message });
  }
});

app.delete('/api/admin/messages/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteMessage(id);
    res.json({ success: deleted });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete message', details: err.message });
  }
});

// Admin Profile Update
app.put('/api/admin/profile', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await db.updateProfile(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

// Admin Projects CRUD
app.post('/api/admin/projects', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const item = await db.createProject(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create project', details: err.message });
  }
});

app.put('/api/admin/projects/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const item = await db.updateProject(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Project not found' });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
});

app.delete('/api/admin/projects/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteProject(req.params.id);
    res.json({ success: deleted });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
});

// Admin Experience CRUD
app.post('/api/admin/experiences', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const item = await db.createExperience(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create experience', details: err.message });
  }
});

app.put('/api/admin/experiences/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const item = await db.updateExperience(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Experience not found' });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update experience', details: err.message });
  }
});

app.delete('/api/admin/experiences/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteExperience(req.params.id);
    res.json({ success: deleted });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete experience', details: err.message });
  }
});

// Admin Skills CRUD
app.post('/api/admin/skills', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const item = await db.createSkill(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create skill', details: err.message });
  }
});

app.put('/api/admin/skills/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const item = await db.updateSkill(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Skill not found' });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update skill', details: err.message });
  }
});

app.delete('/api/admin/skills/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteSkill(req.params.id);
    res.json({ success: deleted });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete skill', details: err.message });
  }
});

// Admin Certifications CRUD
app.post('/api/admin/certifications', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const item = await db.createCertification(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create certification', details: err.message });
  }
});

app.put('/api/admin/certifications/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const item = await db.updateCertification(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Certification not found' });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update certification', details: err.message });
  }
});

app.delete('/api/admin/certifications/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteCertification(req.params.id);
    res.json({ success: deleted });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete certification', details: err.message });
  }
});

// ================= VITE DEV / STATIC SERVING =================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
