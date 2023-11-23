const mongoose = require('mongoose');
const faker = require('faker');
require('dotenv').config();

const Player = require('./models/player');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Clear existing players
    await Player.deleteMany({});

    // Generate fake players and save them to the database
    const players = [];
    for (let i = 0; i < 10; i++) {
      const player = new Player({
        name: faker.name.findName(),
        winLossRatio: faker.random.number({ min: 0, max: 1, precision: 0.01 }),
        elo: faker.random.number({ min: 1000, max: 3000 }),
      });
      players.push(player);
    }

    await Player.insertMany(players);
    console.log('Database seeded successfully');

    // Close the database connection
    db.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    db.close();
  }
});
