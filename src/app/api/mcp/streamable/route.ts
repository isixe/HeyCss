import type { Locale } from "@/types/mcp";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "./server";

async function handler(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const localeParam = url.searchParams.get("locale");
	const locale: Locale = localeParam === "zh" ? "zh" : "en";

	const server = createMcpServer(locale);
	const transport = new WebStandardStreamableHTTPServerTransport();
	await server.connect(transport);
	return transport.handleRequest(request);
}

export const runtime = "nodejs";

export { handler as GET, handler as POST };