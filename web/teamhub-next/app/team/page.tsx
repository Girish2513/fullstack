import { team } from "../../data";

export default function TeamPage() {
  return (
    <div>
      <h1>Team</h1>
      <div className="stats">
        {team.map((t) => (
          <div className="card" key={t.id}>
            <h2>{t.name}</h2>
            <p>{t.role} · {t.department}</p>
            <p>{t.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
