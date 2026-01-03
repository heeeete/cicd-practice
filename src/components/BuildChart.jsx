import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { calculateDuration } from "../lib/utils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BuildChart({ workflowRuns }) {
	const getChartOptions = () => {
		return {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: false,
				},
				tooltip: {
					backgroundColor: "rgba(17, 24, 39, 0.95)",
					titleColor: "rgb(243, 244, 246)",
					bodyColor: "rgb(209, 213, 219)",
					borderColor: "rgb(75, 85, 99)",
					borderWidth: 1,
					padding: 12,
					displayColors: true,
					callbacks: {
						label: (context) => {
							return `Duration: ${context.parsed.y}s`;
						},
					},
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						color: "rgb(156, 163, 175)",
						callback: (value) => `${value}s`,
					},
					grid: {
						color: "rgba(75, 85, 99, 0.3)",
					},
				},
				x: {
					ticks: {
						color: "rgb(156, 163, 175)",
					},
					grid: {
						color: "rgba(75, 85, 99, 0.3)",
					},
				},
			},
		};
	};

	const getChartData = () => {
		if (!workflowRuns || workflowRuns.length === 0) {
			return {
				labels: [],
				datasets: [],
			};
		}

		const completedRuns = workflowRuns
			.filter((run) => run.status === "completed")
			.slice(0, 10)
			.reverse();

		const labels = completedRuns.map((run) => `#${run.run_number}`);
		const durations = completedRuns.map((run) =>
			calculateDuration(run.run_started_at, run.updated_at)
		);
		const colors = completedRuns.map((run) =>
			run.conclusion === "success" ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"
		);

		return {
			labels,
			datasets: [
				{
					label: "Build Duration (seconds)",
					data: durations,
					borderColor: "rgb(59, 130, 246)",
					backgroundColor: "rgba(59, 130, 246, 0.1)",
					pointBackgroundColor: colors,
					pointBorderColor: colors,
					pointRadius: 6,
					pointHoverRadius: 8,
					tension: 0.3,
				},
			],
		};
	};

	return (
		<div className="bg-surface rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold mb-4">Build History</h2>
			<div className="h-64">
				<Line data={getChartData()} options={getChartOptions()} />
			</div>
			<div className="mt-4 flex gap-4 text-sm text-gray-400">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-green-500"></div>
					<span>Success</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<span>Failure</span>
				</div>
			</div>
		</div>
	);
}
