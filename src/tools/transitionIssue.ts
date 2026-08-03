import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { TransitionIssueParams } from '../types/jira.js';

export const transitionIssueToolDefinition = {
  name: 'jira_transition_issue',
  description: "Transitions a Jira issue to a different workflow status (e.g. 'In Progress', 'Done', 'Blocked') using a specific transition ID. IMPORTANT: You must first retrieve the valid transition ID by calling `jira_get_transitions` for this specific issue. Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-post",
  inputSchema: {
    type: 'object',
    properties: {
      issueIdOrKey: {
        type: 'string',
        description: 'The ID or Key of the issue (e.g. "PROJ-123" or "10000").'
      },
      transitionId: {
        type: 'string',
        description: 'The ID of the transition to trigger (e.g. "31"). This must be obtained by running `jira_get_transitions` first.'
      },
      fields: {
        type: 'object',
        description: 'Optional fields to set or update during the transition (e.g., {"resolution": {"name": "Fixed"}} or other custom fields).'
      }
    },
    required: ['issueIdOrKey', 'transitionId']
  }
};

/**
 * Handles the jira_transition_issue MCP tool call.
 * Official Endpoint: POST /rest/api/3/issue/{issueIdOrKey}/transitions
 */
export async function handleTransitionIssue(params: TransitionIssueParams) {
  try {
    const payload: Record<string, any> = {
      transition: {
        id: params.transitionId
      }
    };

    if (params.fields && typeof params.fields === 'object') {
      payload.fields = params.fields;
    }

    const response = await jiraClient.post(`/rest/api/3/issue/${params.issueIdOrKey}/transitions`, payload);

    return {
      content: [
        {
          type: 'text',
          text: `Successfully transitioned issue ${params.issueIdOrKey} using transition ${params.transitionId}.`
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
