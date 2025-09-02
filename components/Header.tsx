"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const cx = (...s: Array<string | false | null | undefined>) =>
    s.filter(Boolean).join(" ");

// Mock navigation links for demo
const mockNavLinks = [
    { label: "Dashboard", href: "/", roles: ["BUYER"] },
    { label: "My Orders", href: "/orders", roles: ["BUYER"] },
    { label: "My Account", href: "/account", roles: ["BUYER"] },
];

const HeaderComponent: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const isDashboard = pathname.startsWith("/dashboard");

    // Mock session data for demo
    const isAuthed = true; // Simplified for demo
    const role = "BUYER";

    const routes = mockNavLinks.filter((l) => l.roles.includes(role));

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

    // Mock user avatar
    const userAvatar = {
        url: "",
        name: "John Doe",
        initials: "JD"
    };

    const handleSignOut = useCallback(() => {
        console.log("Sign out clicked");
        router.push("/");
    }, [router]);

    return (
        <header className="sticky top-0 z-50 w-full bg-white text-gray-900 shadow-sm border-b">
            <div className="mx-auto flex items-center justify-between px-6 py-4">
                {/* Left: hamburger + logo */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 md:hidden"
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
                    >
                        <span className="text-xl font-bold text-orange-500">Cleeri</span>
                    </Link>
                </div>

                {/* Right cluster */}
                <div className="flex items-center gap-6">
                    {/* Logged out (desktop) */}
                    {!isDashboard && !isAuthed && (
                        <div className="hidden items-center gap-6 md:flex">
                            <button 
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                onClick={() => router.push("/login")}
                            >
                                Sign in
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                aria-label="Open cart"
                                onClick={() => router.push("/checkout")}
                            >
                                🛒 Cart
                                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[12px] font-semibold leading-none text-white">
                                    0
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Logged in (desktop): Cart + avatar */}
                    {isAuthed && (
                        <>
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                aria-label="Open cart"
                                onClick={() => router.push("/checkout")}
                            >
                                🛒 Cart
                                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[12px] font-semibold leading-none text-white">
                                    0
                                </span>
                            </button>

                            <div className="hidden items-center md:flex">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setUserMenuOpen((s) => !s)}
                                        className="flex h-11 items-center gap-2 rounded-full hover:bg-gray-50 p-1"
                                        aria-haspopup="menu"
                                        aria-expanded={userMenuOpen}
                                        aria-label="User menu"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                                            {userAvatar.initials}
                                        </div>
                                    </button>

                                    {userMenuOpen && (
                                        <div
                                            role="menu"
                                            className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
                                        >
                                            <ul className="py-1">
                                                {routes.map((item) => (
                                                    <li key={`route-${item.label}`}>
                                                        <Link
                                                            href={item.href ?? "#"}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}

                                                <li className="my-1 h-px bg-gray-200" />

                                                <li className="px-2 py-1">
                                                    <button
                                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                                                        onClick={handleSignOut}
                                                    >
                                                        Sign out
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* MOBILE DRAWER */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[61] md:hidden">
                    <button
                        aria-label="Close menu"
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 h-full w-[80vw] max-w-sm border-r border-gray-200 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                            <Link
                                href="/"
                                aria-label="Cleeri home"
                                className="flex items-center"
                                onClick={() => setMobileOpen(false)}
                            >
                                <span className="text-xl font-bold text-orange-500">Cleeri</span>
                            </Link>
                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200"
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
                                    {routes.map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.href ?? "#"}
                                            className={cx(
                                                "rounded-md px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                                                isActive(link.href)
                                                    ? "text-gray-900 bg-gray-100"
                                                    : "text-gray-700"
                                            )}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    <button
                                        type="button"
                                        className="mt-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            handleSignOut();
                                        }}
                                    >
                                        Sign out
                                    </button>

                                    <button
                                        type="button"
                                        className="mt-2 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                        aria-label="Open cart"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            router.push("/checkout");
                                        }}
                                    >
                                        🛒 Cart
                                        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[12px] font-semibold leading-none text-white">
                                            0
                                        </span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                                    onClick={() => {
                                        setMobileOpen(false);
                                        router.push("/login");
                                    }}
                                >
                                    Sign in
                                </button>
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
