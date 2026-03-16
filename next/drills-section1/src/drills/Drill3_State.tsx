import { useState } from "react";

interface Book {
  title: string;
  author: string;
  isAvailable: boolean;
}

function ToggleBookCard({
  book,
  onToggle,
}: {
  book: Book;
  onToggle: () => void;
}) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <span
        className={`badge ${book.isAvailable ? "available" : "unavailable"}`}
      >
        {book.isAvailable ? "Available" : "Checked Out"}
      </span>
      <button onClick={onToggle} style={{ marginLeft: 8 }}>
        {book.isAvailable ? "Check Out" : "Return"}
      </button>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button className="secondary" onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

function SearchableBookList() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([
    { title: "Clean Code", author: "Robert C. Martin", isAvailable: true },
    { title: "Design Patterns", author: "GoF", isAvailable: false },
    { title: "Refactoring", author: "Martin Fowler", isAvailable: true },
    { title: "DDIA", author: "Martin Kleppmann", isAvailable: true },
  ]);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleBook(index: number) {
    setBooks(
      books.map((b, i) =>
        i === index ? { ...b, isAvailable: !b.isAvailable } : b,
      ),
    );
  }

  return (
    <div>
      <div className="search-bar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
        />
      </div>
      {filtered.map((book) => (
        <ToggleBookCard
          key={book.title}
          book={book}
          onToggle={() => toggleBook(books.indexOf(book))}
        />
      ))}
      {filtered.length === 0 && <p>No books found.</p>}
    </div>
  );
}

export default function Drill3() {
  return (
    <div className="drill-section">
      <h2>Drill 3: State and Interactivity</h2>
      <h3>Counter</h3>
      <Counter />
      <h3 style={{ marginTop: 16 }}>Searchable Book List</h3>
      <SearchableBookList />
    </div>
  );
}
