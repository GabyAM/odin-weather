import { fetchWeather } from "./fetchWeather.js";

function getMappedWeather(weatherJson) {
	function mapWeatherMoment(weather) {
		return {
			tempC: weather.temp_c,
			tempF: weather.temp_f,
			condition: weather.condition.text,
			windKph: weather.wind_kph,
			humidity: weather.humidity,
		};
	}

	const mappedWeather = {
		location: {
			name: weatherJson.location.name,
			country: weatherJson.location.country,
		},
		current: {
			lastUpdated: weatherJson.current.last_updated,
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

		return { hours, condition: day.day.condition.text };
	});
	return mappedWeather;
}

export async function getWeather(city) {
	const weatherJson = await fetchWeather(city);
	return { ...getMappedWeather(weatherJson) };
}
