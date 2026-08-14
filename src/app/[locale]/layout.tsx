import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		return {};
	}

	const headersList = await headers();
	const protocol = headersList.get("x-forwarded-proto");
	const host = headersList.get("host");
	const url = `${protocol}://${host}`;

	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("title"),
		keywords: t("keywords"),
		description: t("description"),
		alternates: {
			canonical: url,
		},
		openGraph: {
			title: t("title"),
			description: t("description"),
			url,
			siteName: "HeyCSS",
			type: "website",
			locale,
			images: `${url}/preview.png`,
		},
	};
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const analyticsScript = process.env.ANALYTICS_SCRIPT || "";

	return (
		<html lang={locale}>
			<head>
				{analyticsScript ? <Script src={analyticsScript} id="analytics" data-website-id="heycss" defer /> : null}
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body className="overflow-x-hidden">
				<main>
					<NextIntlClientProvider>{children}</NextIntlClientProvider>
				</main>
			</body>
		</html>
	);
}
