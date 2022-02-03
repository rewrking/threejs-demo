import { NextPage } from "next";

import { ThreeExampleLayout } from "Layouts";
import { ThreeExampleMorphTargetFace } from "ThreeHelpers";

const Layout: NextPage = () => {
	return <ThreeExampleLayout title="Example: Morph Target / Face" example={ThreeExampleMorphTargetFace} />;
};

export default Layout;
