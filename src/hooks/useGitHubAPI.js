import { useState, useEffect, useCallback, useMemo } from "react";
import { Octokit } from "@octokit/rest";
import { REPO_OWNER, REPO_NAME, REFRESH_INTERVAL } from "../utils/constants";

export const useGitHubAPI = () => {
	const [workflowRuns, setWorkflowRuns] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const octokit = useMemo(
		() =>
			new Octokit({
				auth: import.meta.env.VITE_GITHUB_TOKEN,
			}),
		[]
	);

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
			console.error("빌드 실행 조회 오류:", err);
			setError(err.message || "빌드 실행 조회 실패");
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
