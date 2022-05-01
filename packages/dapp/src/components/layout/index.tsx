import { FC, PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface IProps {}

const Layout: FC<PropsWithChildren<IProps>> = ({ children }) => {
  return (
    <div className="bg-paper-pattern w-full h-screen bg-no-repeat bg-cover">
      <Header />
      <main className="font-lobster">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
