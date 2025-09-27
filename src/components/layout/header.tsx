"use client";

import { Github, Menu, X } from "lucide-react";
import { useState } from "react";
import { TABS } from "@/data/enum";

interface HeaderProps {
	setCurrentTab?: (tab: string) => void;
}

export function Header({ setCurrentTab }: HeaderProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const toggleSidebar = () => setIsSidebarOpen((v) => !v);

	const tabClick = (tabValue: string) => {
		if (setCurrentTab) {
			setCurrentTab(tabValue);
		}
		setIsSidebarOpen(false);
	};

	return (
		<header className="bg-transparent border-b-0">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Left */}
					<div className="flex items-center">
						<div className="flex flex-row space-x-2">
							<img src="/favicon.ico" alt="Logo" className="h-9 w-9" />
							<h1 className="text-2xl font-bold text-gray-900">HeyCSS</h1>
						</div>
					</div>

					{/* Right */}
					<div className="flex items-center">
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-600 hover:text-gray-900 transition-colors">
							<Github className="h-5 w-5" />
						</a>

						{/* Menu (Mobile) */}
						<div className="md:hidden">
							<button
								onClick={toggleSidebar}
								className="text-gray-600 hover:text-gray-900 transition-colors p-2"
								aria-label="Toggle menu">
								<Menu className="h-6 w-6" />
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Sidebar mask */}
			{isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />}

			{/* Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
					isSidebarOpen ? "translate-x-0" : "translate-x-full"
				}`}>
				<div className="flex items-center justify-between p-4">
					<button
						onClick={toggleSidebar}
						className="text-gray-600 hover:text-gray-900 transition-colors p-1"
						aria-label="Close menu">
						<X className="h-5 w-5" />
					</button>
				</div>

				<nav className="p-4">
					<div className="space-y-4">
						{TABS.map((tab) => (
							<button
								key={tab.value}
								onClick={() => tabClick(tab.value)}
								className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors py-2 w-full text-left">
								<span>{tab.label}</span>
							</button>
						))}
					</div>
				</nav>
			</div>
		</header>
	);
}
