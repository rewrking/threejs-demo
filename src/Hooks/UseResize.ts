import React, { useCallback, useEffect } from "react";

const useResize = (inCallback: (ev: UIEvent) => void, dependencies: React.DependencyList = []) => {
	const callback = useCallback(inCallback, dependencies);

	useEffect(() => {
		document.addEventListener("resize", callback, false);

		return () => {
			document.removeEventListener("resize", callback, false);
		};
	}, [callback]);

	return callback;
};

export { useResize };
