import { notFound } from "next/navigation";
import type { StyleType } from "@/types/style";
import { TABS } from "@/data/enum";
import { StyleExplorer } from "@/components/widget/style-explorer";

export const dynamicParams = false;

export function generateStaticParams() {
	return TABS.map((tab) => ({ tab: tab.value }));
}

export default async function TabPage({ params }: { params: Promise<{ tab: string }> }) {
	const { tab } = await params;

	if (!TABS.some((t) => t.value === tab)) {
		notFound();
	}

	return <StyleExplorer tab={tab as StyleType} />;
}
