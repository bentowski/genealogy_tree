import { Component } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import Request from "./utils/Requests";
import io from "socket.io-client";
import HistoryCards from "./utils/HistoryCards";
import "../styles/components/profil.css";
import ModalChangeUsername from "./utils/ModalChangeUsername";
import { ChanType, HistoryType, UserType } from "../types"
import { AuthContext } from "../contexts/AuthProviderContext";
import BlockUnBlock from "./utils/BlockUnBlock";
import FriendUnFriend from "./utils/FriendUnFriend";
import ModalChangeAvatar from "./utils/ModalChangeAvatar";
import Switch from "./utils/Switch";
import { CreatePrivChanDto } from "../dtos/create-chan.dto";
import { UserJoinChannelReceiveDto } from "../dtos/userjoinchannel.dto";
import "../styles/components/utils/userCards.css";

const socketChat = io("http://82.165.70.203:3000/chat");

const BtnToChat = ({cb}:{cb: any}) => {
  const navigate = useNavigate();

  const btnClick = async () => {
    const ret:string = await cb();
    if (ret != "" && !window.location.href.includes("http://cousinade-baudry.fr/chat"))
      navigate(ret);
  }

  return (
      <button className="h-100" onClick={btnClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-chat-left-dots"
          viewBox="0 0 16 16"
        >
          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
      </button>
  )}

class Profil extends Component<
    {
      nav: NavigateFunction,
      loc: any,
      parentCallback: (newurl: string) => void
    },
    {
      user: UserType | undefined;
      current_username: string;
      histories: Array<any>;
      rank: number;
      local: string,
    }
    > {
  static contextType = AuthContext;
  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      user: undefined,
      current_username: "",
      histories: [],
      rank: 0,
      local: '',
    };
  }

  getUser = async (username: string) => {
    if (!username) {
      username = this.state.current_username;
    }
    if (username === undefined) {
      return ;
    }
    try {
      const newUser: UserType = await Request(
        "GET",
        {},
        {},
        "http://82.165.70.203:3000/user/name/" + username
      );
      this.setState({ user: newUser });
      this.setState({ current_username: username })
    } catch (error) {
      const ctx: any = this.context;
      const usr: UserType = ctx.user
      this.props.nav("/profil/" + usr.username)
      ctx.setError(error);
    }
  };

  getHistory = async () => {
    const ctx: any = this.context;
    let histories: HistoryType[] = [];
    try {
      histories = await Request(
        "GET",
        {},
        {},
        "http://82.165.70.203:3000/parties/histories/all"
      );
    } catch (error) {
      ctx.setError(error);
    }
    this.setState({ histories: histories });
  };

  getRank = async () => {
    const ctx: any = this.context;
    const users: UserType[] = ctx.userList;
    /*
   try {
     users = await Request(
       "GET",
       {},
       {},
       "http://82.165.70.203:3000/user"
     );
   } catch (error) {
     ctx.setError(error);
   }
    */
    users.sort(function (a: UserType, b: UserType) {
      return a.game_lost - b.game_lost;
    });
    users.sort(function (a: UserType, b: UserType) {
      return b.game_won - a.game_won;
    });
    let x: number = 0;
    while (x < users.length && users[x].auth_id !== this.state.user?.auth_id) {
      x++;
    }
    this.setState({ rank: x + 1 });
  };

  checkIfChanExists = async (title: string): Promise<boolean> => {
    const ctx: any = this.context;
    let chans: ChanType[] = [];
    try {
      chans = await Request(
          "GET",
          {},
          {},
          "http://82.165.70.203:3000/chan/"
      )
    } catch (error) {
      ctx.setError(error);
    }
    for (let index: number = 0; index < chans.length; index++) {
      if (title === chans[index].name) {
        return true;
      }
    }
    return false;
  }

  createChanName = async (u1: UserType, u2: UserType): Promise<string> => {
    let title: string = u1.username.slice(0, 3) + "-" + u2.username.slice(0, 3);
    let x: number = 0;
    while (await this.checkIfChanExists(title)) {
      title = title + x.toString();
      x++;
    }
    return title;
  }

  createChan = async () => {
    const ctx: any = this.context;
    try {
      const u2: UserType = await Request(
        "GET",
        {},
        {},
        "http://82.165.70.203:3000/user/name/" + this.state.user?.username,
      )
	  const chans: ChanType[] = await Request(
        "GET",
        {},
        {},
        "http://82.165.70.203:3000/chan",
      )
      let doesChanExist: boolean = false;
      let newChan: ChanType | undefined = undefined;
      chans.forEach((chan: ChanType) => {
        if (chan.type === "direct" &&
          (chan.chanUser[0].auth_id === ctx.user.auth_id || chan.chanUser[1].auth_id === ctx.user.auth_id) &&
          (chan.chanUser[0].auth_id === u2.auth_id || chan.chanUser[1].auth_id === u2.auth_id)) {
          doesChanExist = true;
          newChan = chan;
        }
      })
      if (!doesChanExist) {
        const channelname: string = await this.createChanName(ctx.user, u2)
        console.log(channelname)
        const createprivchan: CreatePrivChanDto = {
          name: channelname,
          type: "direct",
          user_1_id: ctx.user.auth_id,
          user_2_id: u2.auth_id,
        }
          newChan = await Request(
            "POST",
            {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            createprivchan,
            "http://82.165.70.203:3000/chan/createpriv"
            );
        const res: UserJoinChannelReceiveDto = {chan: newChan, auth_id: u2.auth_id}
          socketChat.emit("chanCreated", res);
      }
      if (newChan !== undefined) {
        return ("/chat/" + newChan.id)
      }
    } catch (error) {
      ctx.setError(error);
      return ("")
    }
    return ("")
  }

  componentDidUpdate(
      prevProps: Readonly<{
          nav: NavigateFunction,
          loc: any,
          parentCallback: (newurl: string) => void,
      }>,
      prevState: Readonly<{
        user: UserType | undefined;
        current_username: string;
        histories: Array<any>;
        rank: number;
        local: string }>,
      snapshot?: any) {
    const url: string = this.props.loc.pathname;
    const newLoc: string = url.substring(url.lastIndexOf("/") + 1);
    if (newLoc !== 'undefined' && (newLoc !== this.state.local || prevState.local !== newLoc)) {
      this.getUser(newLoc);
      this.getHistory();
      this.getRank();
      this.setState({ local: newLoc });
    }
  }

  componentDidMount = () => {
    const cxt: any = this.context;
    const usr: UserType = cxt.user;
    this.setState({ user: usr });
    this.setState({ current_username: usr.username });
    if (document.URL === "http://cousinade-baudry.fr" || document.URL === "http://cousinade-baudry.fr/") {
      this.props.nav("/profil/" + usr.username);
    }
    const url: string = this.props.loc.pathname;
    const newUrl: string = url.substring(url.lastIndexOf("/") + 1);
    if (newUrl !== this.state.local) {
      this.getUser(newUrl);
      this.getHistory();
      this.getRank();
      this.setState({ local: newUrl });
    }
  }

  printHeader = () => {
    const ctx: any = this.context;
    const user: UserType = ctx.user;
    if (this.state.user?.auth_id === user.auth_id) {
      return (
        <div className="ProfilHeader col-6">
          <div className="Avatar d-flex flex-row justify-content-start">
            <div className="avatar">
              <ModalChangeAvatar />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-fill mx-2"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
            </svg>
          </div>
          <ModalChangeUsername />
          <div className="twoFASwitch d-flex flex-row justify-content-start">
            <Switch />
          </div>
        </div>
      );
    } else {
      if (this.state.user?.auth_id !== undefined) {
        return (
          <div className="ProfilHeader col-6">
            <img
              className="modifAvatar mb-2"
              alt="prout"
              width={100}
              height={100}
              src={"http://82.165.70.203:3000/user/" + this.state.user?.auth_id + "/avatar"} />
              <h3>{this.state.user?.username + " "}</h3>
            <div className="row">
              <div className="col"><BlockUnBlock auth_id={this.state.user?.auth_id} /></div>
              <div className="col"><FriendUnFriend auth_id={this.state.user?.auth_id} /></div>
              <div className="col"><BtnToChat cb={this.createChan}/></div>
            </div>
          </div>
        );
      } else {
        return <p>caca</p>
      }
    }
  };

  render(): JSX.Element {
    const histories: JSX.Element[] = [];
    let i: number = this.state.histories.length - 1;
    while (i >= 0) {
      if (
        this.state.histories[i].user_one_id === this.state.user?.auth_id ||
        this.state.histories[i].user_two_id === this.state.user?.auth_id
      )
      {
        histories.push(
          <HistoryCards
          key = {i}
          history={this.state.histories[i]}
          profil={this.state.user}
          />
        );
      }
      i--;
    }
    return (
      <div className="Profil">
        <div className="divProfilStats col-12 d-flex flex-row">
          {this.printHeader()}
          <div className="StatsRank col-6">
            <div className="Stats">
              <h3 className="d-flex justify-content-start">Stats</h3>
              <div className="Score">
                <div className="scoreHeader col-12 d-flex flex-row">
                  <div className="col-6 d-flex justify-content-start">won</div>
                  <div className="col-6 d-flex justify-content-end">lost</div>
                </div>
                <div className="Ratio p-1 d-flex flex-row align-items-center">
                  <div className="Rwon col-6 px-2 d-flex justify-content-start align-items-center">{this.state.user?.game_won}</div>
                  <div className="col-6 px-2 d-flex justify-content-end">{this.state.user?.game_lost}</div>
                </div>
              </div>
            </div>
            <div className="Rank mt-4 d-flex flex-row">
              <h3>Rank</h3>
              <Link to={"/history"}>
                <h3 className="rankNumber mx-3">{this.state.rank}</h3>
              </Link>
            </div>
          </div>
        </div>
        <div className="History mt-5">
          <h3 className="d-flex justify-content-start">History</h3>
          {histories}
        </div>
      </div>
    );
  }
}
export default Profil;
