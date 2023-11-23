const express = require('express');
const router = express.Router();
const Match = require('../models/match');
const mongoose = require('mongoose');

const app = express();
port = 3004;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });

// Get all matches
app.get('/api/matches', async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/matches', async (req, res) => {
  const { date, player1, player2, winner } = req.body;

  try {
    const match = new Match({
      _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the _id field
      date: new Date(date),
      player1,
      player2,
      winner,
    });

    await match.save();

    res.json({ message: 'Match created successfully', matchId: match._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

module.exports = router;