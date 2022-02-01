import { BaseState, Action } from "@andrew-r-king/react-kitchen";

import { Theme, ThemeType, darkTheme, lightTheme } from "Theme";
import { ThreeScene } from "Types";
import { LocalStorage } from "Utility";

const STORAGE_KEY_THEME: string = "theme";
const STORAGE_KEY_SCENE: string = "scene";

class UiState extends BaseState {
	initialized: boolean = false;

	themeId: Theme = Theme.Dark;
	theme: ThemeType = darkTheme;

	scene: ThreeScene = ThreeScene.None;

	@Action
	initialize = () => {
		let themeId: Theme = Theme.Light;
		// if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
		// 	themeId = Theme.Dark;
		// } else {
		// 	themeId = Theme.Light;
		// }

		this.setTheme(LocalStorage.get<Theme>(STORAGE_KEY_THEME, themeId));

		let scene: ThreeScene = ThreeScene.None;
		this.setScene(LocalStorage.get<ThreeScene>(STORAGE_KEY_SCENE, scene));
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

	@Action
	setScene = (scene: ThreeScene) => {
		this.scene = scene;
		LocalStorage.set(STORAGE_KEY_SCENE, this.scene);
	};
}

export { UiState };
