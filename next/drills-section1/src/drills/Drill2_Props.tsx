interface BookCardProps {
  title: string;
  author: string;
  year: number;
  isAvailable?: boolean;
}

function BookCard({ title, author, year, isAvailable = true }: BookCardProps) {
  return (
    <div className="book-card">
      <h3>{title}</h3>
      <p>by {author} ({year})</p>
      <span className={`badge ${isAvailable ? "available" : "unavailable"}`}>
        {isAvailable ? "Available" : "Checked Out"}
      </span>
    </div>
  );
}

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="book-card">
      <h3>{user.name}</h3>
      <p>{user.email} - {user.role}</p>
    </div>
  );
}

export default function Drill2() {
  const books: BookCardProps[] = [
    { title: "Clean Code", author: "Robert C. Martin", year: 2008, isAvailable: true },
    { title: "Design Patterns", author: "GoF", year: 1994, isAvailable: false },
    { title: "DDIA", author: "Martin Kleppmann", year: 2017 },
  ];

  const user = { name: "Girish", email: "girish@example.com", role: "Developer" };

  return (
    <div className="drill-section">
      <h2>Drill 2: Props and Data Flow</h2>
      {books.map((book, i) => (
        <BookCard key={i} {...book} />
      ))}
      <h3 style={{ marginTop: 16 }}>User Profile</h3>
      <UserProfile user={user} />
    </div>
  );
}
