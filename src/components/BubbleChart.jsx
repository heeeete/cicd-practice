import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { Bubble } from "react-chartjs-2";
import { secondsToTime, splitIsoDateTimeKST, timeToSeconds } from "../lib/utils";
import dayjs from "dayjs";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const SECONDS_IN_DAY = 24 * 60 * 60;

export default function BubbleChart({ workflowRuns }) {
	const getChartOptions = () => {
		return {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
					max: SECONDS_IN_DAY,
					min: 0,
					type: "linear",
					ticks: {
						color: "rgb(156, 163, 175)",
						stepSize: 3600,
						callback: (v) => {
							return secondsToTime(v).slice(0, 2) + " 시";
						},
					},
					grid: {
						color: "rgba(75, 85, 99, 0.3)",
					},
				},
				x: {
					type: "linear",
					ticks: {
						color: "rgb(156, 163, 175)",
						callback: (v) => dayjs(v).format("YYYY-MM-DD"),
					},
					grid: {
						color: "rgba(75, 85, 99, 0.3)",
					},
				},
			},

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
					displayColors: false,
					callbacks: {
						label: (context) => {
							return `실행 시간: ${dayjs(context.parsed.x).format("YYYY-MM-DD")} ${secondsToTime(
								context.parsed.y
							)}`;
						},
					},
				},
			},
		};
	};

	const getChartData = () => {
		if (!workflowRuns || workflowRuns.length === 0) {
			return {
				datasets: [],
			};
		}

		const data = workflowRuns.map((run) => {
			const { date, time } = splitIsoDateTimeKST(run.created_at);
			return {
				x: new Date(date).getTime(),
				y: timeToSeconds(time),
				r: 6,
			};
		});

		return {
			datasets: [
				{
					data,
					backgroundColor: "rgb(34, 197, 94, 0.5)",
					clip: false,
				},
			],
		};
	};

	return (
		<div className="bg-surface rounded-lg p-6 shadow-lg">
			<h2 className="text-2xl font-bold  mb-4">Build Time Distribution</h2>
			<div className="h-64">
				<Bubble options={getChartOptions()} data={getChartData()} />
			</div>
		</div>
	);
}
