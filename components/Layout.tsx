import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-area">
        <Header />
        <main className="page-content" role="main">{children}</main>
      </div>
    </div>
  );
}
