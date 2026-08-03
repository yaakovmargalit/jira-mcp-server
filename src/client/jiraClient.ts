import axios from 'axios';
import https from 'https';
import { config } from '../config/env.js';

const basicAuthToken = Buffer.from(`${config.JIRA_EMAIL}:${config.JIRA_API_TOKEN}`).toString('base64');

// Create an HTTPS agent that allows untrusted certificates (e.g. self-signed or proxy-intercepted)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const jiraClient = axios.create({
  baseURL: config.JIRA_HOST,
  httpsAgent,
  headers: {
    'Authorization': `Basic ${basicAuthToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});
