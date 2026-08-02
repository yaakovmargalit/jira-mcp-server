import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getMetaToolDefinition, handleGetCreateMetadata } from './tools/getMeta.js';
import { createIssueToolDefinition, handleCreateIssue } from './tools/createIssue.js';
import { getIssueToolDefinition, handleGetIssue } from './tools/getIssue.js';
import { searchJqlToolDefinition, handleSearchJql } from './tools/searchJql.js';
import { getMetaFieldsToolDefinition, handleGetCreateIssueMetaFields } from './tools/getMetaFields.js';
import { getProjectIssueTypesToolDefinition, handleGetProjectIssueTypes } from './tools/getProjectIssueTypes.js';

// Instantiate the MCP Server with its metadata and capabilities
const server = new Server(
  {
    name: 'jira-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      getMetaToolDefinition,
      createIssueToolDefinition,
      getIssueToolDefinition,
      searchJqlToolDefinition,
      getMetaFieldsToolDefinition,
      getProjectIssueTypesToolDefinition,
    ],
  };
});

// Register tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'jira_get_create_metadata':
      return await handleGetCreateMetadata(args as any);
    case 'jira_get_create_issue_meta_fields':
      return await handleGetCreateIssueMetaFields(args as any);
    case 'jira_get_project_issue_types':
      return await handleGetProjectIssueTypes(args as any);
    case 'jira_create_issue':
      return await handleCreateIssue(args as any);
    case 'jira_get_issue':
      return await handleGetIssue(args as any);
    case 'jira_search_jql':
      return await handleSearchJql(args as any);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Jira MCP Server running on STDIO');
}

main().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
