"use client";

import { Github, Menu, X, Palette, Box, Type, Square, Hexagon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Color from "color";
import { TABS } from "@/data/enum";

interface HeaderProps {
	setCurrentTab?: (tab: string) => void;
}

const TAB_COLOR_MAP: Record<string, { bg: string; text: string }> = {
	blue: { bg: "bg-blue-500/20", text: "text-blue-600" },
	green: { bg: "bg-green-500/20", text: "text-green-600" },
	purple: { bg: "bg-purple-500/20", text: "text-purple-600" },
	pink: { bg: "bg-pink-500/20", text: "text-pink-600" },
};

const TAB_ICONS: Record<string, React.ReactNode> = {
	boxShadow: <Box className="w-5 h-5" />,
	border: <Square className="w-5 h-5" />,
	text: <Type className="w-5 h-5" />,
	shape: <Hexagon className="w-5 h-5" />,
};

export function Header({ setCurrentTab }: HeaderProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isColorOpen, setIsColorOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<string>("boxShadow");
	const [color, setColor] = useState<string>("#ffffff");
	const [mounted, setMounted] = useState(false);
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const lastScrollY = useRef(0);
	const colorPickerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMounted(true);
		if (typeof window !== "undefined") {
			document.body.style.backgroundColor = "#ffffff";
			setColor("#ffffff");
		}
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
				setIsHeaderVisible(false);
			} else {
				setIsHeaderVisible(true);
			}

			lastScrollY.current = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
				setIsColorOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
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
		document.body.style.backgroundColor = "#ffffff";
		setColor("#ffffff");
		setIsColorOpen(false);
	};

	const tabClick = (tabValue: string) => {
		setActiveTab(tabValue);
		if (setCurrentTab) {
			setCurrentTab(tabValue);
		}
		setIsSidebarOpen(false);
	};

	if (!mounted) {
		return (
			<>
				<div className="md:hidden bg-white border-b border-gray-200 h-14 flex items-center px-4">
					<div className="flex items-center gap-2">
						<img src="/favicon.ico" alt="HeyCSS" className="w-7 h-7" />
						<span className="text-base font-bold text-gray-900">HeyCSS</span>
					</div>
				</div>
				<header
			className={`fixed top-4 left-4 right-4 z-50 hidden md:block transition-transform duration-300 ease-in-out ${
				isHeaderVisible ? "translate-y-0" : "-translate-y-[calc(100%+40px)]"
			}`}>
					<div className="max-w-7xl mx-auto">
						<div className="h-14 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg" />
					</div>
				</header>
				<footer className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-t border-gray-200">
					<nav className="flex items-center justify-around h-14">
						{TABS.map((tab) => (
							<button
								key={tab.value}
								onClick={() => tabClick(tab.value)}
								className={`flex flex-col items-center justify-center flex-1 h-full transition-colors cursor-pointer ${
									activeTab === tab.value ? TAB_COLOR_MAP[tab.colorClass]?.text || "text-gray-400" : "text-gray-400"
								}`}>
								{TAB_ICONS[tab.value]}
								<span className="text-[10px] mt-0.5">{tab.label}</span>
							</button>
						))}
					</nav>
				</footer>
			</>
		);
	}

	return (
		<>
			<div className="md:hidden bg-white border-b border-gray-200 h-14 flex items-center px-4">
				<div className="flex items-center gap-2">
					<img src="/favicon.ico" alt="HeyCSS" className="w-7 h-7" />
					<span className="text-base font-bold text-gray-900">HeyCSS</span>
				</div>
			</div>
			<header
			className={`fixed top-4 left-4 right-4 z-50 hidden md:block transition-transform duration-300 ease-in-out ${
				isHeaderVisible ? "translate-y-0" : "-translate-y-[calc(100%+40px)]"
			}`}>
				<div className="max-w-7xl mx-auto">
					<div className="h-14 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg">
						<div className="h-full px-4 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-2">
									<img src="/favicon.ico" alt="HeyCSS" className="w-8 h-8" />
									<span className="text-lg font-bold text-gray-900 tracking-tight">HeyCSS</span>
								</div>

								<nav className="hidden md:flex items-center gap-1 ml-6">
									{TABS.map((tab) => (
										<button
											key={tab.value}
											onClick={() => tabClick(tab.value)}
											className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
												activeTab === tab.value
													? `${TAB_COLOR_MAP[tab.colorClass]?.bg} ${TAB_COLOR_MAP[tab.colorClass]?.text}`
													: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
											}`}>
											{TAB_ICONS[tab.value]}
											<span>{tab.label}</span>
										</button>
									))}
								</nav>
							</div>

							<div className="flex items-center gap-2">
								<a
									href="https://github.com/isixe/HeyCss"
									target="_blank"
									rel="noopener noreferrer"
									className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer">
									<Github className="w-5 h-5" />
								</a>

								<div className="relative" ref={colorPickerRef}>
									<button
										onClick={toggleColor}
										className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer flex items-center gap-2"
										aria-label="Toggle color picker">
										<Palette className="w-5 h-5" />
										<div
											className="w-4 h-4 rounded-md border border-gray-300"
											style={{ backgroundColor: parseToHex(color) ?? color }}
										/>
									</button>

									{isColorOpen && (
										<div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
											<div className="flex flex-col gap-3">
												<label className="text-sm text-gray-700 font-medium">Background Color</label>
												<div className="flex items-center gap-3">
													<input
														type="color"
														value={parseToHex(color) ?? "#ffffff"}
														onChange={(e) => handleColorChange(e.target.value)}
														className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200 p-0.5"
													/>
													<input
														type="text"
														value={color}
														onChange={(e) => handleTextChange(e.target.value)}
														placeholder="#RRGGBB"
														className={`flex-1 h-12 px-4 rounded-xl border ${
															parseToHex(color)
																? "border-gray-200 bg-gray-50 text-gray-700"
																: "border-red-500/50 bg-red-500/10 text-red-500"
														} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all`}
													/>
												</div>
												<div className="flex gap-2 pt-1">
													<button
														onClick={handleReset}
														className="flex-1 h-9 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
														Reset
													</button>
													<button
														onClick={() => setIsColorOpen(false)}
														className="flex-1 h-9 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors cursor-pointer">
														Done
													</button>
												</div>
											</div>
										</div>
									)}
								</div>

								<button
									onClick={toggleSidebar}
									className="md:hidden p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
									aria-label="Toggle menu">
									<Menu className="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</header>

			<footer className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-t border-gray-200">
			<nav className="flex items-center justify-around h-14">
				{TABS.map((tab) => (
					<button
						key={tab.value}
						onClick={() => tabClick(tab.value)}
						className={`flex flex-col items-center justify-center flex-1 h-full transition-colors cursor-pointer ${
							activeTab === tab.value ? TAB_COLOR_MAP[tab.colorClass]?.text || "text-gray-400" : "text-gray-400"
						}`}>
						{TAB_ICONS[tab.value]}
						<span className="text-[10px] mt-0.5">{tab.label}</span>
					</button>
				))}
			</nav>
		</footer>

			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
					onClick={toggleSidebar}
				/>
			)}

			<div
				className={`fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-xl border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-out z-50 md:hidden ${
					isSidebarOpen ? "translate-x-0" : "translate-x-full"
				}`}>
				<div className="flex items-center justify-between p-4 border-b border-gray-200">
					<span className="text-lg font-semibold text-gray-900">Menu</span>
					<button
						onClick={toggleSidebar}
						className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
						aria-label="Close menu">
						<X className="w-5 h-5" />
					</button>
				</div>

				<nav className="p-4">
					<div className="space-y-2">
						{TABS.map((tab) => (
							<button
								key={tab.value}
								onClick={() => tabClick(tab.value)}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 cursor-pointer ${
									activeTab === tab.value
										? `${TAB_COLOR_MAP[tab.colorClass]?.bg} ${TAB_COLOR_MAP[tab.colorClass]?.text}`
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
								}`}>
								{TAB_ICONS[tab.value]}
								<span className="font-medium">{tab.label}</span>
							</button>
						))}
					</div>
				</nav>

				<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
					<a
						href="https://github.com/isixe/HeyCss"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
						<Github className="w-5 h-5" />
						<span className="font-medium">View on GitHub</span>
					</a>
				</div>
			</div>
		</>
	);
}
