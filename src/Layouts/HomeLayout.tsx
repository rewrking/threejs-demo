import React from "react";

import { Page } from "Components";

type Props = React.PropsWithChildren<{}>;

const HomeLayout = ({ children }: Props) => {
	return (
		<Page title="Home">
			<h1>Hello world!</h1>
			{children}
		</Page>
	);
};

export { HomeLayout };
