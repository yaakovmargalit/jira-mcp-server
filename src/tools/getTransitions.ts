import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { GetTransitionsParams } from '../types/jira.js';

export const getTransitionsToolDefinition = {
  name: 'jira_get_transitions',
  description: "Retrieves the list of transitions (status changes) available for a specific Jira issue. This is crucial for discovering what workflow stages (e.g. 'In Progress', 'Done', 'Blocked') the issue can currently move to, and obtaining the correct transitionId (e.g. '31') to transition it. Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-get",
  inputSchema: {
    type: 'object',
    properties: {
      issueIdOrKey: {
        type: 'string',
        description: 'The ID or Key of the issue (e.g. "PROJ-123" or "10000").'
      }
    },
    required: ['issueIdOrKey']
  }
};

/**
 * Handles the jira_get_transitions MCP tool call.
 * Official Endpoint: GET /rest/api/3/issue/{issueIdOrKey}/transitions
 */
export async function handleGetTransitions(params: GetTransitionsParams) {
  try {
    const response = await jiraClient.get(`/rest/api/3/issue/${params.issueIdOrKey}/transitions`);

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
