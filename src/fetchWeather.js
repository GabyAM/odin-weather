const API_KEY = "3d0628d7134c45b5a4a142147232411";

export async function fetchWeather(city) {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`,
			{ mode: "cors" }
		);
		if (!response.ok) {
			throw new Error("Error fetching weather data.");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		error.message = `Something went wrong while fetching: ${error.message}`;
		throw error;
	}
}

/* export function fetchWeather(city) {
	return fetch(
		`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`,
		{ mode: "cors" }
	)
		.then((res) => {
			if (!res.ok) {
				if (res.status === 400) {
					throw new Error("Invalid city provided");
				} else {
					throw new Error("Error fetching weather data.");
				}
			}
			return res.json();
		})
		.catch((error) => {
			error.message = `Something went wrong while fetching: ${error.message}`;
			throw error;
		});
} */
