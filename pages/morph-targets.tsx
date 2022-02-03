import { NextPage } from "next";

import { ThreeExampleLayout } from "Layouts";
import { ThreeExampleMorphTargets } from "ThreeHelpers";

const Layout: NextPage = () => {
	return <ThreeExampleLayout example={ThreeExampleMorphTargets} />;
};

export default Layout;
