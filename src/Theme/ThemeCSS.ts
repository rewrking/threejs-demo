import { ThemeType } from "./ThemeType";

const ThemeIndex: ThemeType = {
	bodyBackground: "bg-body",
	background: "bg",
	mainText: "main-text",
	border: "border",
	primaryColor: "primary-color",
	secondaryColor: "secondary-color",
	tertiaryColor: "tertiary-color",
};

const values = Object.entries(ThemeIndex);

export const getRootThemeCss = (theme: ThemeType): string =>
	values.map(([key, value]) => `--th-${value}: ${theme[key]};`).join("");

export const getCssVariable = (id: keyof ThemeType) => `var(--th-${ThemeIndex[id]})`;
