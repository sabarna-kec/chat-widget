const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'active', 'archived', 'reported'],
    default: 'open',
  },
  aiSummary: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Question', questionSchema);
