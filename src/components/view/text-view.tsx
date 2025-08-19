import type { StyleItem } from "@/types/style";
import { StyleBox } from "@/components/widget/style-box";
import { useState } from "react";
import { EditModal } from "@/components/widget/edit-modal";
import { copyObjectToClipboard, copyToClipboard } from "@/utils/clipboard";

interface TextViewProps {
	items: StyleItem[];
}

export function TextView({ items }: TextViewProps) {
	const [editingStyle, setEditingStyle] = useState<StyleItem | null>(null);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
			{items.map((style, index) => (
				<StyleBox
					key={index}
					style={style}
					category="text"
					onCopy={() => copyObjectToClipboard(style)}
					onEdit={() => setEditingStyle(style)}
				/>
			))}
			{editingStyle && (
				<EditModal style={editingStyle} onClose={() => setEditingStyle(null)} onCopy={copyToClipboard} />
			)}
		</div>
	);
}
