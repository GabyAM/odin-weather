
export function fetchWeather(city) {
	return fetch(
		`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`,
		{ mode: "cors" }
	)
		.then((res) => {
			if (!res.ok) {
				throw new Error("error fetching.");
			}
			return res.json();
		})
		.catch((error) => {
			throw new Error(error);
		});
}
