const axios = require('axios');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb://tonygallagher:mongoDbBuepo575@ac-qheewkd-shard-00-00.ho3uhlx.mongodb.net:27017,ac-qheewkd-shard-00-01.ho3uhlx.mongodb.net:27017,ac-qheewkd-shard-00-02.ho3uhlx.mongodb.net:27017/?ssl=true&replicaSet=atlas-14b891-shard-0&authSource=admin&retryWrites=true&w=majority"; // Replace with your MongoDB URI
const apiHeaders = {
  'X-RapidAPI-Key': '1e268d8c03mshf35226f7e04a3d8p149622jsnc0776468dcdb', 
  'X-RapidAPI-Host': 'rugby-live-data.p.rapidapi.com',
};

async function fetchAndStoreData() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Fetch competitions data
    const competitionsResponse = await axios.get(
      'https://rugby-live-data.p.rapidapi.com/competitions',
      { headers: apiHeaders }
    );
    const competitionsData = competitionsResponse.data.results;

    // Store competitions data in MongoDB
    const competitionsCollection = db.collection('competitions');
    await competitionsCollection.insertMany(competitionsData);

    // Loop through competitions and fetch related data
    for (const competition of competitionsData) {
      const { id, season } = competition;

      // Fetch teams data for the competition
      const teamsResponse = await axios.get(
        `https://rugby-live-data.p.rapidapi.com/teams/${id}/${season}`,
        { headers: apiHeaders }
      );
      const teamsData = teamsResponse.data.results;
      console.log('Team', teamsData)

      // Check if dataArray is empty
      if (teamsData.length === 0) {
        console.log("No data to insert.");
      } else if (Array.isArray(teamsData)) {
        const teamsCollection = db.collection('teams');
        await teamsCollection.insertMany(teamsData);
      }

      // Fetch fixtures data for the competition
      const fixturesResponse = await axios.get(
        `https://rugby-live-data.p.rapidapi.com/fixtures/${id}/${season}`,
        { headers: apiHeaders }
      );
      const fixturesData = fixturesResponse.data;
      console.log('Fixtures', fixturesData)

      if (fixturesData.length === 0) {
        console.log("No data to insert.");
      } else if (Array.isArray(fixturesData)) {
        // Store fixtures data in MongoDB
        const fixturesCollection = db.collection('fixtures');
        await fixturesCollection.insertMany(fixturesData);
      }

      // Fetch standings data for the competition
      const standingsResponse = await axios.get(
        `https://rugby-live-data.p.rapidapi.com/standings/${id}/${season}`,
        { headers: apiHeaders }
      );
      const standingsData = standingsResponse.data;
      console.log('Standings', standingsData)

      if (standingsData.length === 0) {
        console.log("No data to insert.");
      } else if (Array.isArray(standingsData)) {
        // Store standings data in MongoDB
        const standingsCollection = db.collection('standings');
        await standingsCollection.insertMany(standingsData);
      }

      console.log(`Data for competition ID ${id} and season ${season} stored.`);
    }

    client.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

fetchAndStoreData();
