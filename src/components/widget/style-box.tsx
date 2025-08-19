"use client";

import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Copy, Paintbrush, Check } from "lucide-react";

interface StyleBoxProps {
	style: any;
	onCopy: () => void;
	onEdit: () => void;
	category?: string;
}

export function StyleBox({ style, onCopy, onEdit, category }: StyleBoxProps) {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = () => {
		// Change color immediately
		setIsCopied(true);

		// Execute copy function
		onCopy();

		// Reset after 2 seconds
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	// Get color scheme based on category
	const getColorScheme = () => {
		switch (category) {
			case "boxshadow":
				return {
					bg: "bg-blue-100",
					hover: "hover:bg-blue-200",
					text: "text-blue-800",
				};
			case "border":
				return {
					bg: "bg-green-100",
					hover: "hover:bg-green-200",
					text: "text-green-800",
				};
			case "gradient":
				return {
					bg: "bg-pink-100",
					hover: "hover:bg-pink-200",
					text: "text-pink-800",
				};
			case "image":
				return {
					bg: "bg-orange-100",
					hover: "hover:bg-orange-200",
					text: "text-orange-800",
				};
			case "animation":
				return {
					bg: "bg-purple-100",
					hover: "hover:bg-purple-200",
					text: "text-purple-800",
				};
			default:
				return {
					bg: "bg-blue-100",
					hover: "hover:bg-blue-200",
					text: "text-blue-800",
				};
		}
	};

	const colorScheme = getColorScheme();

	return (
		<div className="relative group flex justify-center">
			<div
				className="w-4/5 aspect-square rounded-lg bg-white flex items-center justify-center text-gray-600 font-medium transition-transform duration-200 hover:scale-105 border border-gray-100 relative cursor-pointer"
				style={style}
				onClick={handleCopy}>
				<span className="text-xs font-normal text-gray-400">{style.name}</span>

				<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<Button
						size="sm"
						variant="secondary"
						className={`h-6 w-6 p-0 shadow-md transition-all duration-150 ${
							isCopied ? `${colorScheme.bg} ${colorScheme.hover} ${colorScheme.text}` : "bg-white/90 hover:bg-white"
						}`}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleCopy();
						}}>
						{isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
					</Button>
					<Button
						size="sm"
						variant="secondary"
						className="h-6 w-6 p-0 bg-white/90 hover:bg-white shadow-md"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onEdit();
						}}>
						<Paintbrush className="h-3 w-3" />
					</Button>
				</div>
			</div>
		</div>
	);
}
