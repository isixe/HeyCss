"use client";

import { Heart, Github, Twitter, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { TABS } from "@/data/enum";

const TAB_COLOR_MAP: Record<string, { text: string }> = {
	blue: { text: "text-blue-600" },
	green: { text: "text-green-600" },
	purple: { text: "text-purple-600" },
	pink: { text: "text-pink-600" },
};

export function Footer() {
	const pathname = usePathname();
	const t = useTranslations();
	const currentTab = pathname.split("/")[1] || "boxShadow";

	return (
		<footer className="bg-gray-50 border-t border-gray-200 mt-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center mb-4">
							<h2 className="text-2xl font-bold ">HeyCSS</h2>
						</div>
						<p className="text-gray-600 text-sm mb-4 max-w-md">{t("footer.description")}</p>
						<div className="flex items-center text-sm text-gray-500">
							<span>{t("footer.madeWith")}</span>
							<Heart className="h-4 w-4 text-red-500 mx-1" />
							<span>{t("footer.forDevelopers")}</span>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
							{t("footer.quickLinks")}
						</h3>
						<ul className="space-y-2">
							{TABS.map((tab) => (
								<li key={tab.value}>
									<Link
										href={`/${tab.value}`}
										onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
										className={
											"text-sm transition-colors cursor-pointer " +
											(currentTab === tab.value
												? `${TAB_COLOR_MAP[tab.colorClass]?.text} font-semibold`
												: "text-gray-600 hover:text-gray-900")
										}>
										{t(`tabs.${tab.value}`)}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* About */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("footer.about")}</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="mailto:isixe@outlook.com"
									className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
									{t("footer.contact")}
								</a>
							</li>
							<li>
								<a
									href="https://github.com/isixe/HeyCss"
									className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
									target="_blank">
									{t("footer.feedback")}
								</a>
							</li>
							<li>
								<a
									href="https://itea.dev"
									className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
									target="_blank">
									{t("footer.aboutLab")}
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-8 pt-8 border-t border-gray-200">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="text-sm text-gray-500 mb-4 md:mb-0">{t("footer.copyright")}</div>
						<div className="flex space-x-4">
							<a
								href="https://github.com/isixe/HeyCss"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-gray-600 transition-colors">
								<Github className="h-5 w-5" />
							</a>
							<a
								href="https://twitter.com/isixe_e"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-gray-600 transition-colors">
								<Twitter className="h-5 w-5" />
							</a>
							<a href="mailto:isixe@outlook.com" className="text-gray-400 hover:text-gray-600 transition-colors">
								<Mail className="h-5 w-5" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
