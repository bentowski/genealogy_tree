import "../styles/pages/login.css";
import "../styles/pages/pagenotfound.css";
import { useAuthData } from "../contexts/AuthProviderContext";
import { Navigate, useLocation } from "react-router-dom";
import AskTwoFa from "./AskTwoFa";

const Login = (): JSX.Element => {
  const { isAuth, loading, isTwoFa, isToken } = useAuthData();
  const location: any = useLocation();
  const from: string = location.state?.from?.pathname || "/";

  if (loading) {
    return <h1>A Few Moment Later...</h1>;
  }
  if (isToken) {
    if (isTwoFa && !isAuth) {
      return <AskTwoFa />;
    }
    if (isAuth) {
        return (
            <div>
                <Navigate to={from} state={{ from: location }} replace />
            </div>
        );
    }
  }
  return (
	<div>
		<map name="spongebobbg">
			<area
				alt="prout"
				shape="poly"
				coords="187,231,139,266,115,319,114,339,109,354,108,385,108,434,117,478,149,492,160,493,170,494,193,498,215,498,271,499,303,490,316,482,327,461,336,413,336,374,332,341,320,300,352,298,357,287,355,277,352,267,357,243,362,231,357,225,335,229,336,245,337,280,324,284,322,287,315,288,307,266,298,254,286,239,277,237,267,230,235,223,208,225"
				href="http://82.165.70.203:3000/auth/login"/>
		</map>
		<div id="background-wrap">
			{/* delete below before push */}
			<a className="mb-2 mx-2" href="http://82.165.70.203:3000/auth/dummyconnect">
				Letssss go
  			</a>
			{/* delete above before push */}
			<div>
				<img alt="prout" useMap="#spongebobbg" className="clickable" src="http://cousinade-baudry.fr/pictures/bobhouse.png" width="auto" style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0, margin: "auto"}}/>
			</div>
			<div className="d-flex justify-content-center h-25 ">
				<div className="bubble x-static align-self-center d-flex align-items-center justify-content-center"><p className="text-center">Knock Bob's<br/>house to login</p></div>
			</div>
			{/* div below for animation */}
			<div className="bubble x1"></div>
    		<div className="bubble x2"></div>
    		<div className="bubble x3"></div>
    		<div className="bubble x4"></div>
    		<div className="bubble x5"></div>
    		<div className="bubble x6"></div>
    		<div className="bubble x7"></div>
    		<div className="bubble x8"></div>
    		<div className="bubble x9"></div>
    		<div className="bubble x10"></div>
		</div>
	</div>
  ); //
}; //
//
export default Login;
