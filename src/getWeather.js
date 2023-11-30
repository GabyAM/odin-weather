import { fetchWeather } from "./fetchWeather.js";
import { approximateHour } from "./utilities.js";

function getMappedWeather(weatherJson) {
	function mapCondition(condition, isDay = null) {
		const newCondition = {
			name: condition.text,
			icon: condition.icon,
		};
		if (isDay !== null) {
			newCondition.isDay = isDay === 1;
		}
		return newCondition;
	}

	function mapWeatherMoment(weather, useIsDay = null) {
		const isDay = useIsDay !== null ? weather.is_day : null;
		return {
			tempC: weather.temp_c,
			tempF: weather.temp_f,
			condition: mapCondition(weather.condition, isDay),
			windKph: weather.wind_kph,
			humidity: weather.humidity,
		};
	}

	const mappedWeather = {
		location: {
			name: weatherJson.location.name,
			country: weatherJson.location.country,
		},
		now: {
			lastUpdated: weatherJson.current.last_updated,
			...mapWeatherMoment(weatherJson.current, "useIsDay"),
		},
		forecast: {},
	};
	mappedWeather.forecast = weatherJson.forecast.forecastday.map((day) => {
		const hours = day.hour.map((hour) => {
			const mappedHour = {
				time: hour.time.slice(11),
				chanceOfRain: hour.chance_of_rain,
				...mapWeatherMoment(hour, "useIsDay"),
			};
			return mappedHour;
		});

		const mappedDay = {
			date: day.date,
			hours,
			condition: mapCondition(day.day.condition),
		};
		return mappedDay;
	});

	// 'now' doesn't have a chanceOfRain property
	mappedWeather.now.chanceOfRain = mappedWeather.forecast[0].hours.find(
		(hour) => hour.time === approximateHour(mappedWeather.now.lastUpdated)
	).chanceOfRain;

	return mappedWeather;
}

export async function getWeather(city) {
	try {
		const weatherJson = await fetchWeather(city);
		return getMappedWeather(weatherJson);
	} catch (error) {
		error.message = `error while mapping the data: ${error.message}`;
		throw error;
	}
}
