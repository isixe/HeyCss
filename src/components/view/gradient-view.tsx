import type { StyleItem } from "@/types/style";
import { StyleBox } from "@/components/widget/style-box";
import { useState } from "react";
import { EditModal } from "@/components/modal/edit-modal";
import { copyObjectToClipboard, copyToClipboard } from "@/utils/clipboard";

interface GradientViewProps {
	items: StyleItem[];
}

export function GradientView({ items }: GradientViewProps) {
	const [editingStyle, setEditingStyle] = useState<StyleItem | null>(null);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
			{items.map((style, index) => (
				<StyleBox key={index} style={style} tab="gradient" onEdit={() => setEditingStyle(style)} />
			))}
			{editingStyle && <EditModal style={editingStyle} onClose={() => setEditingStyle(null)} />}
		</div>
	);
}
