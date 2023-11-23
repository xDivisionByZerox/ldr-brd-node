// seed.js

require('dotenv').config();
const faker = require('faker');
const mongoose = require('mongoose');
const Match = require('./models/match');

// Connect to your MongoDB database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    seedData();
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

// Seed match data
const seedData = async () => {
  try {
    // Create an array to hold the generated matches
    const matches = [];

    // Generate sample matches
    for (let i = 0; i < 10; i++) {
      const match = {
        date: faker.date.past(),
        player1: faker.name.firstName(),
        player2: faker.name.firstName(),
        winner: faker.random.arrayElement(['Player 1', 'Player 2']),
      };
      matches.push(match);
    }

    // Insert matches into the database
    await Match.insertMany(matches);
    console.log('Match data seeded successfully');

    // Disconnect from the database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding match data:', error);
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};
