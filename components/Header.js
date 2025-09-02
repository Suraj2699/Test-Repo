import Link from "next/link";
import { useRouter } from "next/router";

const titles = {
  "/": "Dashboard",
  "/orders": "My Orders",
  "/coupons": "My Coupons",
  "/earnings": "My Earnings",
  "/account": "My Account",
};

export default function Header() {
  const { pathname } = useRouter();
  const title = titles[pathname] || "Cleeri";
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="header-actions">
        <Link className="ghost-action" href="/create">Create New</Link>
        <Link className="ghost-action" href="/preview">Preview Store</Link>
        <Link className="cart-button" href="/cart">Cart</Link>
      </div>
    </header>
  );
}
