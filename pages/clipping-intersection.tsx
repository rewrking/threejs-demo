import { NextPage } from "next";

import { ThreeExampleLayout } from "Layouts";
import { ThreeExampleClippingIntersection } from "ThreeHelpers";

const Layout: NextPage = () => {
	return <ThreeExampleLayout title="Example: Clipping / Intersection" example={ThreeExampleClippingIntersection} />;
};

export default Layout;
