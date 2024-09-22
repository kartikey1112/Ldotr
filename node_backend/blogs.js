const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Blog post 
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log('error')
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/posts/:id', async (req, res) => {
  const { title, content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
