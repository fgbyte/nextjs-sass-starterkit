"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-[1px] ${
				isScrolled ? "backdrop-blur-md" : "bg-transparent"
			}`}
		>
			<nav
				className={`px-4 py-4 lg:px-8 mx-auto max-w-7xl ${isMenuOpen ? "backdrop-blur-md" : ""}`}
			>
				<div className="flex flex-wrap justify-between items-center">
					<div className="flex items-center">
						<Link
							href="/"
							className="text-xl flex gap-2 items-end font-semibold"
						>
							<img
								src="/favicon.ico"
								alt="avatar"
								className="w-8 h-8 object-cover"
							/>
							ACME
						</Link>
					</div>
					<button
						type="button"
						className="sm:hidden focus:outline-none"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? (
							<X className="w-6 h-6" style={{ color: "var(--icon-color)" }} />
						) : (
							<Menu
								className="w-6 h-6"
								style={{ color: "var(--icon-color)" }}
							/>
						)}
					</button>
					<div
						className={`w-full mt-4 sm:w-auto sm:block sm:mt-0 ${
							isMenuOpen ? "block" : "hidden"
						}`}
					>
						<div className="flex font-bold flex-col sm:flex-row sm:items-center sm:space-x-8">
							{["Docs", "Pricing"].map((item) => (
								<Link
									key={item}
									href={`/${item.toLowerCase()}`}
									className="text-sm hover:underline transition-colors py-2 sm:py-0 relative group"
								>
									{item}
								</Link>
							))}
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}
