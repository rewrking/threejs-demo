import React, { useCallback, useEffect } from "react";

const useResize = (inCallback: (ev: UIEvent) => void, dependencies: React.DependencyList = []) => {
	const callback = useCallback(inCallback, dependencies);

	useEffect(() => {
		window.addEventListener("resize", callback, false);

		return () => {
			window.removeEventListener("resize", callback, false);
		};
	}, [callback]);

	return callback;
};

export { useResize };
