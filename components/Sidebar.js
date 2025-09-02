import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/", label: "My Shops", icon: "🏬" },
  { href: "/orders", label: "My Orders", icon: "📦" },
  { href: "/coupons", label: "My Coupons", icon: "🎟️" },
  { href: "/earnings", label: "My Earnings", icon: "💰" },
  { href: "/account", label: "My Account", icon: "👤" },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">C</span>
        <span className="brand-name">Cleeri</span>
      </div>

      <div className="sidebar-actions">
        <Link className="primary-action" href="/add-item">Add Item</Link>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {navItems.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={"nav-link" + (active ? " is-active" : "")}
            >
              <span className="nav-icon" aria-hidden>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link className="muted-link" href="/logout">Log Out</Link>
      </div>
    </aside>
  );
}
