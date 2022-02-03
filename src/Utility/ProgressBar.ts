import { Router } from "next/router";

import { Optional } from "@andrew-r-king/react-kitchen";
import ProgressBar from "@badrap/bar-of-progress";

let progress: Optional<ProgressBar> = null;
if (progress === null) {
	progress = new ProgressBar({
		size: "0.25rem",
		color: "black",
		className: "router-progress-bar",
		delay: 100,
	});

	Router.events.on("routeChangeStart", progress.start);
	Router.events.on("routeChangeComplete", progress.finish);
	Router.events.on("routeChangeError", progress.finish);
}

const progressBar = progress!;

export { progressBar };
