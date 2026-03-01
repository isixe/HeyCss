import "@/styles/globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
	const headersList = await headers();
	const protocol = headersList.get("x-forwarded-proto");
	const host = headersList.get("host");
	const url = `${protocol}://${host}`;

	return {
		title: "HeyCSS",
		keywords: "CSS box-shadow, CSS border, CSS text styles, CSS shapes, web design, front-end development",
		description:
			"Discover and copy CSS styles including box-shadows, borders, text styles, and shapes for your web projects.",
		alternates: {
			canonical: url,
		},
		openGraph: {
			title: "HeyCSS",
			description:
				"Discover and copy CSS styles including box-shadows, borders, text styles, and shapes for your web projects.",
			url,
			siteName: "HeyCSS",
			type: "website",
			locale: "en",
			images: `${url}/preview.png`,
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const analyticsScript = process.env.ANALYTICS_SCRIPT || "";

	return (
		<html lang="en">
			<head>
				{analyticsScript ? <Script src={analyticsScript} id="analytics" data-website-id="heycss" defer /> : null}
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
}
