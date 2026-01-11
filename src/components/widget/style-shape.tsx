"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/utils/clipboard";
import { TAB_TRIGGER_CLASS } from "@/data/enum";
import { cssObjectParser } from "@/core/parser";

interface StyleBoxProps {
	index: number;
	style: any;
	tab: string;
}

export function StyleShape({ index, style, tab }: StyleBoxProps) {
	const [isCopied, setIsCopied] = useState(false);
	const [uniqueClassName] = useState(`style-${tab}-${index}`);

	const onStyleCopy = async () => {
		setIsCopied(true);
		const cssRules = cssObjectParser(style);
		await copyToClipboard(cssRules);
		setTimeout(() => {
			setIsCopied(false);
		}, 1500);
	};

	const onCopyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		onStyleCopy();
	};

	useEffect(() => {
		const cssRules = cssObjectParser(style);
		const styleTag = document.createElement("style");
		styleTag.textContent = `.${uniqueClassName} ${cssRules} `;
		document.head.appendChild(styleTag);

		return () => {
			document.head.removeChild(styleTag);
		};
	}, []);

	const getTabClass = (tab: string) => {
		return TAB_TRIGGER_CLASS[tab];
	};

	return (
		<div
			className={`${uniqueClassName} group aspect-square flex items-center justify-center text-gray-600 font-medium transition-transform duration-200 hover:scale-105 relative cursor-pointer`}
			onClick={onStyleCopy}>
			<span className="z-10 text-[16px] font-normal text-gray-400">#{index}</span>

			<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
				<Button
					size="sm"
					variant="secondary"
					data-state={isCopied ? "active" : undefined}
					className={`h-6 w-6 p-0 transition-all duration-150 ${getTabClass(tab)} ${
						isCopied ? "bg-white/90 hover:bg-white" : "bg-white/90 hover:bg-white"
					}`}
					onClick={onCopyClick}>
					{isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
				</Button>
			</div>
		</div>
	);
}
