import { notFound } from "next/navigation";
import { articles } from "../../../data";

export default async function ArticleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);

  if (!article) notFound();

  return (
    <div>
      <h1>{article.title}</h1>
      <p><small>By {article.author} · {article.date}</small></p>
      <p>{article.body}</p>
    </div>
  );
}
