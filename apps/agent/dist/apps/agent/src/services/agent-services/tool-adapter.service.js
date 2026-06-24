//gemini doesnt understand mcp tools, the registry
//returns {name, descriptoin, inputSchema}
//and gemini expedcts {functionDeclarations: lambda}
//SO THIS FILE CONVERTS THE MCP TOOL -> GEMINI TOOL
export class ToolAdapterService {
    toGeminiTools(tools) {
        return [
            {
                functionDeclarations: tools.map(tool => ({
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.inputSchema,
                })),
            },
        ];
    }
}
export const toolAdapterService = new ToolAdapterService();
