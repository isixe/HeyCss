import { setRequestLocale } from "next-intl/server";
import { SearchView } from "@/components/widget/search-view";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;

	setRequestLocale(locale);

	return <SearchView />;
}
