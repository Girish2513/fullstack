import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata = {
  title: "TeamHub",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/team">Team</Link>
          {session ? (
            <Link href="/me">My Profile</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}
