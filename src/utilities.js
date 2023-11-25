import {
	startOfHour,
	parseISO,
	format,
} from "https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm";

export function approximateHour(hour) {
	const hourStart = startOfHour(parseISO(hour));
	return format(hourStart, "hh:mm");
}
