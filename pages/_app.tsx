import { AppProps } from "next/app";
import React from "react";

import { BaseStyle, ThemeProvider } from "Components";
import { Providers } from "Stores";

type Props = AppProps & {
	Component: any;
};

const Main = ({ Component, pageProps }: Props) => {
	return (
		<Providers>
			<ThemeProvider />
			<BaseStyle />
			<Component {...pageProps} />
			{/* Modal */}
		</Providers>
	);
};

export default Main;
