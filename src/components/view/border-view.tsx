import type { StyleItem } from "@/types/style";
import { StyleBox } from "@/components/widget/style-box";
import { useState } from "react";
import { EditModal } from "@/components/widget/edit-modal";
import { copyToClipboard } from "@/utils/clipboard";

interface BorderViewProps {
	items: StyleItem[];
}

function copyStyle(style: StyleItem) {
	const cssString = Object.entries(style)
		.map(([key, value]) => `${key}: ${value};`)
		.join("\n");
	copyToClipboard(cssString);
}

export function BorderView({ items }: BorderViewProps) {
	const [editingStyle, setEditingStyle] = useState<StyleItem | null>(null);

	console.log(items);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
			{items.map((style, index) => (
				<StyleBox
					key={index}
					style={style}
					category="border"
					onCopy={() => copyStyle(style)}
					onEdit={() => setEditingStyle(style)}
				/>
			))}
			{editingStyle && (
				<EditModal style={editingStyle} onClose={() => setEditingStyle(null)} onCopy={copyToClipboard} />
			)}
		</div>
	);
}
