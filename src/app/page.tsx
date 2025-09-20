"use client";

import type React from "react";
import type { StyleItem, StylesData, StyleType } from "@/types/style";

import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/widget/loading";
import { TABS, TAB_TRIGGER_CLASS } from "@/data/enum";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StyleBox } from "@/components/widget/style-box";

export default function HeyCSS() {
	const [stylesData, setStylesData] = useState<StylesData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentTab, setCurrentTab] = useState<string>("boxShadow"); // 新增
	const { toast } = useToast();

	const stylesMap: Record<StyleType, StyleItem[]> = {
		boxShadow: stylesData ? stylesData.boxShadow : [],
		border: stylesData ? stylesData.border : [],
		gradient: stylesData ? stylesData.gradient : [],
		text: stylesData ? stylesData.text : [],
	};
	const isMobile = useIsMobile();

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
				<div className="min-h-screen bg-black/5">
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
				<Footer />
			</>
		);
	}

	return (
		<div className="min-h-screen  bg-black/4">
			<Header setCurrentTab={setCurrentTab} />
			<main className="px-[10%] py-8 sm:py-12">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-8 sm:mb-12 relative">
						<div className="absolute inset-0 -z-10">
							<div className="absolute top-10 left-1/4  h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
							<div className="absolute top-0 right-1/4  h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
							<div className="absolute -bottom-8 left-1/3  h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
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
								Beautiful predefined CSS styles ready to copy
							</p>
							<p className="text-sm text-gray-500 mt-2 px-4">Click any style to copy the CSS code</p>
						</div>
					</div>

					{/* Custom Styled Tabs */}
					<div className="mb-8">
						<Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
							{!isMobile && (
								<div className="flex justify-center items-center mb-6 sm:mb-8">
									<TabsList className="bg-gray-50/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl flex justify-center gap-1 max-w-4xl mx-2 items-center">
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
							)}

							{TABS.map((tab) => (
								<TabsContent key={tab.value} value={tab.value}>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 sm:gap-15 lg:gap-20">
										{stylesMap[tab.value].map((style, index) => (
											<StyleBox key={index} style={style} tab={tab.value} />
										))}
									</div>
								</TabsContent>
							))}
						</Tabs>
					</div>
				</div>
			</main>
			<Footer setCurrentTab={setCurrentTab} />
		</div>
	);
}
