"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/widget/loading";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StyleBox } from "@/components/widget/style-box";
import { StyleText } from "@/components/widget/style-text";
import { StyleShape } from "@/components/widget/style-shape";
import { searchStyles, type SearchResult, type SynonymsMap } from "@/core/search";

const TAB_LABEL: Record<string, string> = {
	boxShadow: "Box Shadow",
	border: "Border",
	text: "Text",
	shape: "Shape",
};

export function SearchView() {
	const [query, setQuery] = useState("");
	const [data, setData] = useState<{ boxShadow: any[]; border: any[]; text: any[]; shape: any[] } | null>(null);
	const [synonyms, setSynonyms] = useState<SynonymsMap>({});
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		const loadData = async () => {
			try {
				const [boxShadow, border, text, shape, syn] = await Promise.all([
					fetch("/data/boxShadow.json").then((res) => res.json()),
					fetch("/data/border.json").then((res) => res.json()),
					fetch("/data/text.json").then((res) => res.json()),
					fetch("/data/shape.json").then((res) => res.json()),
					fetch("/data/synonyms.json").then((res) => res.json()),
				]);
				setData({ boxShadow, border, text, shape: Array.isArray(shape) ? shape : [shape] });
				setSynonyms(syn);
			} catch (error) {
				toast({
					title: "Failed to load data",
					description: "Search data could not be loaded",
				});
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, [toast]);

	const results = useMemo(() => {
		if (!data || !query.trim()) return [];
		return searchStyles(query, data, synonyms);
	}, [query, data, synonyms]);

	const renderResult = (result: SearchResult, index: number) => {
		const { tab, item, id } = result;
		const styleProps = { index: id, style: item, tab };
		const preview =
			tab === "text" ? (
				<StyleText {...styleProps} />
			) : tab === "shape" ? (
				<StyleShape {...styleProps} />
			) : (
				<StyleBox {...styleProps} />
			);

		return (
			<div
				key={`${tab}-${id}`}
				className="rounded-xl border border-gray-100 bg-white overflow-hidden">
				<div className="p-4 pb-3">{preview}</div>
				<div className="px-4 pb-4">
					<div className="flex items-center justify-between gap-2">
						<span className="text-sm font-medium text-gray-800 truncate">{item.name ?? `#${id}`}</span>
						<span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
							{TAB_LABEL[tab] ?? tab}
						</span>
					</div>
					{Array.isArray(item.tags) && item.tags.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-2">
							{item.tags.slice(0, 6).map((tag: string) => (
								<span
									key={tag}
									className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400">
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
							<p className="text-red-500 mb-4">Failed to load search data</p>
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 cursor-pointer">
								Retry
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
						<h1 className="text-2xl font-bold text-gray-900 mb-1">Search Styles</h1>
						<p className="text-sm text-gray-500 mb-4">Search across all presets by name, tag or description</p>
						<div className="relative max-w-xl">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Try: 渐变 gradient, 气泡 bubble, 内阴影 inset..."
								autoFocus
								className="w-full h-11 pl-9 pr-9 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
							/>
							{query && (
								<button
									onClick={() => setQuery("")}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
									aria-label="Clear search">
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
					</div>

					{query.trim() ? (
						results.length > 0 ? (
							<>
								<p className="text-xs text-gray-400 mb-4">
									{results.length} result{results.length > 1 ? "s" : ""} for "{query.trim()}"
								</p>
								<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 overflow-x-auto">
									{results.map((result, i) => renderResult(result, i))}
								</div>
							</>
						) : (
							<div className="text-center py-20">
								<p className="text-gray-400 mb-2">No results for "{query.trim()}"</p>
								<p className="text-sm text-gray-300">Try different keywords, e.g. gradient, bubble, triangle, shadow</p>
							</div>
						)
					) : (
						<div className="text-center py-20">
							<Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
							<p className="text-gray-400">Type a keyword to search across all 4 categories</p>
						</div>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}
