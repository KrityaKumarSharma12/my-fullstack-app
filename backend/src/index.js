const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ CREATE new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await prisma.user.create({
      data: { name, email, password }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ CREATE post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;
    const post = await prisma.post.create({
      data: { title, content, authorId }
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});