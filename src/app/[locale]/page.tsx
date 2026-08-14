import { setRequestLocale } from "next-intl/server";
import { redirect, routing } from "@/i18n/routing";
import { StyleTabs } from "@/data/enum";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;

	setRequestLocale(locale);

	redirect({ href: `/${StyleTabs.BoxShadow}`, locale });
}
