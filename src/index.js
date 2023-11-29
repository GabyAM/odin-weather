import { weatherController } from "./weatherController.js";
import { domController } from "./domController.js";

async function init() {
	await domController.update();
}
init();
