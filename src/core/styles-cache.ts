import type { StylesData } from "@/types/style";

let stylesCache: StylesData | null = null;
let stylesPromise: Promise<StylesData> | null = null;

export function getCachedStylesData(): StylesData | null {
	return stylesCache;
}

export async function loadStylesData(): Promise<StylesData> {
	if (stylesCache) return stylesCache;
	if (!stylesPromise) {
		stylesPromise = (async () => {
			const [boxShadow, border, text, shape] = await Promise.all([
				fetch("/data/boxShadow.json").then((res) => res.json()),
				fetch("/data/border.json").then((res) => res.json()),
				fetch("/data/text.json").then((res) => res.json()),
				fetch("/data/shape.json").then((res) => res.json()),
			]);
			const normalizedShape = Array.isArray(shape) ? shape : [shape];
			const data: StylesData = { boxShadow, border, text, shape: normalizedShape };
			stylesCache = data;
			return data;
		})().catch((error) => {
			// Allow a later mount to retry instead of being stuck on a rejected promise.
			stylesPromise = null;
			throw error;
		});
	}
	return stylesPromise;
}