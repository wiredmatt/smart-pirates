import { FC, PropsWithChildren } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface IProps {}

const Layout: FC<PropsWithChildren<IProps>> = ({ children }) => {
  return (
    <div className="bg-paper-pattern w-full min-h-screen bg-no-repeat bg-cover">
      <Header />
      <main className="font-lobster mt-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
