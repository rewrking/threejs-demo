import { BaseState, Action } from "react-oocontext";

import { Theme, ThemeType, darkTheme, lightTheme } from "Theme";
import { LocalStorage } from "Utility";

const STORAGE_KEY_THEME: string = "theme";

@BaseState()
class UiState {
	initialized: boolean = false;

	themeId: Theme = Theme.Dark;
	theme: ThemeType = darkTheme;

	@Action
	initialize = () => {
		let themeId: Theme = Theme.Light;
		// if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		// 	themeId = Theme.Dark;
		// } else {
		// 	themeId = Theme.Light;
		// }

		this.setTheme(LocalStorage.get<Theme>(STORAGE_KEY_THEME, themeId));

		this.initialized = true;
	};

	private setThemeInternal = (inValue: ThemeType) => {
		this.theme = inValue;
	};

	@Action
	setTheme = (theme: Theme) => {
		this.themeId = theme;
		LocalStorage.set(STORAGE_KEY_THEME, this.themeId);

		switch (theme) {
			case Theme.Dark:
				return this.setThemeInternal(darkTheme);
			case Theme.Light:
				return this.setThemeInternal(lightTheme);
			default:
				throw new Error("Code theme not implemented");
		}
	};
}

export { UiState };
