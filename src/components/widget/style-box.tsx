"use client";

import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Copy, Paintbrush, Check } from "lucide-react";
import { copyObjectToClipboard } from "@/utils/clipboard";
import { TAB_TRIGGER_CLASS } from "@/data/enum";

interface StyleBoxProps {
	style: any;
	tab: string;
}

export function StyleBox({ style, tab }: StyleBoxProps) {
	const [isCopied, setIsCopied] = useState(false);

	const getTabClass = (tab: string) => {
		return TAB_TRIGGER_CLASS[tab];
	};

	const onStyleCopy = async () => {
		setIsCopied(true);
		await copyObjectToClipboard(style);
		setTimeout(() => {
			setIsCopied(false);
		}, 1500);
	};

	const onCopyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		onStyleCopy();
	};

	return (
		<div className="relative group flex justify-center">
			<div
				className="w-4/5 aspect-square rounded-lg bg-white flex items-center justify-center text-gray-600 font-medium transition-transform duration-200 hover:scale-105 border border-gray-100 relative cursor-pointer"
				style={style}
				onClick={onStyleCopy}>
				<span className="text-xs font-normal text-gray-400">{style.name}</span>

				<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<Button
						size="sm"
						variant="secondary"
						data-state={isCopied ? "active" : undefined}
						className={`h-6 w-6 p-0 shadow-md transition-all duration-150 ${getTabClass(tab)} ${
							isCopied ? "bg-white/90 hover:bg-white" : "bg-white/90 hover:bg-white"
						}`}
						onClick={onCopyClick}>
						{isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
					</Button>
				</div>
			</div>
		</div>
	);
}
