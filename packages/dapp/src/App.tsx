import { FC } from "react";

import { Route, Routes } from "react-router-dom";

import { Provider, createClient } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { chains } from "./utils/web3";

import { ThemeProvider } from "degen";
import "degen/styles";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Layout from "./components/layout";

import "./index.css";
import Tavern from "./pages/Tavern";
import Mines from "./pages/Mines";
import GoldMineInside from "./pages/GoldMineInside";

const client = createClient({
  autoConnect: true,
  connectors() {
    return [
      new InjectedConnector({
        chains,
      }),
    ];
  },
});

const App: FC = () => {
  return (
    <Provider client={client}>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tavern" element={<Tavern />} />
            <Route path="/mines" element={<Mines />} />
            <Route path="/mine/:address" element={<GoldMineInside />} />
          </Routes>
        </Layout>
      </ThemeProvider>
      <ToastContainer />
    </Provider>
  );
};

export default App;
