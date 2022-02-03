import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getCssVariable, Theme } from "Theme";
import { ThreeScene } from "Types";

const availableScenes = Object.entries(ThreeScene);

const ControlsPanel = () => {
	const { themeId, setTheme } = useUiStore();
	const router = useRouter();
	const slug = router.asPath.substring(1);
	return (
		<Styles>
			{availableScenes.map(([key, value], i) => {
				return (
					<button
						className={slug === value ? "active" : ""}
						key={i}
						onClick={async (ev) => {
							ev.preventDefault();
							await router.push(`/${value === ThreeScene.None ? "" : value}`);
						}}
					>
						{key}
					</button>
				);
			})}
			<hr />
			<button
				onClick={(ev) => {
					ev.preventDefault();
					setTheme(themeId === Theme.Light ? Theme.Dark : Theme.Light);
				}}
			>
				Theme: {themeId === Theme.Light ? "☀️" : "🌙"}
			</button>
		</Styles>
	);
};

export { ControlsPanel };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
	left: 1rem;
	top: 1rem;
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
		font-size: 1rem;
		color: ${getCssVariable("mainText")};
		border: 0.0675rem solid transparent;
		padding: 0.25rem 0.75rem;
		transition: background-color 0.125s linear;
		border-radius: 0.25rem;
		cursor: pointer;
		user-select: none;

		&.active {
			border-color: ${getCssVariable("primaryColor")};
		}

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
