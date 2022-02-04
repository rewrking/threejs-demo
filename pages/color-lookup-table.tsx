import { NextPage } from "next";

import { ThreeExampleLayout } from "Layouts";
import { ThreeExampleColorLookupTable } from "ThreeHelpers";

const Layout: NextPage = () => {
	return <ThreeExampleLayout title="Example: Color Lookup Table" example={ThreeExampleColorLookupTable} />;
};

export default Layout;
