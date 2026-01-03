import { formatDistanceToNow } from "../utils/helpers";

const WorkflowStatus = ({ workflowRuns, loading, error }) => {
	if (loading) {
		return (
			<div className="bg-surface rounded-lg p-6 shadow-lg">
				<h2 className="text-2xl font-bold  mb-4">Recent Workflows</h2>
				<div className="flex justify-center items-center h-40">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-surface rounded-lg p-6 shadow-lg">
				<h2 className="text-2xl font-bold  mb-4">Recent Workflows</h2>
				<div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-sm">
					<p className="font-semibold">Error loading workflows</p>
					<p className="text-sm mt-1">{error}</p>
				</div>
			</div>
		);
	}

	const getStatusIcon = (run) => {
		if (run.status === "in_progress") return "🔄";
		if (run.conclusion === "success") return "✅";
		if (run.conclusion === "failure") return "❌";
		return "⚪";
	};

	const getStatusColor = (run) => {
		if (run.status === "in_progress") return "border-blue-500 bg-blue-900/20";
		if (run.conclusion === "success") return "border-green-500 bg-green-900/20";
		if (run.conclusion === "failure") return "border-red-500 bg-red-900/20";
		return "border-gray-500 bg-gray-900/20";
	};

	const truncateMessage = (message, maxLength = 50) => {
		if (!message) return "No commit message";
		if (message.length <= maxLength) return message;
		return message.substring(0, maxLength) + "...";
	};

	return (
		<div className="bg-surface rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold  mb-4">Recent Workflows</h2>
			<div className="space-y-3">
				{workflowRuns.slice(0, 5).map((run) => (
					<div
						key={run.id}
						className={`border-l-4 p-4 rounded-sm transition-all hover:scale-[1.02] ${getStatusColor(
							run
						)}`}
					>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-2xl">{getStatusIcon(run)}</span>
									<span className=" font-semibold">Build #{run.run_number}</span>
									<span className="text-gray-400 text-sm">
										{formatDistanceToNow(run.created_at)}
									</span>
								</div>
								<p className="text-gray-300 text-sm mb-2">
									{truncateMessage(run.head_commit?.message)}
								</p>
								<div className="flex gap-2 text-xs">
									<span className="text-gray-400">
										{run.status === "in_progress" ? "In Progress" : run.conclusion}
									</span>
								</div>
							</div>
							<a
								href={run.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="ml-4 bg-gray-700 hover:bg-gray-600  px-3 py-1 rounded-sm text-sm transition-colors"
							>
								View
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default WorkflowStatus;
