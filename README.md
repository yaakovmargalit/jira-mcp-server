# Jira Cloud MCP Server

A production-ready, clean, and modular Model Context Protocol (MCP) server that enables LLMs to communicate directly with the official **Jira Cloud REST API v3** using standard STDIO transport. Built using TypeScript strict mode and `axios`.

## Features
- **jira_get_create_metadata**: Inspect projects, issue types, field requirements, and custom field IDs (`customfield_XXXXX`).
- **jira_get_create_issue_meta_fields**: Fetch the field configurations and custom fields for a specific project and issue type when creating an issue (granular and high-performance alternative).
- **jira_get_project_issue_types**: Fetch all issue types available for a specific project, including their IDs (used to retrieve metadata fields).
- **jira_create_issue**: Create new tickets, automatically converting plain text descriptions into the required Jira Cloud Atlassian Document Format (ADF). Supports optional custom fields.
- **jira_get_issue**: Fetch complete details for a ticket using its ID or Key.
- **jira_search_jql**: Query issues using Jira Query Language (JQL) with customizable limits.

---

## Configuration & Authentication

The server authenticates via HTTP Basic Auth. You must define the following environment variables:

| Environment Variable | Description | Example |
|----------------------|-------------|---------|
| `JIRA_HOST` | The root URL of your Jira Cloud instance | `https://your-domain.atlassian.net` |
| `JIRA_EMAIL` | The email address associated with your Atlassian account | `user@company.com` |
| `JIRA_API_TOKEN` | Atlassian API Token generated from account security settings | `ATATT...` |

> [!TIP]
> You can generate an API Token by going to [Atlassian Account Security API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens).

---

## Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory for local testing:
```env
JIRA_HOST=https://your-domain.atlassian.net
JIRA_EMAIL=user@company.com
JIRA_API_TOKEN=your-api-token
```

### 3. Build the Server
Compiles the TypeScript source files into executable ESM JavaScript in the `dist/` directory:
```bash
npm run build
```

---

## Direct Execution (npx)

Once built or published, the server can be executed directly using Node.js:

```bash
# Run the local build
node bin/index.js
```

Or run via `npx` (if published or linked):
```bash
npx jira-mcp-server
```

---

## Client Integration

To connect this MCP server to a client (e.g., Claude Desktop, Cursor, or Antigravity), use the following configuration layouts.

### Claude Desktop Integration

Add the configuration snippet below to your Claude Desktop config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "jira-mcp-server": {
      "command": "node",
      "args": [
        "/absolute/path/to/jira-mcp/bin/index.js"
      ],
      "env": {
        "JIRA_HOST": "https://your-domain.atlassian.net",
        "JIRA_EMAIL": "user@company.com",
        "JIRA_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Cursor / Antigravity Integration

Configure a command-based MCP server in your IDE:
- **Type:** `command`
- **Command:** `node /absolute/path/to/jira-mcp/bin/index.js`
- Set the environment variables `JIRA_HOST`, `JIRA_EMAIL`, and `JIRA_API_TOKEN` in your system or project configuration.
