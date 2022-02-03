import { NextPage } from "next";

import { ThreeExampleLayout } from "Layouts";
import { ThreeExampleAnimationKeyframes } from "ThreeHelpers";

const Layout: NextPage = () => {
	return <ThreeExampleLayout title="Example: Animation / Keyframes" example={ThreeExampleAnimationKeyframes} />;
};

export default Layout;
