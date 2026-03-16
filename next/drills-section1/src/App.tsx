import { useState } from "react";
import Drill1 from "./drills/Drill1_Components";
import Drill2 from "./drills/Drill2_Props";
import Drill3 from "./drills/Drill3_State";
import Drill4 from "./drills/Drill4_Events";
import Drill5 from "./drills/Drill5_Effects";
import Drill6 from "./drills/Drill6_Patterns";

const drills = [
  { name: "1: Components", component: Drill1 },
  { name: "2: Props", component: Drill2 },
  { name: "3: State", component: Drill3 },
  { name: "4: Events", component: Drill4 },
  { name: "5: Effects", component: Drill5 },
  { name: "6: Patterns", component: Drill6 },
];

function App() {
  const [active, setActive] = useState(0);
  const ActiveDrill = drills[active]!.component;

  return (
    <div className="app">
      <h1>React Drills</h1>
      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 4 }}>
        {drills.map((d, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={i === active ? "" : "secondary"}
          >
            {d.name}
          </button>
        ))}
      </div>
      <ActiveDrill />
    </div>
  );
}

export default App;
