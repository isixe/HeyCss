"use client";

import type React from "react";
import type { StyleItem, StylesData, StyleType } from "@/types/style";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditModal } from "@/components/widget/edit-modal";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/utils/clipboard";
import Loading from "@/components/widget/loading";
import { BoxShadowView } from "@/components/view/boxshadow-view";
import { BorderView } from "@/components/view/border-view";
import { GradientView } from "@/components/view/gradient-view";
import { TextView } from "@/components/view/text-view";
import { TABS, TAB_TRIGGER_CLASS, StyleTabs } from "@/data/enum";

export default function HeyCSS() {
	const [stylesData, setStylesData] = useState<StylesData | null>(null);
	const [editingStyle, setEditingStyle] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	const stylesMap: Record<StyleType, StyleItem[]> = {
		boxShadow: stylesData ? stylesData.boxShadow : [],
		border: stylesData ? stylesData.border : [],
		gradient: stylesData ? stylesData.gradient : [],
		text: stylesData ? stylesData.text : [],
	};

	useEffect(() => {
		const loadStyles = async () => {
			try {
				const [boxShadow, border, gradient, text] = await Promise.all([
					fetch("/data/boxShadow.json").then((res) => res.json()),
					fetch("/data/border.json").then((res) => res.json()),
					fetch("/data/gradient.json").then((res) => res.json()),
					fetch("/data/text.json").then((res) => res.json()),
				]);
				setStylesData({ boxShadow, border, gradient, text });
				console.log("Styles loaded from split JSON files successfully");
			} catch (error) {
				toast({
					title: "Using Fallback Data",
					description: "Styles loaded from fallback data",
				});
			} finally {
				setIsLoading(false);
			}
		};
		loadStyles();
	}, [toast]);

	const handleEdit = (style: any, category: string) => {
		setEditingStyle({ ...style, category });
	};

	if (isLoading) {
		return <Loading />;
	}

	if (!stylesData) {
		return (
			<div className="min-h-screen bg-white">
				<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
					<div className="text-center">
						<p className="text-red-600 mb-4">Failed to load styles data</p>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<main className="px-[10%] py-8 sm:py-12">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-8 sm:mb-12 relative">
						<div className="absolute inset-0 -z-10">
							<div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
							<div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
							<div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
						</div>

						<div className="relative">
							<h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
								CSS Style Showcase
							</h1>
							<div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
								<div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1 max-w-20"></div>
								<span className="text-2xl">✨</span>
								<div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent flex-1 max-w-20"></div>
							</div>
							<p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
								Beautiful predefined CSS styles ready to copy and customize
							</p>
							<p className="text-sm text-gray-500 mt-2 px-4">
								Click any style to copy • Click the brush icon to customize
							</p>
						</div>
					</div>

					{/* Custom Styled Tabs */}
					<div className="mb-8">
						<Tabs defaultValue="boxShadow" className="w-full">
							<div className="flex justify-center items-center mb-6 sm:mb-8">
								<TabsList className="bg-gray-50/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-2 flex flex-wrap justify-center gap-1 max-w-4xl mx-2">
									{TABS.map((tab) => (
										<TabsTrigger
											key={tab.value}
											value={tab.value}
											className={
												TAB_TRIGGER_CLASS[tab.value] +
												" data-[state=active]:shadow-md rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 font-medium transition-all duration-300 hover:bg-gray-100 text-xs sm:text-sm whitespace-nowrap"
											}>
											{tab.label}
										</TabsTrigger>
									))}
								</TabsList>
							</div>

							{TABS.map((tab) => (
								<TabsContent key={tab.value} value={tab.value}>
									{tab.value === StyleTabs.BoxShadow && <BoxShadowView items={stylesMap.boxShadow} />}
									{tab.value === StyleTabs.Border && <BorderView items={stylesMap.border} />}
									{tab.value === StyleTabs.Gradient && <GradientView items={stylesMap.gradient} />}
									{tab.value === StyleTabs.Text && <TextView items={stylesMap.text} />}
								</TabsContent>
							))}
						</Tabs>
					</div>

					{editingStyle && (
						<EditModal style={editingStyle} onClose={() => setEditingStyle(null)} onCopy={copyToClipboard} />
					)}
				</div>
			</main>
		</div>
	);
}
