import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "80px" }}>{children}</main>
    </>
  );
}
