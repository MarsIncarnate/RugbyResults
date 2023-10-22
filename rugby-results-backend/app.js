const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = process.env.MONGO_URI;

async function run() {
  try {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Endpoint for Competitions
    app.get('/competitions', async (req, res) => {
      try {
        // Query data from MongoDB collections
        const competitionsCollection = db.collection('competitions');
        const data = await competitionsCollection.find({}).toArray();

        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // Endpoint for Teams
    app.get('/teams/:compId/:season', async (req, res) => {
      try {
        const compId = req.params.teamId;
        const season = req.params.season;

        // Query data from MongoDB collections
        const teamsCollection = db.collection('teams');
        const data = await teamsCollection.find({ comp_id: compId, season: season }).toArray();

        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // Endpoint for Fixtures
    app.get('/fixtures/:compId/:season', async (req, res) => {
      try {
        const compId = req.params.compId;
        const season = req.params.season;

        // Query data from MongoDB collections
        const fixturesCollection = db.collection('fixtures');
        const data = await fixturesCollection.find({ comp_id: +(compId), season: season }).toArray();

        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // Endpoint for Fixtures by Date
    app.get('/fixtures-by-date/:date', async (req, res) => {
      try {
        const date = req.params.date;

        // Query data from MongoDB collections
        const fixturesByDateCollection = db.collection('fixtures_by_date');
        const data = await fixturesByDateCollection.find({ date: date }).toArray();

        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // Endpoint for Standings
    app.get('/standings/:compId/:season', async (req, res) => {
      try {
        const compId = req.params.compId;
        const season = req.params.season;

        // Query data from MongoDB collections
        const standingsCollection = db.collection('standings');
        const data = await standingsCollection.find({ comp_id: compId, season: season }).toArray();

        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // Endpoint for Fixtures and Results by Team
    app.get('/fixtures-and-results-by-team/:teamId', async (req, res) => {
      try {
        const teamId = req.params.teamId;

        // Query data from MongoDB collections
        const fixturesResultsByTeamCollection = db.collection('fixtures_results_by_team');
        const data = await fixturesResultsByTeamCollection.find({ team_id: teamId }).toArray();

        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);
