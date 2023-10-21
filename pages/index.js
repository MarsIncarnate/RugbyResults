// pages/index.js

import axios from 'axios';
import CompetitionList from '../components/CompetitionList';

function Home({ competitions }) {
  return (
    <div>
      <h1>Competitions</h1>
      <CompetitionList competitions={competitions} />
    </div>
  );
}

Home.getInitialProps = async () => {
  const response = await axios.get('http://localhost:3000/api/competitions'); 
  const competitions = response.data;
  return { competitions };
};

export default Home;
