import Link from "next/link";
import { articles } from "../../data";

export default function ArticlesPage() {
  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map((a) => (
          <li key={a.id}>
            <Link href={`/articles/${a.id}`}>{a.title}</Link>
            <br />
            <small>By {a.author} · {a.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
