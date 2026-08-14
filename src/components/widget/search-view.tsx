"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { getCachedStylesData, loadStylesData } from "@/core/styles-cache";
import Loading from "@/components/widget/loading";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StyleBox } from "@/components/widget/style-box";
import { StyleText } from "@/components/widget/style-text";
import { StyleShape } from "@/components/widget/style-shape";
import { searchStyles, type SearchResult, type SynonymsMap } from "@/core/search";
import type { StyleType } from "@/types/style";

const TAB_LABEL_KEY: Record<string, string> = {
	boxShadow: "search.tabBoxShadow",
	border: "search.tabBorder",
	text: "search.tabText",
	shape: "search.tabShape",
};

function getLocalized(value: unknown, locale: string, fallback: string): string {
	if (typeof value === "string") return value;
	if (value && typeof value === "object" && locale in (value as Record<string, unknown>)) {
		const v = (value as Record<string, unknown>)[locale];
		if (typeof v === "string") return v;
	}
	return fallback;
}

function getLocalizedTags(value: unknown, locale: string): string[] {
	if (Array.isArray(value)) return value.map(String);
	if (value && typeof value === "object") {
		const v = (value as Record<string, unknown>)[locale];
		if (Array.isArray(v)) return v.map(String);
	}
	return [];
}

export function SearchView() {
	const [query, setQuery] = useState("");
	const cachedData = getCachedStylesData();
	const [data, setData] = useState<{ boxShadow: any[]; border: any[]; text: any[]; shape: any[] } | null>(() =>
		cachedData ? { boxShadow: cachedData.boxShadow, border: cachedData.border, text: cachedData.text, shape: cachedData.shape } : null
	);
	const [synonyms, setSynonyms] = useState<SynonymsMap>({});
	const [isLoading, setIsLoading] = useState(cachedData === null);
	const { toast } = useToast();
	const locale = useLocale();
	const t = useTranslations();

	useEffect(() => {
		let cancelled = false;
		const loadData = async () => {
			try {
				const [styles, syn] = await Promise.all([
					loadStylesData(),
					fetch("/data/synonyms.json").then((res) => res.json()),
				]);
				if (!cancelled) {
					setData({ boxShadow: styles.boxShadow, border: styles.border, text: styles.text, shape: styles.shape });
					setSynonyms(syn);
				}
			} catch (error) {
				if (!cancelled) {
					toast({
						title: t("common.loadFailed"),
						description: t("common.loadFailedDescription"),
					});
				}
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};
		loadData();
		return () => {
			cancelled = true;
		};
	}, [toast, t]);

	const results = useMemo(() => {
		if (!data || !query.trim()) return [];
		return searchStyles(query, data, synonyms, locale);
	}, [query, data, synonyms, locale]);

	const renderResult = (result: SearchResult) => {
		const { tab, item, id } = result;
		const styleProps = { index: id, style: item, tab: tab as StyleType };
		const preview =
			tab === "text" ? (
				<StyleText {...styleProps} />
			) : tab === "shape" ? (
				<StyleShape {...styleProps} />
			) : (
				<StyleBox {...styleProps} />
			);

		const displayName = getLocalized(item.name, locale, `#${id}`);
		const displayTags = getLocalizedTags(item.tags, locale);

		return (
			<div key={`${tab}-${id}`} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
				<div className="p-4 pb-3">{preview}</div>
				<div className="px-4 pb-4">
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm font-medium text-gray-800 truncate">{displayName}</span>
						<span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
							{t(TAB_LABEL_KEY[tab])}
						</span>
					</div>
					{displayTags.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-2">
							{displayTags.slice(0, 6).map((tag: string) => (
								<span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400">
									{tag}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		);
	};

	if (isLoading) {
		return (
			<>
				<Header />
				<Loading />
				<Footer />
			</>
		);
	}

	if (!data) {
		return (
			<>
				<Header />
				<div className="min-h-screen">
					<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
						<div className="text-center">
							<p className="text-red-500 mb-4">{t("common.loadFailed")}</p>
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 cursor-pointer">
								{t("common.retry")}
							</button>
						</div>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	return (
		<div className="min-h-screen">
			<Header />
			<main className="px-5 md:px-[8%] py-2 pt-5 md:pt-[100px] pb-[60px]">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-gray-900 mb-1">{t("search.title")}</h1>
						<p className="text-sm text-gray-500 mb-4">{t("search.subtitle")}</p>
						<div className="relative max-w-xl">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder={t("search.placeholder")}
								autoFocus
								className="w-full h-11 pl-9 pr-9 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
							/>
							{query && (
								<button
									onClick={() => setQuery("")}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
									aria-label={t("common.clear")}>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
					</div>

					{query.trim() ? (
						results.length > 0 ? (
							<>
								<p className="text-xs text-gray-400 mb-4">{t("search.resultsCount", { count: results.length })}</p>
								<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 overflow-x-auto">
									{results.map((result) => renderResult(result))}
								</div>
							</>
						) : (
							<div className="text-center py-20">
								<p className="text-gray-400 mb-2">{t("search.noResults", { query: query.trim() })}</p>
								<p className="text-sm text-gray-300">{t("search.noResultsHint")}</p>
							</div>
						)
					) : (
						<div className="text-center py-20">
							<Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
							<p className="text-gray-400">{t("search.emptyHint", { total: 254 })}</p>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}
