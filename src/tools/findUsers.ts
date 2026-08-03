import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { FindUsersParams } from '../types/jira.js';

export const findUsersToolDefinition = {
  name: 'jira_find_users',
  description: "Searches for Jira users by display name, username, or email address. IMPORTANT: Because Jira Cloud v3 requires the user's accountId (e.g. '5b10ac8d82e05b22cc7d4ef5') for assignees, reporters, and user fields instead of usernames or emails, you MUST run this tool first to resolve a user's display name or email to their unique accountId. Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-user-search/#api-rest-api-3-user-search-get",
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query string (e.g. displayName, nickname, or email address).'
      },
      maxResults: {
        type: 'number',
        description: 'The maximum number of items to return (default is 50, maximum is 100).'
      }
    },
    required: ['query']
  }
};

/**
 * Handles the jira_find_users MCP tool call.
 * Official Endpoint: GET /rest/api/3/user/search
 */
export async function handleFindUsers(params: FindUsersParams) {
  try {
    const queryParams: Record<string, any> = {
      query: params.query
    };
    if (params.maxResults !== undefined) {
      queryParams.maxResults = params.maxResults;
    }

    const response = await jiraClient.get('/rest/api/3/user/search', {
      params: queryParams
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: handleJiraError(error)
        }
      ]
    };
  }
}
