"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";

interface McpEndpointBlockProps {
	label: string;
	value: string;
}

async function copyToClipboard(text: string): Promise<void> {
	const fallback = () =>
		new Promise<void>((resolve, reject) => {
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed";
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();
			try {
				const ok = document.execCommand("copy");
				textarea.remove();
				if (ok) {
					resolve();
				} else {
					reject(new Error("execCommand('copy') returned false"));
				}
			} catch (error) {
				textarea.remove();
				reject(error);
			}
		});

	if (navigator.clipboard?.writeText) {
		return navigator.clipboard.writeText(text).catch(fallback);
	}
	return fallback();
}

export function McpEndpointBlock({ label, value }: McpEndpointBlockProps) {
	const [copied, setCopied] = useState(false);
	const t = useTranslations();

	const handleCopy = async () => {
		try {
			await copyToClipboard(value);
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
				className="flex items-center justify-center shrink-0 rounded-lg p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
				aria-label={copied ? t("mcp.copied") : t("mcp.copy")}>
				{copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
			</button>
		</div>
	);
}