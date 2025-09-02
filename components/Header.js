import Link from "next/link";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="page-title">My Account</h1>
      </div>
      <div className="header-actions">
        <Link className="ghost-action" href="/create">Create New</Link>
        <Link className="ghost-action" href="/preview">Preview Store</Link>
        <Link className="cart-button" href="/cart">Cart</Link>
      </div>
    </header>
  );
}
