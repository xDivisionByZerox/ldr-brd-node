const faker = require('faker');
const mongoose = require('mongoose');
const PlayerStats = require('./models/player');
const Match = require('./models/match');

// Set up MongoDB connection
mongoose.connect('mongodb+srv://tejasvinu:HRvEphb6CKgeWBYf@aperta.u4lsf.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to generate player stats data using Faker
const generatePlayerStatsData = async () => {
  try {
    // Fetch existing match data from the database
    const matches = await Match.find();

    const playerStatsData = [];

    // Iterate over match data to update player stats
    matches.forEach((match) => {
      const { player1, player2, winner } = match;

      // Check if player1 exists in playerStatsData, create if not
      if (!playerStatsData.some((player) => player.name === player1)) {
        playerStatsData.push({
          name: player1,
          elo: faker.random.number(2000), // Assign a random ELO score using Faker
        });
      }

      // Check if player2 exists in playerStatsData, create if not
      if (!playerStatsData.some((player) => player.name === player2)) {
        playerStatsData.push({
          name: player2,
          elo: faker.random.number(2000), // Assign a random ELO score using Faker
        });
      }

      // Update player stats based on match results
      playerStatsData.forEach((player) => {
        if (player.name === winner) {
          player.elo += 10; // Increase ELO for the winner
        } else {
          player.elo -= 10; // Decrease ELO for the loser
        }
      });
    });

    // Save the updated player stats data to the database
    await PlayerStats.insertMany(playerStatsData);
    console.log('Player stats data seeded successfully!');
  } catch (error) {
    console.error('Error seeding player stats data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Call the generatePlayerStatsData function to start the seeding process
generatePlayerStatsData();
