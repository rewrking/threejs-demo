import { createGlobalStyle, css } from "styled-components";

import { getCssVariable } from "Theme";

import { globalFonts } from "./Fonts";

const styleVariables = {
	baseFontSize: 16,
};

const cssReset = css`
	*,
	::after,
	::before {
		box-sizing: border-box;
		outline: 0;
	}

	blockquote,
	body,
	dd,
	dl,
	figure,
	h1,
	h2,
	h3,
	h4,
	p {
		margin: 0;
	}

	ol[role="list"],
	ul[role="list"] {
		list-style: none;
	}

	html:focus-within {
		scroll-behavior: smooth;
	}

	body {
		min-height: 100vh;
		text-rendering: optimizeSpeed;
		line-height: 1.5;
	}

	a:not([class]) {
		text-decoration-skip-ink: auto;
	}

	img,
	picture {
		max-width: 100%;
		display: block;
	}

	button,
	input,
	select,
	textarea {
		font: inherit;
	}

	@media (prefers-reduced-motion: reduce) {
		html:focus-within {
			scroll-behavior: auto;
		}

		*,
		::after,
		::before {
			animation-duration: 0s !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0s !important;
			scroll-behavior: auto !important;
		}
	}
`;

const datGuiCss = css`
	.dg.ac {
		top: 1rem !important;
		right: 1rem !important;
	}
	.dg.main.a {
		margin-right: 0 !important;
	}
	.dg .close-button {
		display: none;
	}
	.dg .cr.boolean {
		border-left-color: ${getCssVariable("primaryColor")} !important;
	}
	.dg .cr.function {
		border-left-color: #e61d5f !important;
	}
	.dg .cr.number {
		border-left-color: ${getCssVariable("primaryColor")} !important;
	}
	.dg .cr.number input[type="text"] {
		color: #fff !important;
	}
	.dg .cr.string {
		border-left-color: ${getCssVariable("primaryColor")} !important;
	}
	.dg .cr.string input[type="text"] {
		color: ${getCssVariable("primaryColor")} !important;
	}
	.dg .c .slider-fg {
		background-color: ${getCssVariable("primaryColor")} !important;
	}
	.dg .c .slider:hover .slider-fg {
		background-color: ${getCssVariable("primaryColor")} !important;
	}

	/* dat.GUI fixes */
	div.dg input {
		font: 0.625rem "Lucida Grande", sans-serif !important;
	}

	li.cr .property-name {
		/* width: 8rem !important; */
		user-select: none;
	}
	li.cr .property-name + div {
		/* width: calc(100% - 8rem) !important; */
	}

	.dg .slider {
		margin-left: 0 !important;
	}

	.dg .c input[type="checkbox"] {
		margin-left: 0 !important;
	}

	.dg li.title {
		margin-left: 0 !important;
		user-select: none;
	}
`;

const threeStatsCss = css`
	.three-stats {
		position: absolute !important;
		top: 1rem !important;
		left: 50% !important;
		margin-left: -40px;
	}
`;

const BaseStyle = createGlobalStyle`
    ${cssReset}

    html {
        font-size: ${styleVariables.baseFontSize}px;
        background-color: ${getCssVariable("background")};
		scroll-behavior: smooth;
    }

    body {
        margin: 0;
        padding: 0;
		font-family: ${globalFonts.paragraph};
		font-size: 1.125rem;
		line-height: 1.625;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

	hr {
		border: none;
		outline: 0;
		background-color: ${getCssVariable("border")};
		margin: 1rem auto;
		height: 0.0625rem;
		width: 100%;
		text-align: center;

		&:before {
			content: ' ';
			display: block;
			position: relative;
			top: 0.325rem;
			height: 0.0625rem;
			width: 100%;
			background-color: ${getCssVariable("border")};
		}

		&:after {
			content: 'Λ';
			display: inline-block;
			position: relative;
			top: -1.0675rem;
			padding: 0 0;
			background: ${getCssVariable("background")};
			color: ${getCssVariable("border")};
			font-size: 0.675rem;
			transform: scaleX(150%);
		}
	}

	.router-progress-bar {
		z-index: 50;
		color: ${getCssVariable("primaryColor")} !important;
	}


	${datGuiCss}
	${threeStatsCss}
`;

export { BaseStyle, styleVariables };
