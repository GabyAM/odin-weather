import { format, parseISO } from "date-fns";

export function approximateHour(hour) {
	return `${hour.length > 5 ? hour.slice(11, 14) : hour.slice(0, 3)}00`;
}

export function getTitleFromDate(date) {
	return format(parseISO(date), "EEEE d");
}

export function debounce(func, delay) {
	let timeoutId;
	return function () {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, arguments);
		}, delay);
	};
}
