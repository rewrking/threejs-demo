import { BaseApi } from "@andrew-r-king/react-kitchen";

import { ResultHello } from "Server/ResultTypes";

class InternalApi extends BaseApi {
	constructor() {
		super(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api"}`);
	}

	getHello = () => this.GET<ResultHello>(`/hello`);
}

const internalApi = new InternalApi();

export { internalApi };
