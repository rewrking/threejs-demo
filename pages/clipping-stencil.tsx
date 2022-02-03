import { NextPage } from "next";

import { ThreeExampleLayout } from "Layouts";
import { ThreeExampleClippingStencil } from "ThreeHelpers";

const Layout: NextPage = () => {
	return <ThreeExampleLayout title="Example: Clipping / Stencil" example={ThreeExampleClippingStencil} />;
};

export default Layout;
