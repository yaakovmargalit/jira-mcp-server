import axios from 'axios';

/**
 * Parses and formats errors from the Jira Cloud API or network issues.
 * Extracts detailed error messages and field-specific errors if available.
 */
export function handleJiraError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;

    let errorMessage = `Jira API HTTP Error: ${status ?? 'Unknown Code'} ${statusText ?? ''}\n`;

    if (data) {
      if (typeof data === 'string') {
        errorMessage += `Details: ${data}\n`;
      } else if (typeof data === 'object' && data !== null) {
        // Parse Atlassian's standard error response format
        const errorMessages = (data as any).errorMessages;
        const errors = (data as any).errors;

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          errorMessage += `General Errors:\n${errorMessages.map((msg: string) => `  - ${msg}`).join('\n')}\n`;
        }

        if (errors && typeof errors === 'object') {
          errorMessage += `Field Errors:\n`;
          for (const [field, msg] of Object.entries(errors)) {
            errorMessage += `  - [${field}]: ${msg}\n`;
          }
        }

        if (!errorMessages && !errors) {
          errorMessage += `Details: ${JSON.stringify(data, null, 2)}\n`;
        }
      }
    } else {
      errorMessage += `Message: ${error.message}`;
    }

    // Include request URL if available for debugging
    if (error.config?.url) {
      errorMessage += `\nEndpoint: ${error.config.method?.toUpperCase() ?? 'GET'} ${error.config.url}`;
    }

    return errorMessage.trim();
  }

  if (error instanceof Error) {
    return `Local Error: ${error.message}`;
  }

  return `An unknown error occurred: ${String(error)}`;
}
