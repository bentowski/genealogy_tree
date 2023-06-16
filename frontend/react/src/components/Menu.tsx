import { Link } from "react-router-dom";
import { useAuthData } from "../contexts/AuthProviderContext";
import { useEffect, useState } from "react";
import { AvatarType } from "../types";

const Menu = () => {
  const { setError, user, updateIsTwoFa, userAuthentication } = useAuthData();
  const [username, setUsername] = useState<string>(user.username);
  const [avatarUrl, setAvatarUrl] = useState<AvatarType>({url:'',hash:0});

  useEffect(() => {
    if (user.username) {
      setUsername(user.username);
    }
    if (user.avatar) {
      setAvatarUrl({url: 'http://82.165.70.203:3000/user/' + user.auth_id + '/avatar', hash: Date.now()});
    }
  }, [user])

  const logoutSession = async () => {
    const res: Response = await fetch("http://82.165.70.203:3000/auth/logout", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.ok) {
      userAuthentication(false);
      updateIsTwoFa(false);
    }
    else {
        const error = await res.json();
        setError(error);
      }
    }

    const linkChat = () => {
      if (window.location.href.includes("cousinade-baudry.fr/chat"))
        return (
          <div className="m-0">Chat</div>
        )
      return (
      <Link to={"/chat"}>
        <div className="m-0">Chat</div>
      </Link>)
    }

    return (
      <div className="Menu shadow d-flex justify-content-between align-items-center">
        <div className="homeButtonDiv col-3 d-flex justify-content-start">
          {linkChat()}
          <Link to={"/history"}>
            <div className="m-0 mx-2">Stats</div>
          </Link>
        </div>{" "}
        {/* homeButtonDiv */}
        <div className="titleDiv d-none d-sm-block">
          <h1 className="m-0"><img alt="" className="BobLePong" src="http://cousinade-baudry.fr/pictures/boblepongelogo.png"/></h1>
        </div>{" "}
        {/* titleDiv */}
        <div className="profilMenu d-flex justify-content-end align-items-center col-3">
          <div className="logoutMenu">
            {/* <a className="mx-2 btn btn-outline-dark shadow-none" onClick={logoutSession}> */}
            <button className="btnLogout mx-2" onClick={logoutSession}>
              <p className="m-0">Logout</p>
            </button>
          </div>
          <div className="loginMenu px-2">
            <Link to={"/profil/" + username}>
              <p className="m-0">{username}</p>
            </Link>
          </div>
          <div className="avatarMenu">
            <Link to={"/profil/" + username}>
              <img
                  className="miniAvatar"
                  width="150"
                  height="150"
                  src={`${avatarUrl.url}?${avatarUrl.hash}`}
                  alt=""
              />
            </Link>
          </div>
        </div>{" "}
        {/*profilMenu */}
      </div> //Menu
    ); // fin de return
  //} // fin de render
}; // fin de App

export default Menu;
