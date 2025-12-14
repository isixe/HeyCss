"use client";

import { Github, Menu, X, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Color from "color";
import { TABS } from "@/data/enum";

interface HeaderProps {
	setCurrentTab?: (tab: string) => void;
}

export function Header({ setCurrentTab }: HeaderProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isColorOpen, setIsColorOpen] = useState(false);
	const [color, setColor] = useState<string>("#ffffff");
	const originalBg = useRef<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			originalBg.current = document.body.style.backgroundColor || getComputedStyle(document.body).backgroundColor;
			const computed = originalBg.current;
			// try to convert named colors like 'transparent' to hex fallback white
			if (!computed || computed === "transparent") {
				setColor("#ffffff");
			} else {
				// no reliable builtin conversion to hex — keep initial color as white in picker
				setColor("#ffffff");
			}
		}
	}, []);
	const toggleSidebar = () => setIsSidebarOpen((v) => !v);
	const toggleColor = () => setIsColorOpen((v) => !v);

	const parseToHex = (v: string): string | null => {
		try {
			const c = Color(v);
			return c.hex().toLowerCase();
		} catch (e) {
			return null;
		}
	};

	const handleColorChange = (value: string) => {
		const hex = parseToHex(value) ?? value.toLowerCase();
		setColor(hex);
		document.body.style.backgroundColor = hex;
	};

	const handleTextChange = (value: string) => {
		let v = value.trim();
		if (!v.startsWith("#") && !/^rgb|hsl/i.test(v)) v = `#${v}`;
		const hex = parseToHex(v);
		if (hex) {
			setColor(hex);
			document.body.style.backgroundColor = hex;
		} else {
			setColor(value);
		}
	};

	const handleReset = () => {
		if (originalBg.current !== null) {
			document.body.style.backgroundColor = originalBg.current as string;
		}
		setIsColorOpen(false);
	};

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
							href="https://github.com/isixe/HeyCss"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-600 hover:text-gray-900 transition-colors">
							<Github className="h-5 w-5" />
						</a>

						{/* Color picker button */}
						<div className="relative ml-3">
							<button
								onClick={toggleColor}
								className="text-gray-600 hover:text-gray-900 transition-colors p-2 flex items-center"
								aria-label="Toggle color picker">
								<Palette className="h-5 w-5" />
							</button>

							{isColorOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded p-3 z-50">
									<div className="flex flex-col space-y-2">
										<label className="text-sm text-gray-700">Background Color</label>
										<input
											type="color"
											value={parseToHex(color) ?? "#ffffff"}
											onChange={(e) => handleColorChange(e.target.value)}
											className="w-full h-10 p-0 border-none"
										/>
										<input
											type="text"
											value={color}
											onChange={(e) => handleTextChange(e.target.value)}
											placeholder="#RRGGBB"
											className={`w-full h-9 p-2 border ${
												parseToHex(color) ? "border-gray-200" : "border-red-500"
											} rounded`}
										/>
										<div className="flex justify-end space-x-2">
											<button onClick={handleReset} className="text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
												Reset
											</button>
											<button
												onClick={() => setIsColorOpen(false)}
												className="text-sm px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
												Close
											</button>
										</div>
									</div>
								</div>
							)}
						</div>

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
