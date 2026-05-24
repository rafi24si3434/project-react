import { createRoot } from "react-dom/client";
import "./tailwind.css";
import FrameworkListSearchFilter from "./FrameworkListSearchFilter"; 
import ResponsiveGrid from "./ResponsiveDesign";

createRoot(document.getElementById("root")).render(
  <div>
    {/* <FrameworkListSearchFilter/> */}
    <ResponsiveGrid/>
  </div>
);