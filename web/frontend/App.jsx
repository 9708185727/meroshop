import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { QueryProvider, PolarisProvider, NavigationBar, TopBar } from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <QueryProvider>
          <NavMenu>
            {/* <a href="/" rel="home" />
            <a href="/pagename">{t("NavigationMenu.pageName")}</a>
            <a href="/product">{t("product")}</a> */}
          </NavMenu>
          <div className="main-section">
            <div className="menu-section">
              <NavigationBar/>
            </div>
           <div className="content-section">
            <TopBar/>
           <Routes pages={pages} />
           </div>
          </div>
         
        </QueryProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
