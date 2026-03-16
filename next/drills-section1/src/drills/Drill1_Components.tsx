function BookCard({ title, author }: { title: string; author: string }) {
  return (
    <div className="book-card">
      <h3>{title}</h3>
      <p>by {author}</p>
    </div>
  );
}

function BookList() {
  const books = [
    { title: "Clean Code", author: "Robert C. Martin" },
    { title: "The Pragmatic Programmer", author: "David Thomas" },
    { title: "Refactoring", author: "Martin Fowler" },
  ];

  return (
    <div>
      {books.map((book, i) => (
        <BookCard key={i} title={book.title} author={book.author} />
      ))}
    </div>
  );
}

export default function Drill1() {
  return (
    <div className="drill-section">
      <h2>Drill 1: Components and JSX</h2>
      <BookList />
    </div>
  );
}
