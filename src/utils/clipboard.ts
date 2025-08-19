import { toast } from "@/hooks/use-toast";

export const copyToClipboard = async (css: string) => {
	try {
		await navigator.clipboard.writeText(css);
		toast({
			title: "Copied!",
			description: "CSS code copied to clipboard",
		});
	} catch (error) {
		console.error("Failed to copy:", error);
		// Fallback for older browsers
		const textArea = document.createElement("textarea");
		textArea.value = css;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand("copy");
			toast({
				title: "Copied!",
				description: "CSS code copied to clipboard",
			});
		} catch (fallbackError) {
			toast({
				title: "Copy Failed",
				description: "Please copy the CSS manually",
				variant: "destructive",
			});
		}
		document.body.removeChild(textArea);
	}
};
