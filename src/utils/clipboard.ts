import { toast } from "@/hooks/use-toast";

export const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
		toast({
			title: "Copied!",
			description: "Success copied to clipboard",
		});
	} catch (error) {
		console.error("Failed to copy:", error);
		// Fallback for older browsers
		const textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand("copy");
			toast({
				title: "Copied!",
				description: "Success copied to clipboard",
			});
		} catch (fallbackError) {
			toast({
				title: "Copy Failed",
				description: "Please copy the text manually",
				variant: "destructive",
			});
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
