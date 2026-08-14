import type { StyleType } from "@/types/style";

export interface SearchResult {
	tab: StyleType;
	item: any;
	id: number;
	score: number;
}

export type SynonymsMap = Record<string, string[]>;

const TABS: StyleType[] = ["boxShadow", "border", "text", "shape"];

function tokenize(query: string): string[] {
	return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * 展开一个搜索词为候选词集合：
 * 1. 直接命中：term 是同义词表键 → 取键 + 全部值
 * 2. 反向命中：term 是某键的值 → 取该键 + 全部值
 * 3. 子串命中：仅保留 term 本身，交由 scoreItem 的 includes 判断处理，
 *    不做整体展开，避免过度泛化（如"内阴影"不应展开出"阴影"）
 */
function expandTerm(term: string, synonyms: SynonymsMap): Set<string> {
	const candidates = new Set<string>([term]);

	for (const [key, values] of Object.entries(synonyms)) {
		const keyLower = key.toLowerCase();
		const valuesLower = values.map((v) => v.toLowerCase());

		const direct = keyLower === term || valuesLower.includes(term);

		if (direct) {
			candidates.add(keyLower);
			valuesLower.forEach((v) => candidates.add(v));
		}
	}

	return candidates;
}

/** 对单条预设打分：返回该 term 能获得的最佳分数 */
function scoreItem(item: any, candidates: Set<string>, locale: string): number {
	let best = 0;

	const rawTags = item.tags ?? [];
	const tags: string[] = (Array.isArray(rawTags)
		? rawTags
		: Array.isArray(rawTags[locale])
			? rawTags[locale]
			: []
	).map((t: string) => t.toLowerCase());
	const rawName = item.name ?? "";
	const name: string = (typeof rawName === "string" ? rawName : rawName[locale] ?? "").toLowerCase();
	const rawDescription = item.description ?? "";
	const description: string = (
		typeof rawDescription === "string" ? rawDescription : rawDescription[locale] ?? ""
	).toLowerCase();

	// CSS 值字符串（排除元数据字段）
	const cssValue = JSON.stringify(
		Object.fromEntries(
			Object.entries(item).filter(([k]) => !["id", "name", "tags", "description"].includes(k))
		)
	).toLowerCase();

	for (const c of candidates) {
		// tags 精确匹配权重最高
		for (const t of tags) {
			if (t === c) {
				best = Math.max(best, 10);
			} else if (t.includes(c) || c.includes(t)) {
				best = Math.max(best, 6);
			}
		}
		// name 子串
		if (name.includes(c) || c.includes(name)) best = Math.max(best, 5);
		// description 子串
		if (description.includes(c) || c.includes(description)) best = Math.max(best, 3);
		// CSS 值子串（权重最低，仅作兜底）
		if (cssValue.includes(c)) best = Math.max(best, 1);
	}

	return best;
}

export function searchStyles(
	query: string,
	stylesData: Record<StyleType, any[]>,
	synonyms: SynonymsMap,
	locale: string = "en"
): SearchResult[] {
	const terms = tokenize(query);
	if (terms.length === 0) return [];

	const results: SearchResult[] = [];

	for (const tab of TABS) {
		const items = stylesData[tab] ?? [];
		for (const item of items) {
			let score = 0;
			for (const term of terms) {
				const candidates = expandTerm(term, synonyms);
				score += scoreItem(item, candidates, locale);
			}
			if (score > 0) {
				results.push({ tab, item, id: item.id ?? 0, score });
			}
		}
	}

	return results.sort((a, b) => b.score - a.score);
}
