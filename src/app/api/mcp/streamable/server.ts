import { createTools } from "@/tools/mcp";
import type { Locale, ToolHandler } from "@/types/mcp";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
	CallToolRequest,
	CallToolRequestSchema,
	CallToolResult,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

function createTextResponse(text: string, isError = false): CallToolResult {
	return { content: [{ type: "text", text }], isError };
}

export function createMcpServer(locale: Locale): Server {
	const tools = createTools(locale);
	const toolsMap = new Map<string, ToolHandler>();
	for (const toolHandler of tools) {
		toolsMap.set(toolHandler.tool.name, toolHandler);
	}

	const server = new Server(
		{ name: "HeyCss Styles MCP Server", version: "1.0.0" },
		{ capabilities: { tools: {} } }
	);

	server.setRequestHandler(ListToolsRequestSchema, () => {
		return { tools: tools.map((th) => th.tool) };
	});

	server.setRequestHandler(CallToolRequestSchema, (request: CallToolRequest) => {
		const toolHandler = toolsMap.get(request.params.name);
		if (!toolHandler) {
			return Promise.resolve(createTextResponse(`Unknown tool: ${request.params.name}`, true));
		}
		return toolHandler.handler(request.params.arguments ?? {});
	});

	return server;
}