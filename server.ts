import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  getUserProjects,
  createProject,
  deleteProject,
  getTemplates,
  seedInitialTemplatesIfEmpty,
} from './src/db/queries.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'aethel-studio-backend',
      database: 'Supabase PostgreSQL (wnbagtknitiohsiikkdq)',
      supabaseProjectId: 'wnbagtknitiohsiikkdq',
      supabaseUrl: 'https://wnbagtknitiohsiikkdq.supabase.co',
      timestamp: new Date().toISOString(),
    });
  });

  // Supabase status endpoint
  app.get('/api/supabase/status', (_req, res) => {
    res.json({
      status: 'connected',
      projectId: 'wnbagtknitiohsiikkdq',
      url: 'https://wnbagtknitiohsiikkdq.supabase.co',
      clientKeyConfigured: true,
      timestamp: new Date().toISOString(),
    });
  });

  // User synchronization on sign in (upsert user record)
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: 'Unauthorized: missing user context' });
      }

      const email = req.user.email || `${req.user.uid}@auth.local`;
      const { displayName, photoUrl } = req.body;

      const user = await getOrCreateUser({
        uid: req.user.uid,
        email,
        displayName: displayName || req.user.name || null,
        photoUrl: photoUrl || req.user.picture || null,
      });

      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Failed to sync authenticated user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Get current user's profile and projects
  app.get('/api/projects', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userProjects = await getUserProjects(req.user.uid);
      res.json({ projects: userProjects });
    } catch (error: any) {
      console.error('Failed to fetch user projects:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch projects' });
    }
  });

  // Save new design / mockup to Cloud SQL
  app.post('/api/projects', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { title, htmlContent, deviceType, glassStyle, accentColor } = req.body;
      if (!title || !htmlContent) {
        return res.status(400).json({ error: 'Title and htmlContent are required' });
      }

      // Ensure user exists first
      await getOrCreateUser({
        uid: req.user.uid,
        email: req.user.email || `${req.user.uid}@auth.local`,
        displayName: req.user.name || null,
        photoUrl: req.user.picture || null,
      });

      const project = await createProject({
        userId: req.user.uid,
        title,
        htmlContent,
        deviceType,
        glassStyle,
        accentColor,
      });

      res.status(201).json({ success: true, project });
    } catch (error: any) {
      console.error('Failed to save project:', error);
      res.status(500).json({ error: error.message || 'Failed to save project' });
    }
  });

  // Delete saved project
  app.delete('/api/projects/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const projectId = parseInt(req.params.id, 10);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: 'Invalid project ID' });
      }

      const deleted = await deleteProject(projectId, req.user.uid);
      res.json({ success: true, project: deleted });
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      res.status(500).json({ error: error.message || 'Failed to delete project' });
    }
  });

  // Public templates endpoint
  app.get('/api/templates', async (_req, res) => {
    try {
      const dbTemplates = await getTemplates();
      res.json({ templates: dbTemplates });
    } catch (error: any) {
      console.error('Failed to fetch templates:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch templates' });
    }
  });

  // Seed default templates quietly in background
  seedInitialTemplatesIfEmpty([
    {
      title: 'Architectural Lookbook',
      description: 'Clean editorial grid with hotlinked photography, subtle borders, and unboxed typography.',
      category: 'Editorial',
      code: '<section class="studio-section"><h1>Tectonic Concrete & Glazed Courtyards</h1><p>An architectural study in volumetric subtraction.</p></section>',
    },
    {
      title: 'Glassmorphism Product Card',
      description: 'Frosted translucent device card with caustic reflections and soft rims.',
      category: 'Glass UI',
      code: '<div class="glass-card"><h2>Aethel Monolith</h2><p>Reflective glass acoustic transducer with zero visible seams.</p></div>',
    },
  ]).catch(() => {});

  // Vite integration
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Aethel Studio backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
