import "@/styles/globals.css";
// Toast 已移除（不再渲染任何全局 Toaster）

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
