import { fetchWeather } from "./fetchWeather.js";

function getMappedWeather(weatherJson) {
	function mapCondition(condition) {
		return {
			name: condition.text,
			icon: condition.icon,
		};
	}
	function mapWeatherMoment(weather) {
		return {
			tempC: weather.temp_c,
			tempF: weather.temp_f,
			condition: mapCondition(weather.condition),
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
			lastUpdated: weatherJson.current.last_updated.slice(11),
			...mapWeatherMoment(weatherJson.current),
		},
		forecast: {},
	};
	mappedWeather.forecast = weatherJson.forecast.forecastday.map((day) => {
		const hours = day.hour.map((hour) => {
			return {
				time: hour.time.slice(11),
				chanceOfRain: hour.chance_of_rain,
				...mapWeatherMoment(hour),
			};
		});

		return { hours, condition: mapCondition(day.day.condition) };
	});
	return mappedWeather;
}

export async function getWeather(city) {
	const weatherJson = await fetchWeather(city);
	return { ...getMappedWeather(weatherJson) };
}
