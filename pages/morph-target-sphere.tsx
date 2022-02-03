import { NextPage } from "next";

import { ThreeExampleLayout } from "Layouts";
import { ThreeExampleMorphTargetSphere } from "ThreeHelpers";

const Layout: NextPage = () => {
	return <ThreeExampleLayout title="Example: Morph Target / Sphere" example={ThreeExampleMorphTargetSphere} />;
};

export default Layout;
