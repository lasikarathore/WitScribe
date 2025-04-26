const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
// mongoose.connect('mongodb://localhost:27017/witscribe', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  isVerified: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now }
});

const QuestionSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  tags: [String],
  votes: [{ userId: mongoose.Schema.Types.ObjectId, value: Number }],
  comments: [{
    text: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  createdAt: { type: Date, default: Date.now }
});

const AnswerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  votes: [{ userId: mongoose.Schema.Types.ObjectId, value: Number }],
  comments: [{
    text: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Question = mongoose.model('Question', QuestionSchema);
const Answer = mongoose.model('Answer', AnswerSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Authentication Middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// Community Endpoints

// Post Question
app.post('/questions', requireAuth, async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const question = new Question({
      author: req.session.userId,
      title,
      description,
      tags
    });
    await question.save();
    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get All Questions
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get Single Question
app.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'name' }
      });
      
    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Post Answer
app.post('/questions/:id/answers', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    const answer = new Answer({
      question: req.params.id,
      author: req.session.userId,
      text
    });
    
    await answer.save();
    
    // Add answer to question
    await Question.findByIdAndUpdate(
      req.params.id,
      { $push: { answers: answer._id } }
    );

    res.status(201).json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Voting System
app.post('/:type(questions|answers)/:id/vote', requireAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { value } = req.body;
    const userId = req.session.userId;

    const Model = type === 'questions' ? Question : Answer;
    
    const item = await Model.findById(id);
    const existingVote = item.votes.find(v => v.userId.equals(userId));

    if (existingVote) {
      // Update existing vote
      if (existingVote.value === value) {
        // Remove vote if same value
        item.votes = item.votes.filter(v => !v.userId.equals(userId));
      } else {
        // Change vote value
        existingVote.value = value;
      }
    } else {
      // Add new vote
      item.votes.push({ userId, value });
    }

    await item.save();
    res.json({ success: true, votes: item.votes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Comments System
app.post('/:type(questions|answers)/:id/comments', requireAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { text } = req.body;

    const comment = {
      text,
      author: req.session.userId
    };

    const Model = type === 'questions' ? Question : Answer;
    const updated = await Model.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );

    res.status(201).json({ success: true, comments: updated.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Keep your existing authentication endpoints here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
