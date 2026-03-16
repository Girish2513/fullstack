import { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=10",
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="book-card">
          <h3>{post.title}</h3>
          <p>{post.body.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="counter">
      <span>{seconds}s</span>
      <button onClick={() => setRunning(!running)}>
        {running ? "Pause" : "Start"}
      </button>
      <button
        className="secondary"
        onClick={() => {
          setRunning(false);
          setSeconds(0);
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default function Drill5() {
  return (
    <div className="drill-section">
      <h2>Drill 5: Effects and API Integration</h2>
      <h3>Timer (useEffect cleanup)</h3>
      <Timer />
      <h3 style={{ marginTop: 16 }}>API Fetch (jsonplaceholder)</h3>
      <PostList />
    </div>
  );
}
