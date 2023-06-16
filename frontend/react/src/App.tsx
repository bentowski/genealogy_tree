import { Routes, Route, Outlet, Navigate, useLocation, useNavigate, NavigateFunction } from "react-router-dom";
import Game from "./pages/Game";
import GameUp from "./pages/GameUp";
import Login from "./pages/Login";
import Profil from "./components/Profil";
import Chat from "./components/Chat/Chat";
import Stats from "./components/Stats";
import Page from "./pages/Page";
import { useAuthData } from "./contexts/AuthProviderContext";
import AskTwoFa from "./pages/AskTwoFa";
import "./styles/App.css";
import PageNotFound from "./pages/PageNotFound";
import { HandleError } from "./components/utils/HandleError";

const RequireAuth = (): JSX.Element => {
  const { isAuth, isToken, isTwoFa, loading } = useAuthData();
  const location = useLocation();

  if (loading) {
    return <h1>A Few Moment Later...</h1>;
  }
  if (isToken) {
    if (isTwoFa && !isAuth) {
      return <AskTwoFa />;
    }
    if (isAuth) {
      return <Outlet />;
    }
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

const Layout = (): JSX.Element => {
  return (
    <main className="App">
      <HandleError />
      <Outlet />
    </main>
  );
};

const App = (): JSX.Element => {
  const nav: NavigateFunction = useNavigate();
  const loc: any = useLocation();

  const setNewLoc = (newurl: string): void => {
    loc.pathname = newurl;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public route (add unauthorized) */}
        <Route path="/login" element={<Login />} />

        {/* private route */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Page />}>
            {/* <Route path="chat/" element={<Chat />} > */}
            <Route path="chat/*" element={<Chat />} />
            {/* </Route> */}
            <Route path="/" element={<Profil nav={nav} loc={loc} parentCallback={setNewLoc} />} />
            {/* <Route path="/profil/" element={<Profil nav={nav} loc={loc} />}> */}
            <Route path="profil/*" element={<Profil nav={nav} loc={loc} parentCallback={setNewLoc} />} />
            {/* </Route> */}
            <Route path="history" element={<Stats />} />
            {/* <Route path="game/" element={<Game />} > */}
            {/* </Route> */}
          </Route>
          <Route path="game/*" element={<Game />} />
          <Route path="gameup/*" element={<GameUp />} />
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  ); //
}; //

export default App;
