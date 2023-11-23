const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();

const Player = require('../models/player.js');

const app = express();
const port = 3003;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Fetch all players
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/playerstats', async (req, res) => {
  const { player1, player2, winner } = req.body;

  try {
    let player1Stats = await Player.findOne({ name: player1 });
    let player2Stats = await Player.findOne({ name: player2 });

    if (!player1Stats) {
      player1Stats = new Player({
        name: player1,
        noOfMatches: 1,
        elo: 1000,
      });
    }

    if (!player2Stats) {
      player2Stats = new Player({
        name: player2,
        noOfMatches: 1,
        elo: 1000,
      });
    }

    // Update the player stats based on the match result
    player1Stats.noOfMatches += 1;
    player2Stats.noOfMatches += 1;

    if (winner === player1) {
      player1Stats.elo += 10;
      player2Stats.elo -= 10;
    } else if (winner === player2) {
      player2Stats.elo += 10;
      player1Stats.elo -= 10;
    } else {
      // Handle the case where the match result is invalid
      return res.status(400).json({ message: 'Invalid match result' });
    }
    // Save the updated player stats to the database
    await player1Stats.save();
    await player2Stats.save();

    res.json({ message: 'Player stats updated successfully' });
  } catch (error) {
    console.error('Error updating player stats:', error);
    res.status(500).json({ message: 'Failed to update player stats' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = router;