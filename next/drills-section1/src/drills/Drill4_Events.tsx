import { useState } from "react";

interface Book {
  title: string;
  author: string;
}

function AddBookForm({ onAdd }: { onAdd: (book: Book) => void }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //prevents reload page
    if (!title.trim() || !author.trim()) return;
    onAdd({ title: title.trim(), author: author.trim() });
    setTitle("");
    setAuthor("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitle("");
      setAuthor("");
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Book title"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author name"
      />
      <button type="submit">Add Book</button>
    </form>
  );
}

export default function Drill4() {
  const [books, setBooks] = useState<Book[]>([
    { title: "Clean Code", author: "Robert C. Martin" },
  ]);

  function addBook(book: Book) {
    setBooks([...books, book]);
  }

  function removeBook(index: number) {
    setBooks(books.filter((book, i) => i !== index));
  }

  return (
    <div className="drill-section">
      <h2>Drill 4: Event Handling</h2>
      <AddBookForm onAdd={addBook} />
      <div style={{ marginTop: 16 }}>
        {books.map((book, i) => (
          <div key={i} className="book-card">
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <button className="danger" onClick={() => removeBook(i)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      {books.length === 0 && <p>No books yet. Add one above.</p>}
    </div>
  );
}
