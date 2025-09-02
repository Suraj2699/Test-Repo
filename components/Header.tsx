"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import type { Role } from "@prisma/client";

import Button from "@/components/ui/Button";
import Sidebar from "@/components/dashboard/Sidebar";
import { NAV_LINKS, type NavLink } from "@/config/nav";

const cx = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function dedupeLinks(links: NavLink[]) {
  const seen = new Set<string>();
  const out: NavLink[] = [];
  for (const l of links) {
    const key = `${l.label}::${l.href ?? ""}::${l.action ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(l);
    }
  }
  return out;
}

const HeaderComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const isDashboard = pathname.startsWith("/dashboard");

  // With preloaded session, status should be "authenticated" immediately.
  const isAuthed = status === "authenticated" && !!session?.user;

  const role: Role = useMemo(() => {
    return ((session?.user as any)?.role as Role) ?? "BUYER";
  }, [session]);

  const { routes, actions } = useMemo(() => {
    const visible = NAV_LINKS.filter((l) => l.roles.includes(role));
    const deduped = dedupeLinks(visible);
    return {
      routes: deduped.filter((l) => !l.action && l.href),
      actions: deduped.filter((l) => !!l.action),
    };
  }, [role]);

  const isActive = useCallback(
    (href?: string, exact?: boolean) =>
      href
        ? exact
          ? pathname === href
          : href === "/"
            ? pathname === "/"
            : pathname.startsWith(href)
        : false,
    [pathname]
  );

  // Close panels on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Outside-click/Esc for user menu
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDocClick = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(t) &&
        userBtnRef.current &&
        !userBtnRef.current.contains(t)
      ) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDocClick, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  // Lock scroll when mobile drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const doc = document.documentElement;
    const prev = doc.style.overflow;
    doc.style.overflow = "hidden";
    return () => {
      doc.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Avatar
  const userAvatar = useMemo(() => {
    const u: any = session?.user ?? {};
    const url: string = u.image ?? "";
    const display =
      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      u.name ||
      (u.email ? String(u.email).split("@")[0] : "User");
    const initials =
      display
        .trim()
        .split(/\s+/)
        .map((s: string) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";
    return { url, name: display, initials };
  }, [session]);

  const handleSignOut = useCallback(() => signOut({ callbackUrl: "/" }), []);

  // Sidebar props
  const sidebarRole: "WELLNESS_PROVIDER" | "BRAND_PARTNER" =
    role === "BRAND_PARTNER" ? "BRAND_PARTNER" : "WELLNESS_PROVIDER";
  const sidebarStore =
    sidebarRole === "BRAND_PARTNER" ? "My Brand Store" : "My Provider Store";

  return (
    <header className="sticky top-0 z-50 w-full bg-background text-foreground shadow-sm">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen ? (
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              ) : (
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              )}
            </svg>
          </button>

          <Link
            href="/"
            className="hidden items-center md:flex"
            aria-label="Cleeri home"
            prefetch={false}
          >
            <Image
              src="/images/CleeriLogo.png"
              alt="Cleeri"
              width={100}
              height={28}
              sizes="(min-width:1024px) 100px, (min-width:640px) 80px, 60px"
              priority
              className="h-auto w-[60px] sm:w-[80px] md:w-[100px]"
            />
          </Link>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-6">
          {/* Logged out (desktop) */}
          {!isDashboard && !isAuthed && (
            <div className="hidden items-center gap-6 md:flex">
              <Button variant="secondary" size="md" onClick={() => router.push("/login")}>
                Sign in
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                aria-label="Open cart"
                onClick={() => router.push("/checkout")}
                leftImage={{ src: "/images/img_shopping_bag.svg", width: 20, height: 20 }}
              >
                Cart
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[12px] font-semibold leading-none text-white">
                  <span className="sr-only">Items in cart:</span>0
                </span>
              </Button>
            </div>
          )}

          {/* Logged in (desktop): Cart + avatar */}
          {isAuthed && (
            <>
              <Button
                type="button"
                variant="outline"
                size="md"
                aria-label="Open cart"
                onClick={() => router.push("/checkout")}
                leftImage={{ src: "/images/img_shopping_bag.svg", width: 20, height: 20 }}
              >
                Cart
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[12px] font-semibold leading-none text-white">
                  <span className="sr-only">Items in cart:</span>0
                </span>
              </Button>

              <div className="hidden items-center md:flex">
                <div className="relative">
                  <button
                    ref={userBtnRef}
                    type="button"
                    onClick={() => setUserMenuOpen((s) => !s)}
                    className="flex h-11 items-center gap-2 rounded-full hover:bg-foreground/5"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-label="User menu"
                  >
                    {userAvatar.url ? (
                      <Image
                        src={userAvatar.url}
                        alt={userAvatar.name}
                        width={44}
                        height={44}
                        sizes="44px"
                        className="h-11 w-11 cursor-pointer rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground/70">
                        {userAvatar.initials}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div
                      ref={userMenuRef}
                      role="menu"
                      className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-md border border-border bg-background shadow-lg"
                    >
                      <ul className="py-1">
                        {routes.map((item) => (
                          <li key={`route-${item.label}`}>
                            {item.external ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/5 focus:bg-foreground/5 focus:outline-none"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                {item.label}
                              </a>
                            ) : (
                              <Link
                                href={item.href ?? "#"}
                                prefetch={false}
                                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/5 focus:bg-foreground/5 focus:outline-none"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            )}
                          </li>
                        ))}

                        {routes.length > 0 && <li className="my-1 h-px bg-border" />}

                        {actions.map((item) =>
                          item.action === "signout" ? (
                            <li key="action-signout" className="px-2 py-1">
                              <Button
                                variant="outline"
                                size="md"
                                className="w-full"
                                onClick={handleSignOut}
                              >
                                {item.label}
                              </Button>
                            </li>
                          ) : (
                            <li key={`action-${item.label}`}>
                              <Link
                                href={item.href ?? "#"}
                                prefetch={false}
                                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/5 focus:bg-foreground/5 focus:outline-none"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MOBILE DRAWERS */}
      {mobileOpen && isDashboard && (
        <Sidebar
          role={role === "BRAND_PARTNER" ? "BRAND_PARTNER" : "WELLNESS_PROVIDER"}
          activeOverride={pathname}
          storeName={role === "BRAND_PARTNER" ? "My Brand Store" : "My Provider Store"}
          userName={userAvatar.name}
          mobile
          onClose={() => setMobileOpen(false)}
        />
      )}

      {mobileOpen && !isDashboard && (
        <div className="fixed inset-0 z-[61] md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[80vw] max-w-sm border-r border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <Link
                href="/"
                aria-label="Cleeri home"
                className="flex items-center"
                onClick={() => setMobileOpen(false)}
                prefetch={false}
              >
                <Image
                  src="/images/CleeriLogo.png"
                  alt="Cleeri"
                  width={100}
                  height={28}
                  sizes="100px"
                  priority
                  className="h-auto w-[88px]"
                />
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-2 px-4 py-4" aria-label="Primary">
              {isAuthed ? (
                <>
                  {routes.map((link) =>
                    link.external ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={cx(
                          "rounded-md px-3 py-2 hover:bg-foreground/5 focus:bg-foreground/5 focus:outline-none",
                          isActive(link.href, link.exact)
                            ? "text-foreground"
                            : "text-foreground/80"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href ?? "#"}
                        prefetch={false}
                        className={cx(
                          "rounded-md px-3 py-2 hover:bg-foreground/5 focus:bg-foreground/5 focus:outline-none",
                          isActive(link.href, link.exact)
                            ? "text-foreground"
                            : "text-foreground/80"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )
                  )}

                  {actions.map((item) =>
                    item.action === "signout" ? (
                      <Button
                        key="m-signout"
                        type="button"
                        variant="outline"
                        size="md"
                        className="mt-2"
                        onClick={() => {
                          setMobileOpen(false);
                          handleSignOut();
                        }}
                      >
                        {item.label}
                      </Button>
                    ) : (
                      <Link
                        key={`m-action-${item.label}`}
                        href={item.href ?? "#"}
                        prefetch={false}
                        className="rounded-md px-3 py-2 hover:bg-foreground/5 focus:bg-foreground/5 focus:outline-none"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    aria-label="Open cart"
                    className="mt-2"
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/checkout");
                    }}
                    leftImage={{ src: "/images/img_shopping_bag.svg", width: 20, height: 20 }}
                  >
                    Cart
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[12px] font-semibold leading-none text-white">
                      <span className="sr-only">Items in cart:</span>0
                    </span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  className="mt-3"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/login");
                  }}
                >
                  Sign in
                </Button>
              )}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
};

const Header = memo(HeaderComponent);
export default Header;
