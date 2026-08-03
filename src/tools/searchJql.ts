import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { SearchJqlParams, JiraSearchResponse } from '../types/jira.js';

export const searchJqlToolDefinition = {
  name: 'jira_search_jql',
  description: 'Searches for Jira issues/assets using Jira Query Language (JQL). Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-get',
  inputSchema: {
    type: 'object',
    properties: {
      jql: {
        type: 'string',
        description: 'The JQL query string (e.g., "project = PROJ AND status = \\"To Do\\" ORDER BY created DESC").'
      },
      maxResults: {
        type: 'number',
        description: 'The maximum number of items to return (default is 50, maximum is 100).'
      }
    },
    required: ['jql']
  }
};

/**
 * Handles the jira_search_jql MCP tool call.
 * Official Endpoint: GET /rest/api/2/search
 */
export async function handleSearchJql(params: SearchJqlParams) {
  try {
    const queryParams: Record<string, any> = {
      jql: params.jql
    };
    if (params.maxResults !== undefined) {
      queryParams.maxResults = params.maxResults;
    }

    const response = await jiraClient.get<JiraSearchResponse>('/rest/api/2/search', {
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
