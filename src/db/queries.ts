import { db } from './index.ts';
import { users, projects, templates } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface UpsertUserInput {
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
}

export async function getOrCreateUser(input: UpsertUserInput) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid: input.uid,
        email: input.email,
        displayName: input.displayName || null,
        photoUrl: input.photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: input.email,
          displayName: input.displayName || null,
          photoUrl: input.photoUrl || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Database user sync failed.', { cause: error });
  }
}

export async function getUserProjects(uid: string) {
  try {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, uid))
      .orderBy(desc(projects.updatedAt));
  } catch (error) {
    console.error('Database getUserProjects failed:', error);
    throw new Error('Failed to retrieve user projects.', { cause: error });
  }
}

export interface CreateProjectInput {
  userId: string;
  title: string;
  htmlContent: string;
  deviceType?: string;
  glassStyle?: string;
  accentColor?: string;
}

export async function createProject(input: CreateProjectInput) {
  try {
    const result = await db
      .insert(projects)
      .values({
        userId: input.userId,
        title: input.title,
        htmlContent: input.htmlContent,
        deviceType: input.deviceType || 'macbook',
        glassStyle: input.glassStyle || 'ultra',
        accentColor: input.accentColor || '#60a5fa',
        isFavorite: false,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database createProject failed:', error);
    throw new Error('Failed to create project in database.', { cause: error });
  }
}

export async function deleteProject(projectId: number, userId: string) {
  try {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, projectId))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database deleteProject failed:', error);
    throw new Error('Failed to delete project.', { cause: error });
  }
}

export async function getTemplates() {
  try {
    return await db.select().from(templates).orderBy(desc(templates.createdAt));
  } catch (error) {
    console.error('Database getTemplates failed:', error);
    throw new Error('Failed to retrieve templates.', { cause: error });
  }
}

export async function seedInitialTemplatesIfEmpty(initialTemplates: Array<{ title: string; description: string; category: string; code: string }>) {
  try {
    const existing = await db.select().from(templates).limit(1);
    if (existing.length === 0) {
      await db.insert(templates).values(initialTemplates);
    }
  } catch (error) {
    console.warn('Could not seed initial templates (may already exist or proxy initializing):', error);
  }
}
