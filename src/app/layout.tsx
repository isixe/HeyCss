import "@/styles/globals.css";
import { Toaster } from "sonner";

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
				<Toaster />
			</body>
		</html>
	);
}
