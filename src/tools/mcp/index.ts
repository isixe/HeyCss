import type { ToolHandler, Locale } from "@/types/mcp";
import {
	createListStylesTool,
	createSearchStylesTool,
	createGetStyleTool,
	handleListStyles,
	handleSearchStyles,
	handleGetStyle,
} from "./styles";
import type { StyleToolMessages } from "./styles";

interface MessagesByLocale {
	en: StyleToolMessages;
	zh: StyleToolMessages;
}

const messages: MessagesByLocale = {
	en: {
		desc: "Styles from HeyCSS, a headless CSS tools gallery. Query the built-in styles catalog.",

		tabDesc: "Style category: boxShadow, border, text, or shape.",
		queryDesc: "Search query. Supports English and Chinese (e.g. 'soft shadow', '内阴影', 'neon').",
		localeDesc: "Output language for names/descriptions: 'en' or 'zh'. Default 'en'.",
		idDesc: "Style id within the category (0-based index of the entry).",
		limitDesc: "Max number of results to return.",
		offsetDesc: "Number of results to skip for pagination.",
		formatDesc: "'summary' returns id/name/tags/description; 'full' also includes CSS.",
		unknownTab: "Unknown tab:",
		missingQuery: "Missing required parameter: query.",
		invalidId: "Invalid parameter: id must be a non-negative integer.",
		notFound: "Style not found:",
		tabsHint: "Valid tabs: boxShadow, border, text, shape.",
	},
	zh: {
		desc: "来自 HeyCSS（无头 CSS 工具集）的样式。查询内建样式清单。",

		tabDesc: "样式分类：boxShadow、border、text 或 shape。",
		queryDesc: "搜索关键词，支持中英文（如 'soft shadow'、'内阴影'、'neon'）。",
		localeDesc: "名称/描述的输出语言：'en' 或 'zh'。默认 'en'。",
		idDesc: "分类内的样式 id（该条目的 0 起始下标）。",
		limitDesc: "最多返回的结果数。",
		offsetDesc: "分页跳过的结果数。",
		formatDesc: "'summary' 返回 id/name/tags/description；'full' 额外包含 CSS。",
		unknownTab: "未知分类：",
		missingQuery: "缺少必填参数：query。",
		invalidId: "参数无效：id 必须是非负整数。",
		notFound: "未找到样式：",
		tabsHint: "有效分类：boxShadow、border、text、shape。",
	},
};

export function createTools(locale: Locale): ToolHandler[] {
	const t = locale === "zh" ? messages.zh : messages.en;

	return [
		{
			tool: createListStylesTool(t),
			handler: (args) => handleListStyles(args, t),
		},
		{
			tool: createSearchStylesTool(t),
			handler: (args) => handleSearchStyles(args, t),
		},
		{
			tool: createGetStyleTool(t),
			handler: (args) => handleGetStyle(args, t),
		},
	];
}