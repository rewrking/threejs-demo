import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getCssVariable } from "Theme";
import { ThreeScene } from "Types";

const ControlsPanel = () => {
	const { setScene } = useUiStore();
	return (
		<Styles>
			<button
				onClick={(ev) => {
					ev.preventDefault();
					setScene(ThreeScene.Box);
				}}
			>
				Box
			</button>
			<button
				onClick={(ev) => {
					ev.preventDefault();
					setScene(ThreeScene.Stars);
				}}
			>
				Stars
			</button>
		</Styles>
	);
};

export { ControlsPanel };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
	left: 2rem;
	top: 2rem;
	right: auto;
	bottom: auto;
	background-color: ${getCssVariable("background")};
	z-index: 10;
	width: auto;
	height: auto;
	border-radius: 0.5rem;
	box-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
	padding: 0.5rem;

	> button {
		background-color: transparent;
		color: ${getCssVariable("mainText")};
		border: 0.0675rem solid ${getCssVariable("primaryColor")};
		padding: 0.5rem 1rem;
		transition: background-color 0.125s linear;
		border-radius: 0.25rem;
		cursor: pointer;

		&:hover {
			color: ${getCssVariable("background")};
			background-color: ${getCssVariable("primaryColor")};
		}

		&:active {
			color: ${getCssVariable("background")};
			background-color: ${getCssVariable("secondaryColor")};
		}
	}

	> button + button {
		margin-top: 0.5rem;
	}
`;
