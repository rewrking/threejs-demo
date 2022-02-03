import React from "react";
import styled from "styled-components";

import { Page } from "Components";
import { ControlsPanel } from "Components/ControlsPanel";

type Props = {};

const HomeLayout = (props: Props) => {
	return (
		<Page title="Home">
			<NoScene />
			<ControlsPanel />
		</Page>
	);
};

const NoScene = styled.div`
	display: block;
	background: #323252;
	width: 100vw;
	height: 100vh;
`;

export { HomeLayout };
