import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { StyleType } from "@/types/style";
import type { SynonymsMap } from "@/core/search";

export interface StyleEntry {
	[id: string]: unknown;
}

export interface StylesData {
	boxShadow: StyleEntry[];
	border: StyleEntry[];
	text: StyleEntry[];
	shape: StyleEntry[];
}

const DATA_DIR = join(process.cwd(), "public", "data");

let cachedStyles: StylesData | null = null;
let cachedSynonyms: SynonymsMap | null = null;

function readJson<T>(file: string): T {
	const raw = readFileSync(join(DATA_DIR, file), "utf-8");
	return JSON.parse(raw) as T;
}

export function getStylesData(): StylesData {
	if (!cachedStyles) {
		cachedStyles = {
			boxShadow: readJson<StyleEntry[]>("boxShadow.json"),
			border: readJson<StyleEntry[]>("border.json"),
			text: readJson<StyleEntry[]>("text.json"),
			shape: readJson<StyleEntry[]>("shape.json"),
		};
	}
	return cachedStyles;
}

export function getSynonyms(): SynonymsMap {
	if (!cachedSynonyms) {
		cachedSynonyms = readJson<SynonymsMap>("synonyms.json");
	}
	return cachedSynonyms;
}

export const STYLE_TABS: StyleType[] = ["boxShadow", "border", "text", "shape"];

export function isStyleType(value: unknown): value is StyleType {
	return STYLE_TABS.includes(value as StyleType);
}