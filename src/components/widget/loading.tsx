export default function Loading() {
	return (
		<div className="min-h-screen bg-white">
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading styles...</p>
				</div>
			</div>
		</div>
	);
}
