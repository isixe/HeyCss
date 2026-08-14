import { Link } from "@/i18n/routing";

export default function GlobalNotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
			<p className="text-6xl font-bold text-gray-300">404</p>
			<p className="text-lg font-medium text-gray-700">Page not found</p>
			<Link
				href="/boxShadow"
				className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
			>
				Go home
			</Link>
		</div>
	);
}
