import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { searchStyles } from "@/core/search";
import { getStylesData, getSynonyms, isStyleType, STYLE_TABS } from "./data";
import type { StyleType } from "@/types/style";

export interface StyleToolMessages {
	desc: string;
	tabDesc: string;
	queryDesc: string;
	localeDesc: string;
	idDesc: string;
	limitDesc: string;
	offsetDesc: string;
	formatDesc: string;
	unknownTab: string;
	missingQuery: string;
	invalidId: string;
	notFound: string;
	tabsHint: string;
}

function createTextResponse(text: string, isError = false): CallToolResult {
	return { content: [{ type: "text", text }], isError };
}

interface LocalizableFields {
	name?: string | { en?: string; zh?: string };
	tags?: string | string[] | { en?: string[]; zh?: string[] };
	description?: string | { en?: string; zh?: string };
}

function pickLocalized(value: unknown, locale: string): string {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "object") {
		const obj = value as Record<string, unknown>;
		const picked = obj[locale];
		if (typeof picked === "string") return picked;
		if (Array.isArray(picked)) return picked.join(", ");
	}
	return "";
}

function serializeEntry(item: Partial<LocalizableFields> & Record<string, unknown>, locale: string, withCss: boolean) {
	const name = pickLocalized(item.name, locale) || String(item.name ?? "");
	const tags = pickLocalized(item.tags, locale);
	const description = pickLocalized(item.description, locale);
	const css: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(item)) {
		if (!["id", "name", "tags", "description"].includes(key)) {
			css[key] = value;
		}
	}
	return JSON.stringify({
		id: item.id,
		name,
		tags: tags ? tags.split(", ") : [],
		description,
		...(withCss ? { css } : {}),
	});
}

export function createListStylesTool(t: StyleToolMessages): Tool {
	return {
		name: "list_styles",
		description: `${t.desc} ${t.tabsHint}`,
		inputSchema: {
			type: "object",
			properties: {
				tab: {
					type: "string",
					description: t.tabDesc,
					enum: STYLE_TABS,
				},
				locale: {
					type: "string",
					description: t.localeDesc,
					enum: ["en", "zh"],
					default: "en",
				},
				limit: {
					type: "number",
					description: t.limitDesc,
					default: 20,
				},
				offset: {
					type: "number",
					description: t.offsetDesc,
					default: 0,
				},
				format: {
					type: "string",
					description: t.formatDesc,
					enum: ["summary", "full"],
					default: "summary",
				},
			},
			required: [],
		},
	};
}

export async function handleListStyles(
	args: Record<string, unknown>,
	t: StyleToolMessages
): Promise<CallToolResult> {
	const locale = args.locale === "zh" ? "zh" : "en";
	const tab = args.tab as string | undefined;
	if (tab !== undefined && !isStyleType(tab)) {
		return createTextResponse(`${t.unknownTab} ${tab}. ${t.tabsHint}`, true);
	}

	const data = getStylesData();
	const offset = Math.max(0, Number(args.offset) || 0);
	const limit = Math.min(100, Math.max(1, Number(args.limit) || 20));
	const format = args.format === "full" ? "full" : "summary";

	const result: Record<string, unknown> = {};
	if (tab) {
		const items = data[tab as StyleType];
		result[tab] = {
			total: items.length,
			offset,
			limit,
			items: items.slice(offset, offset + limit).map((item) => serializeEntry(item, locale, format === "full")),
		};
	} else {
		for (const t of STYLE_TABS) {
			const items = data[t];
			result[t] = {
				total: items.length,
				items: items.slice(offset, offset + limit).map((item) => serializeEntry(item, locale, format === "full")),
			};
		}
	}

	return createTextResponse(JSON.stringify(result));
}

export function createSearchStylesTool(t: StyleToolMessages): Tool {
	return {
		name: "search_styles",
		description: t.desc,
		inputSchema: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: t.queryDesc,
				},
				locale: {
					type: "string",
					description: t.localeDesc,
					enum: ["en", "zh"],
					default: "en",
				},
				limit: {
					type: "number",
					description: t.limitDesc,
					default: 10,
				},
			},
			required: ["query"],
		},
	};
}

export async function handleSearchStyles(
	args: Record<string, unknown>,
	t: StyleToolMessages
): Promise<CallToolResult> {
	const query = typeof args.query === "string" ? args.query.trim() : "";
	if (!query) {
		return createTextResponse(t.missingQuery, true);
	}
	const locale = args.locale === "zh" ? "zh" : "en";
	const limit = Math.min(100, Math.max(1, Number(args.limit) || 10));

	const data = getStylesData();
	const synonyms = getSynonyms();
	const results = searchStyles(query, data as Record<StyleType, any[]>, synonyms, locale)
		.slice(0, limit)
		.map((r) => ({
			tab: r.tab,
			id: r.id,
			score: r.score,
			name: pickLocalized(r.item.name, locale) || String(r.item.name ?? ""),
			description: pickLocalized(r.item.description, locale),
		}));

	return createTextResponse(JSON.stringify({ query, locale, total: results.length, results }));
}

export function createGetStyleTool(t: StyleToolMessages): Tool {
	return {
		name: "get_style",
		description: t.desc,
		inputSchema: {
			type: "object",
			properties: {
				tab: {
					type: "string",
					description: t.tabDesc,
					enum: STYLE_TABS,
				},
				id: {
					type: "number",
					description: t.idDesc,
				},
				locale: {
					type: "string",
					description: t.localeDesc,
					enum: ["en", "zh"],
					default: "en",
				},
			},
			required: ["tab", "id"],
		},
	};
}

export async function handleGetStyle(
	args: Record<string, unknown>,
	t: StyleToolMessages
): Promise<CallToolResult> {
	const tab = args.tab as string | undefined;
	if (tab === undefined || !isStyleType(tab)) {
		return createTextResponse(`${t.unknownTab} ${tab}. ${t.tabsHint}`, true);
	}
	const id = Number(args.id);
	if (!Number.isInteger(id) || id < 0) {
		return createTextResponse(t.invalidId, true);
	}
	const locale = args.locale === "zh" ? "zh" : "en";

	const data = getStylesData();
	const item = data[tab as StyleType].find((it) => it.id === id);
	if (!item) {
		return createTextResponse(`${t.notFound} ${tab}[${id}]`, true);
	}

	return createTextResponse(serializeEntry(item, locale, true));
}