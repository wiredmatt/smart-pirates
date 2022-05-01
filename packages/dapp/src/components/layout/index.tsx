import { FC, PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface IProps {}

const Layout: FC<PropsWithChildren<IProps>> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
