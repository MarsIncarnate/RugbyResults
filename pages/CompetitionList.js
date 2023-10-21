// components/CompetitionList.js

function CompetitionList({ competitions }) {
    return (
      <ul>
        {competitions.map((competition) => (
          <li key={competition.id}>
            <a href={`/competition/${competition.id}`}>{competition.name}</a>
          </li>
        ))}
      </ul>
    );
  }
  
  export default CompetitionList;
  