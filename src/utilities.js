import {
	format,
	parseISO,
} from "https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm";

export function approximateHour(hour) {
	return `${hour.length > 5 ? hour.slice(11, 14) : hour.slice(0, 3)}00`;
	// pro tip: newHour = newHour.slice(0, 3) + "00";
}

export function getTitleFromDate(date) {
	return format(parseISO(date), "EEEE d");
}
