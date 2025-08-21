import type { StyleItem } from "@/types/style";
import { StyleBox } from "@/components/widget/style-box";
import { useState } from "react";
import BorderModal from "../modal/border-modal";

interface BorderViewProps {
	items: StyleItem[];
}

export function BorderView({ items }: BorderViewProps) {
	const [editingStyle, setEditingStyle] = useState<StyleItem | null>(null);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
			{items.map((style, index) => (
				<StyleBox key={index} style={style} tab="border" onEdit={() => setEditingStyle(style)} />
			))}
			{editingStyle && <BorderModal style={editingStyle} onClose={() => setEditingStyle(null)} />}
		</div>
	);
}
