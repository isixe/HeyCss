export const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
		console.log("Copied to clipboard");
	} catch (error) {
		console.error("Failed to copy:", error);
		// Fallback for older browsers
		const textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand("copy");
			console.log("Copied to clipboard via fallback");
		} catch (fallbackError) {
			console.error("Copy failed:", fallbackError);
		}
		document.body.removeChild(textArea);
	}
};

export const copyObjectToClipboard = async (obj: any) => {
	const text = Object.entries(obj)
		.map(([key, value]) => `${key}: ${value};`)
		.join("\n");
	await copyToClipboard(text);
};
