import { createStore, makeRootStoreProvider } from "react-oocontext";

import { UiState } from "./UiState";

const [UiStoreProvider, useUiStore, uiStore] = createStore(UiState);

const Providers = makeRootStoreProvider([
	//
	UiStoreProvider,
]);

export { Providers, useUiStore, uiStore };
