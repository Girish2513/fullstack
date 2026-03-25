import Link from "next/link";
import { projects } from "../../data";
import ProjectSearch from "../../components/ProjectSearch";

export default function ProjectsPage() {
  console.log("rendered on server");

  return (
    <div>
      <h1>Projects</h1>
      <ProjectSearch projects={projects} />
    </div>
  );
}
