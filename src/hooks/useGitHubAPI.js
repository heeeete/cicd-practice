import { useState, useEffect, useCallback, useMemo } from 'react';
import { Octokit } from '@octokit/rest';
import { REPO_OWNER, REPO_NAME, REFRESH_INTERVAL } from '../utils/constants';

// Note: For production, consider using a backend proxy to avoid exposing GitHub tokens
// The VITE_GITHUB_TOKEN is optional and only needed for higher API rate limits
export const useGitHubAPI = () => {
  const [workflowRuns, setWorkflowRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const octokit = useMemo(() => new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
  }), []);

  const fetchWorkflowRuns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        per_page: 10,
      });

      setWorkflowRuns(data.workflow_runs);
    } catch (err) {
      console.error('Error fetching workflow runs:', err);
      setError(err.message || 'Failed to fetch workflow runs');
    } finally {
      setLoading(false);
    }
  }, [octokit]);

  useEffect(() => {
    fetchWorkflowRuns();

    const interval = setInterval(fetchWorkflowRuns, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchWorkflowRuns]);

  return {
    workflowRuns,
    loading,
    error,
    refetch: fetchWorkflowRuns,
  };
};
