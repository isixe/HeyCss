"use client";

import { Heart, Github, Twitter, Mail } from "lucide-react";
import { TABS } from "@/data/enum";

interface FooterProps {
	setCurrentTab?: (tab: string) => void;
	currentTab?: string;
}

export function Footer({ setCurrentTab, currentTab }: FooterProps) {
	const tabClick = (tab: string, e: React.MouseEvent<HTMLAnchorElement>) => {
		if (setCurrentTab) {
			e.preventDefault();
			setCurrentTab(tab);
		}
	};

	return (
		<footer className="bg-gray-50 border-t border-gray-200 mt-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center mb-4">
							<h2 className="text-2xl font-bold ">HeyCSS</h2>
						</div>
						<p className="text-gray-600 text-sm mb-4 max-w-md">
							Beautiful predefined CSS styles ready to copy and customize. Save time and create stunning designs with
							our curated collection of CSS effects.
						</p>
						<div className="flex items-center text-sm text-gray-500">
							<span>Made with</span>
							<Heart className="h-4 w-4 text-red-500 mx-1" />
							<span>for developers</span>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
						<ul className="space-y-2">
							{TABS.map((tab) => (
								<li key={tab.value}>
									<a
										href={`#${tab.value.toLowerCase()}`}
										onClick={(e) => tabClick(tab.value, e)}
										className={
											"text-sm transition-colors cursor-pointer " +
											(currentTab === tab.value ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-gray-900")
										}>
										{tab.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* About */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">About</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="mailto:contact@heycss.com"
									className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
									Contact Us
								</a>
							</li>
							<li>
								<a
									href="mailto:feedback@heycss.com"
									className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
									Feedback
								</a>
							</li>
							<li>
								<a
									href="mailto:support@heycss.com"
									className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
									Support
								</a>
							</li>
							<li>
								<a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
									About Us
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-8 pt-8 border-t border-gray-200">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="text-sm text-gray-500 mb-4 md:mb-0">© 2024 HeyCSS. All rights reserved.</div>
						<div className="flex space-x-4">
							<a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-gray-600 transition-colors">
								<Github className="h-5 w-5" />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-gray-600 transition-colors">
								<Twitter className="h-5 w-5" />
							</a>
							<a href="mailto:contact@heycss.com" className="text-gray-400 hover:text-gray-600 transition-colors">
								<Mail className="h-5 w-5" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
