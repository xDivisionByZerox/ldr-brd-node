const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
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
    const players = faker.helpers.multiple(
      () => new Player({
          name: faker.person.findName(),
          winLossRatio: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
          elo: faker.number.int({ min: 1000, max: 3000 }),
      }),
      { count: 10 }
    );

    await Player.insertMany(players);
    console.log('Database seeded successfully');

    // Close the database connection
    db.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    db.close();
  }
});
