import Head from "next/head";
import React, { useEffect } from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getCssVariable } from "Theme";

type Props = {
	children?: React.ReactNode;
	title: string;
};

const Page = ({ title, children }: Props) => {
	const { theme, initialize, initialized } = useUiStore();

	useEffect(() => {
		if (!initialized) {
			initialize();
		}
	}, [initialize, initialized]);

	useEffect(() => {
		document.body.style.backgroundColor = theme.bodyBackground;
	}, [theme]);

	return (
		<>
			<Head>
				<title>{title} | ThreeJS Demo</title>
				<meta
					name="viewport"
					content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
				/>
			</Head>
			<Main>
				<Container>{!initialized ? "" : children}</Container>
			</Main>
		</>
	);
};

export { Page };

const Main = styled.main`
	display: block;
	position: absolute;
	min-height: 100vh;
	top: 0;
	right: 0;
	bottom: auto;
	left: 0;

	background-color: ${getCssVariable("background")};
	color: ${getCssVariable("mainText")};
`;

const Container = styled.div`
	display: block;
	position: relative;
	padding: 0;
	margin: 0 auto;
`;
