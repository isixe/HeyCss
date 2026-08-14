export type Locale = "zh" | "en";

export interface RouteParams {
	params: Promise<{ locale: string }>;
}

export interface ToolHandler {
	tool: import("@modelcontextprotocol/sdk/types.js").Tool;
	handler: (
		args: Record<string, unknown>
	) => Promise<import("@modelcontextprotocol/sdk/types.js").CallToolResult>;
}