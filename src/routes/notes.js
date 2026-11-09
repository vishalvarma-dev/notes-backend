import express from 'express';
import prisma from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All notes endpoints require authentication
router.use(authMiddleware);

// GET /api/notes - fetch all notes for logged-in user
router.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
    });
    return res.json({ notes });
  } catch (error) {
    console.error('Fetch notes error:', error);
    return res.status(500).json({ error: 'Failed to retrieve notes.' });
  }
});

// GET /api/notes/:id - fetch single note
router.get('/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    if (isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid note ID.' });
    }

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.id,
      },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    return res.json({ note });
  } catch (error) {
    console.error('Fetch note error:', error);
    return res.status(500).json({ error: 'Failed to retrieve note.' });
  }
});

// POST /api/notes - create note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content ? content.trim() : '',
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    return res.status(500).json({ error: 'Failed to create note.' });
  }
});

// PUT /api/notes/:id - update existing note
router.put('/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    if (isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid note ID.' });
    }

    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty.' });
    }

    // Verify ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.id,
      },
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found or unauthorized.' });
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        title: title.trim(),
        content: content !== undefined ? content.trim() : existingNote.content,
      },
    });

    return res.json({
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    console.error('Update note error:', error);
    return res.status(500).json({ error: 'Failed to update note.' });
  }
});

// DELETE /api/notes/:id - delete existing note
router.delete('/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    if (isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid note ID.' });
    }

    // Verify ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.id,
      },
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found or unauthorized.' });
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return res.json({
      message: 'Note deleted successfully',
      id: noteId,
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return res.status(500).json({ error: 'Failed to delete note.' });
  }
});

export default router;

