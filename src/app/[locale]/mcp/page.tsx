import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plug, List, Search, FileText } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { McpEndpointBlock } from "@/components/widget/mcp-endpoint-block";
import { routing } from "@/i18n/routing";

const TOOL_ICONS: Record<string, React.ReactNode> = {
	list: <List className="w-5 h-5" />,
	search: <Search className="w-5 h-5" />,
	get: <FileText className="w-5 h-5" />,
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function McpPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;

	setRequestLocale(locale);

	const t = await getTranslations("mcp");
	const header = await headers();
	const host = header.get("host") ?? "localhost:3000";
	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
	const domain = `${protocol}://${host}`;
	const endpoint = `${domain}/api/mcp/streamable`;

	const tools = [
		{ key: "list", name: t("toolList"), desc: t("toolListDesc") },
		{ key: "search", name: t("toolSearch"), desc: t("toolSearchDesc") },
		{ key: "get", name: t("toolGet"), desc: t("toolGetDesc") },
	];

	return (
		<div className="min-h-screen">
			<Header />
			<main className="px-5 md:px-[8%] py-2 pt-5 md:pt-[100px] pb-[60px]">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-2">
							<div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600">
								<Plug className="w-6 h-6" />
							</div>
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t("title")}</h1>
						</div>
						<p className="text-gray-500 text-sm md:text-base max-w-2xl">{t("subtitle")}</p>
					</div>

					<div className="space-y-6">
						<section className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm p-5 md:p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-1">{t("endpoint")}</h2>
							<p className="text-sm text-gray-500 mb-4">{t("endpointDesc")}</p>
							<McpEndpointBlock label={t("streamableHttp")} value={endpoint} />
						</section>

						<section className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm p-5 md:p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">{t("availableTools")}</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{tools.map((tool) => (
									<div key={tool.key} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
										<div className="flex items-center gap-2 mb-2">
											<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600">
												{TOOL_ICONS[tool.key]}
											</div>
											<h3 className="text-sm font-semibold text-gray-900">{tool.name}</h3>
										</div>
										<p className="text-sm text-gray-500">{tool.desc}</p>
									</div>
								))}
							</div>
						</section>

						<section className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm p-5 md:p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-1">{t("whatIsMcp")}</h2>
							<p className="text-sm text-gray-500 leading-relaxed">{t("mcpDesc")}</p>
						</section>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}