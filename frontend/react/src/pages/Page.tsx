import { Component } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import MatchNav from "../components/MatchNav";
import FriendsNav from "../components/FriendsNav";

class Page extends Component {
  render(): JSX.Element {
    return (
      <div className="Page p-4 d-flex flex-column bg-image">
    		<div id="background-wrap">
    			<div className="bubble blur x1"></div>
        		<div className="bubble blur x2"></div>
        		<div className="bubble blur x3"></div>
        		<div className="bubble blur x4"></div>
        		<div className="bubble blur x5"></div>
        		<div className="bubble blur x6"></div>
        		<div className="bubble blur x7"></div>
        		<div className="bubble blur x8"></div>
        		<div className="bubble blur x9"></div>
        		<div className="bubble blur x10"></div>
    		</div>
        <Menu />
        <div className="front row">
          <div className="mt-4 col-sm-12 order-2 col-lg-3 order-lg-1">
            <MatchNav />
          </div>
          <div className="mt-4 col-sm-12 order-1 col-lg-6 order-lg-2" id="mainDiv">
            <Outlet />
          </div>
          <div className="mt-4 col-sm-12 col-lg-3 order-3">
            <FriendsNav />
          </div>
        </div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App

export default Page;
