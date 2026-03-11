"use client";

import type React from "react";
import type { StyleItem, StylesData, StyleType } from "@/types/style";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/widget/loading";
import { TABS } from "@/data/enum";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StyleBox } from "@/components/widget/style-box";
import { StyleText } from "@/components/widget/style-text";
import { StyleShape } from "@/components/widget/style-shape";

export default function HeyCSS() {
	const [stylesData, setStylesData] = useState<StylesData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentTab, setCurrentTab] = useState<string>("boxShadow");
	const { toast } = useToast();

	const stylesMap: Record<StyleType, StyleItem[]> = {
		boxShadow: stylesData ? stylesData.boxShadow : [],
		border: stylesData ? stylesData.border : [],
		text: stylesData ? stylesData.text : [],
		shape: stylesData ? stylesData.shape : [],
	};

	useEffect(() => {
		const loadStyles = async () => {
			try {
				const [boxShadow, border, text, shape] = await Promise.all([
					fetch("/data/boxShadow.json").then((res) => res.json()),
					fetch("/data/border.json").then((res) => res.json()),
					fetch("/data/text.json").then((res) => res.json()),
					fetch("/data/shape.json").then((res) => res.json()),
				]);
				const normalizedShape = Array.isArray(shape) ? shape : [shape];
				setStylesData({ boxShadow, border, text, shape: normalizedShape });
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

	if (isLoading) {
		return (
			<>
				<Header />
				<Loading />
				<Footer />
			</>
		);
	}

	if (!stylesData) {
		return (
			<>
				<Header />
				<div className="min-h-screen">
					<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
						<div className="text-center">
							<p className="text-red-500 mb-4">Failed to load styles data</p>
							<button
								onClick={() => window.location.reload()}
								className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 cursor-pointer">
								Retry
							</button>
						</div>
					</div>
				</div>
				<Footer />
			</>
		);
	}

	const currentStyles = stylesMap[currentTab as StyleType] || [];

	return (
		<div className="min-h-screen">
			<Header setCurrentTab={setCurrentTab} />
			<main className="px-5 md:px-[8%] py-2 pt-5 md:pt-[100px]  pb-[60px]">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 overflow-x-auto">
						{currentStyles.map((style, index) => {
							if (["boxShadow", "border"].includes(currentTab)) {
								return <StyleBox key={index} index={index} style={style} tab={currentTab} />;
							}
							if (["text"].includes(currentTab)) {
								return <StyleText key={index} index={index} style={style} tab={currentTab} />;
							}
							if (["shape"].includes(currentTab)) {
								return <StyleShape key={index} index={index} style={style} tab={currentTab} />;
							}
							return null;
						})}
					</div>
				</div>
			</main>
			<Footer setCurrentTab={setCurrentTab} />
		</div>
	);
}
