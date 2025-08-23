import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "@/styles/globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<main>{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
