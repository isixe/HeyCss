import "@/styles/globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";

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
			locale: "en",
			images: `${url}/preview.jpg`,
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
}
