// pages/competition/[id].js

import axios from 'axios';

function Competition({ competition }) {
  return (
    <div>
      <h1>{competition.name}</h1>
      {/* teams, fixtures, standings */}
    </div>
  );
}

Competition.getInitialProps = async ({ query }) => {
  const { id } = query;
  const response = await axios.get(`http://localhost:3000/api/competition/${id}`); 
  const competition = response.data;
  return { competition };
};

export default Competition;
