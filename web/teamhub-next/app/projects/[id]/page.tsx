import { notFound } from "next/navigation";
import { projects } from "../../../data";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <div>
      <h1>{project.name}</h1>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Lead:</strong> {project.lead}</p>
      <p><strong>Tech:</strong> {project.techStack.join(", ")}</p>
    </div>
  );
}
