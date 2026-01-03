import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const formatDistanceToNow = (dateString) => {
	return dayjs(dateString).fromNow();
};

export const calculateDuration = (startDate, endDate) => {
	if (!startDate || !endDate) return 0;
	const start = new Date(startDate);
	const end = new Date(endDate);
	return Math.floor((end - start) / 1000); // Duration in seconds
};
