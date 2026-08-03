import { jiraClient } from '../client/jiraClient.js';
import { handleJiraError } from '../utils/errorHandler.js';
import { CreateIssueParams, JiraIssueResponse } from '../types/jira.js';

export const createIssueToolDefinition = {
  name: 'jira_create_issue',
  description: 'Creates a new issue, task, bug, or custom asset issue in Jira Cloud. Note: Description must be in Atlassian Document Format (ADF) - if you provide a plain string, this tool will automatically wrap it into a valid ADF paragraph node for you. IMPORTANT: If you need to populate custom fields or do not know what fields are required for the project, you MUST first run `jira_get_project_issue_types` to get the issueTypeId, and then run `jira_get_create_issue_meta_fields` to inspect the available fields, retrieve their exact "customfield_XXXXX" keys, and check their required states and allowed values. Then pass them in the "customFields" parameter. Official API Doc Link: https://developer.atlassian.net/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post',
  inputSchema: {
    type: 'object',
    properties: {
      projectKey: {
        type: 'string',
        description: 'The key of the project to create the issue in (e.g., "PROJ").'
      },
      summary: {
        type: 'string',
        description: 'A brief summary/title of the issue.'
      },
      description: {
        type: ['string', 'object'],
        description: 'The description of the issue. Can be a plain string (which will be auto-converted to ADF) or a full Atlassian Document Format (ADF) object.'
      },
      issueTypeName: {
        type: 'string',
        description: 'The name of the issue type (e.g., "Task", "Bug", "Story", "Epic").'
      },
      customFields: {
        type: 'object',
        description: 'Optional custom fields key-value pairs (e.g., {"customfield_10010": "Value", "customfield_10011": 12.5}). These must be discovered first by calling `jira_get_create_issue_meta_fields` to get their correct customfield_XXXXX IDs and expected types.'
      }
    },
    required: ['projectKey', 'summary', 'issueTypeName']
  }
};

/**
 * Handles the jira_create_issue MCP tool call.
 * Official Endpoint: POST /rest/api/3/issue
 */
export async function handleCreateIssue(params: CreateIssueParams) {
  try {
    let descriptionPayload: any = undefined;

    if (params.description) {
      if (typeof params.description === 'string') {
        descriptionPayload = {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: params.description
                }
              ]
            }
          ]
        };
      } else {
        descriptionPayload = params.description;
      }
    }

    const fieldsPayload: Record<string, any> = {
      project: {
        key: params.projectKey
      },
      summary: params.summary,
      issuetype: {
        name: params.issueTypeName
      }
    };

    if (descriptionPayload !== undefined) {
      fieldsPayload.description = descriptionPayload;
    }

    // Merge in custom fields or other field overrides
    if (params.customFields && typeof params.customFields === 'object') {
      Object.assign(fieldsPayload, params.customFields);
    }

    const response = await jiraClient.post<JiraIssueResponse>('/rest/api/3/issue', {
      fields: fieldsPayload
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
