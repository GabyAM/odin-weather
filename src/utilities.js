import {
	format,
	startOfHour,
	parseISO,
} from "https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm";

export function approximateHour(date) {
	const hourStart = startOfHour(parseISO(date));
	return format(hourStart, "hh:mm");
}

}
