import { domController } from "./domController.js";

async function init() {
	domController.update().catch((error) => {
		error.message = `Something went wrong: ${error.message}`;
	});
}
init();
