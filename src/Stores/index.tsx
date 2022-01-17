import { createStore, makeRootStoreProvider } from "@andrew-r-king/react-kitchen";

import { UiState } from "./UiState2";

const [UiStoreProvider, useUiStore, uiStore] = createStore(UiState);

const Providers = makeRootStoreProvider([
	//
	UiStoreProvider,
]);

export { Providers, useUiStore, uiStore };
