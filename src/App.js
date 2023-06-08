import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import {  Layout, Menu, } from "antd";

import { Home } from "./components/Home";
import {
  QuestionCircleOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { ACTIVE_CHAIN, APP_DESC, APP_NAME, COVALENT_KEY } from "./constants";
import Lookup from "./components/PurchaseListing";
import History from "./components/History";

import UploadListing from "./components/UploadListing";
import { Web3Button } from "@web3modal/react";
import {useAccount, useNetwork} from 'wagmi'
import logo from "./assets/logo_trans.png";
import { abbreviate } from "./util";

import './App.css';
import 'antd/dist/antd.css';
import PurchaseListing from "./components/PurchaseListing";

const { Header, Content } = Layout;

function App() {
  const navigate = useNavigate()
  const {account, isReady} = useAccount() // https://web3modal.com/hooks/use-account
  const { network } = useNetwork()

  // const height = window.innerHeight - 120;

  const pathname = window.location.pathname

  const isListingPage = pathname.indexOf('/listing/') !== -1
  
  return (
    <div className="App">
      <Layout>
        <Header>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[pathname]}
          >
            <Menu.Item key={0}>
              <img
                src={logo}
                className="header-logo pointer"
                onClick={() => navigate("/")}
              />

            </Menu.Item>
            
            {!isListingPage && <>
            <span className="web3-button">
              <Web3Button />
          </span>
</>}
      
      
            </Menu>
      
        
            </Header>
          <Content>     
            <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />}/>
                <Route path="/upload" element={<UploadListing account={account} network={network}/>}/>
                <Route path="/listing/:contractAddress" element={<PurchaseListing account={account} network={network} />}/>
              </Routes>
            </div>
          </Content>
        </Layout>
      </div>
  );
}

export default App;
