import NavBar from "./NavBar";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="m-auto max-w-7xl p-4">{children}</main>
    </>
  );
}
