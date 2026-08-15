"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";

interface McpEndpointBlockProps {
	label: string;
	value: string;
}

export function McpEndpointBlock({ label, value }: McpEndpointBlockProps) {
	const [copied, setCopied] = useState(false);
	const t = useTranslations();

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	return (
		<div className="flex items-center justify-between gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm">
			<span className="flex-1 min-w-0">
				<span className="block text-gray-700 font-medium">{label}</span>
				<span className="block font-mono text-xs text-gray-500 break-all mt-0.5">{value}</span>
			</span>
			<button
				onClick={handleCopy}
				className="flex items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
				aria-label={copied ? t("mcp.copied") : t("mcp.copy")}>
				{copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
				{copied ? t("mcp.copied") : t("mcp.copy")}
			</button>
		</div>
	);
}