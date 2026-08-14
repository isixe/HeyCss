import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { StyleType } from "@/types/style";
import { TABS } from "@/data/enum";
import { StyleExplorer } from "@/components/widget/style-explorer";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export function generateStaticParams() {
	return routing.locales.flatMap((locale) => TABS.map((tab) => ({ locale, tab: tab.value })));
}

export default async function TabPage({ params }: { params: Promise<{ locale: string; tab: string }> }) {
	const { locale, tab } = await params;

	setRequestLocale(locale);

	if (!TABS.some((t) => t.value === tab)) {
		notFound();
	}

	return <StyleExplorer tab={tab as StyleType} />;
}
