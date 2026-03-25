import { projects, articles, team } from "../data";

export default function Home() {
  return (
    <div>
      <h1>TeamHub</h1>
      <div className="stats">
        <div className="card">
          <h2>{projects.length}</h2>
          <p>Projects</p>
        </div>
        <div className="card">
          <h2>{articles.length}</h2>
          <p>Articles</p>
        </div>
        <div className="card">
          <h2>{team.length}</h2>
          <p>Team Members</p>
        </div>
      </div>
    </div>
  );
}
