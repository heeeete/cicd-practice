import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

export const formatDistanceToNow = (dateString) => {
	return dayjs(dateString).fromNow();
};

export const calculateDuration = (startDate, endDate) => {
	if (!startDate || !endDate) return 0;
	const start = new Date(startDate);
	const end = new Date(endDate);
	return Math.floor((end - start) / 1000);
};

export const splitIsoDateTimeKST = (isoDate) => {
	if (!isoDate) return { date: "", time: "" };

	const d = dayjs(isoDate).tz("Asia/Seoul");

	if (!d.isValid()) return { date: "", time: "" };

	return {
		date: d.format("YYYY-MM-DD"),
		time: d.format("HH:mm:ss"),
	};
};

export const timeToSeconds = (t) => {
	if (!t) return null;
	const [hh, mm, ss = "0"] = String(t).split(":");
	const h = Number(hh),
		m = Number(mm),
		s = Number(ss);
	if ([h, m, s].some(Number.isNaN)) return null;
	return h * 3600 + m * 60 + s;
};

export const secondsToTime = (sec) => {
	if (sec == null) return "";
	const s = Math.max(0, Math.floor(sec));
	const h = String(Math.floor(s / 3600)).padStart(2, "0");
	const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
	const ss = String(s % 60).padStart(2, "0");
	return `${h}:${m}:${ss}`;
};
