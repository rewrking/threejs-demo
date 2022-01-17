import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const ControlsPanel = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { ControlsPanel };

const Styles = styled.div`
	display: block;
	position: absolute;
	left: 2rem;
	top: 2rem;
	right: auto;
	bottom: auto;
	background-color: ${getCssVariable("mainText")};
	z-index: 10;
	width: 4rem;
	height: 12rem;
	border-radius: 1rem;
	box-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.5);
`;
