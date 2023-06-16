import { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Request from "./Requests";
import "../../styles/components/utils/userCards.css";
import { AuthContext } from "../../contexts/AuthProviderContext";
import { ChanType, PartiesType, UserType } from "../../types"
import ModalMatchWaiting from "./ModalMatchWaiting";
import ModalMatchInvite from "./ModalMatchInvite";
import {UpdateUserGameDto} from "../../dtos/updateUser.dto";
import {CreatePrivChanDto} from "../../dtos/create-chan.dto";
import {UserJoinChannelReceiveDto} from "../../dtos/userjoinchannel.dto";
//import { socket } from '../../contexts/WebSocketContextUpdate';

const socket = io("http://82.165.70.203:3000/update");
const socketChat = io("http://82.165.70.203:3000/chat");

const BtnToChat = ({cb}:{cb: any}) => {
  const navigate = useNavigate();

  const btnClick = async () => {
    const ret:string = await cb();
    if (ret != "" && !window.location.href.includes("http://cousinade-baudry.fr/chat"))
      navigate(ret);
  }

  return (
      <button className="p-1" onClick={btnClick}>
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

class UserCards extends Component<
  { user: any, avatar: any, stat: any },
  {
    login: string;
    id: number;
    online: string;
    ssname: string;
    ssid: string;
    chanId: string;
    socket: string;
    loaded: string;
  }
> {
  static contextType = AuthContext;
  constructor(props: any) {
    super(props);
    this.state = {
      login: "",
      id: props.user.auth_id,
      online: this.props.user.status ? "online" : "offline",
      ssname: "",
      ssid: "",
      chanId: "",
      loaded: '',
      socket: ''
    };
  }

  updateUser = (user: { auth_id: number, status: number }): void => {
    if (user.auth_id === this.state.id) {
      let str: string;
      if (user.status === 2)
        str = "in-game";
      else if (user.status === 1)
        str = "online";
      else
        str = "offline";
      this.setState({ online: str })
    }
  }

  setSocket = (): void => {
    if (this.state.loaded !== 'ok') {
      socket.on(('onUpdateUser'), (user: UpdateUserGameDto) => {
        this.updateUser(user);
      })
      this.setState({ loaded: 'ok' })
    }
  }

  getCurrentUser = (): UserType => {
    const ctx: any = this.context;
    return ctx.user;
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

  createChan = async (): Promise<string> => {
    const ctx: any = this.context;
    try {
      const u2: UserType = await Request(
        "GET",
        {},
        {},
        "http://82.165.70.203:3000/user/name/" + this.state.login,
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
        // this.navigate("/chat/"/*  + newChan.id */)
        // console.log(this.props.navigation)
        //window.location.href = "http://cousinade-baudry.fr/chat/" + newChan.id
        return ("/chat/" + newChan.id)
      }
    } catch (error) {
      ctx.setError(error);
      return ("")
    }
    return ("")

    /*
    let chans = await Request("GET", {}, {}, "http://82.165.70.203:3000/chan");
    const ctx: any = this.context;
    let u1 = undefined;
    let u2 = undefined;
    try {
      u1 = await Request(
          "GET",
          {},
          {},
          "http://82.165.70.203:3000/user/name/" + this.state.ssname
      );
      u2 = await Request(
          "GET",
          {},
          {},
          "http://82.165.70.203:3000/user/name/" + this.state.login
      );
    } catch (error) {
      ctx.setError(error);
    }
    let ret = 0;
    let x = 0;
    while (x < chans.length) {
      if (
        chans[x].type === "direct" &&
        ((chans[x].chanUser[0].auth_id === u1.auth_id &&
          chans[x].chanUser[1].auth_id === u2.auth_id) ||
          (chans[x].chanUser[0].auth_id === u2.auth_id &&
            chans[x].chanUser[1].auth_id === u1.auth_id))
      ) {
        ret = chans[x].id;
        break;
      }
      x++;
    }

    if (x === chans.length) {
      let newChan = await Request(
        "POST",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        {
          name: this.createChanName(u1, u2),
          type: "direct",
          owner: u1.username,
          topic: u1.username + "$" + u2.username,
          admin: [u1.username, u2.username],
          password: "",
          chanUser: [u1, u2],
        },
        "http://82.165.70.203:3000/chan/create"
      );
      socket.emit("chanCreated");
      let newUrl = "http://cousinade-baudry.fr/chat/#" + newChan.id;
      setTimeout(() => {
        window.location.href = newUrl;
      }, 100);
      return;
    }
    let newUrl = "http://cousinade-baudry.fr/chat/#" + ret;
    window.location.href = newUrl;
     */
  };

  startNewGame = async (): Promise<void> => {
    // const ctx: any = this.context;
    // try {
    //   await Request(
    //     "POST",
    //     {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //     {
    //       login: this.state.login,
    //       public: true
    //     },
    //     "http://82.165.70.203:3000/parties/create"
    //   );
    // } catch (error) {
    //   ctx.setError(error);
    // }
    socket.emit("askForGameUp", { "to": this.state.id, "from": this.getCurrentUser().auth_id })
    const modal: HTMLElement | null = document.getElementById('ModalMatchWaiting') as HTMLDivElement;
    modal.classList.remove('hidden');
    // let parties: PartiesType[] = [];
    // try {
    //   parties = await Request(
    //     'GET',
    //     {},
    //     {},
    //     "http://82.165.70.203:3000/parties/"
    //   )
    // } catch (error) {
    //   ctx.setError(error);
    // }
    // const ids: number[] = parties.map((p: any) => {
    //   return p.id;
    // })
    // window.location.href = "http://cousinade-baudry.fr/game/" + Math.max(...ids)
  }

  renderUserCards = (id: number): JSX.Element => {
    if (!this.props.stat) {
      if (this.props.avatar) {
        return (
          <div
            key={id}
            className="friendsDiv mt-2 col-12 d-flex flex-row align-items-center"
          >
            <div className="col-5  d-flex flex-row justify-content-start">
              {/* <Link to={"/chat"}> */}
              <BtnToChat cb={this.createChan}/>
              {/* </Link> */}
              {/* <Link to={"/game"}> */}
                <button className="mx-2 p-1" onClick={this.startNewGame}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-joystick"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10 2a2 2 0 0 1-1.5 1.937v5.087c.863.083 1.5.377 1.5.726 0 .414-.895.75-2 .75s-2-.336-2-.75c0-.35.637-.643 1.5-.726V3.937A2 2 0 1 1 10 2z" />
                    <path d="M0 9.665v1.717a1 1 0 0 0 .553.894l6.553 3.277a2 2 0 0 0 1.788 0l6.553-3.277a1 1 0 0 0 .553-.894V9.665c0-.1-.06-.19-.152-.23L9.5 6.715v.993l5.227 2.178a.125.125 0 0 1 .001.23l-5.94 2.546a2 2 0 0 1-1.576 0l-5.94-2.546a.125.125 0 0 1 .001-.23L6.5 7.708l-.013-.988L.152 9.435a.25.25 0 0 0-.152.23z" />
                  </svg>
                </button>
              {/* </Link> */}
            </div>
            <div className="col-2 d-flex flex-row d-flex justify-content-center">
              <input className={this.state.online} type="radio"></input>
            </div>
            <div className="col-5 d-flex flex-row justify-content-end align-items-center">
              <Link to={"/profil/" + this.state.login} className="mx-2 overflow-hidden">
                {this.state.login}
              </Link>
              <Link to={"/profil/" + this.state.login} className="mx-2">
                <img
                  alt=""
                  src={
                    "http://82.165.70.203:3000/user/" +
                    this.props.user.auth_id +
                    "/avatar"
                  }
                  className="miniAvatar"
                />
              </Link>
            </div>
          </div>
        );
      }

      return (
        <div key={id} className="friendsDiv d-flex flex-row my-2 col-12">
          <div className="col-3">
            <input className={this.state.online} type="radio"></input>
          </div>
          {/* <div className="col-6 row"> */}
          <Link to={"/profil/" + this.state.login} className="col-9 overflow-hidden">
            {this.state.login}
          </Link>
          {/* <a href={"/profil/" + this.state.login} className="col-12">{this.state.login}</a> */}
          {/* </div> */}
        </div>
      );
    }

    return (
      <div
        key={id}
        className="friendsDiv col-12 mr-2 d-flex flex-row align-items-center"
      >
        <div className="col-4 d-flex flex-row justify-content-start align-items-center">
          <Link to={"/profil/" + this.state.login} className="mx-2">
            <img
              alt=""
              src={
                "http://82.165.70.203:3000/user/" +
                this.props.user.auth_id +
                "/avatar"
              }
              className="miniAvatar"
            />
          </Link>
          <Link to={"/profil/" + this.state.login} className="mx-2 overflow-hidden">
            {this.state.login}
          </Link>
        </div>
        <div className="Score col-8 d-flex justify-content-end align-items-center">
          <div className="">won</div>
          <div className="Ratio mx-2 p-1 d-flex flex-row align-items-center">
            <div className="Rwon col-6 px-2 d-flex justify-content-start align-items-center">{this.props.user.game_won ? this.props.user.game_won : 0}</div>
            <div className="col-6 px-2 d-flex justify-content-end">{this.props.user.game_lost ? this.props.user.game_lost : 0}</div>
          </div>
          <div className="">lost</div>
        </div>
      </div>
    );
  };

  openInvite = (body: { "to": string, "from": string }): void => {
    if (body.to === this.getCurrentUser().auth_id) {
      const modal: HTMLDivElement = document.getElementById("ModalMatchInvite" + this.state.id) as HTMLDivElement;
      modal.classList.remove('hidden')
    }
  }

  closeInvite = (body: { "to": string, "from": string }): void => {
    if (body.to === this.getCurrentUser().auth_id) {
      const modal: HTMLDivElement = document.getElementById('ModalMatchInvite' + this.state.id) as HTMLDivElement;
      modal.classList.add('hidden')
    }
  }

  initSocket = (): void => {
    if (this.state.socket !== "on") {
      this.setState({ socket: 'on' });
      socket.on("onAskForGameUp", (body: { "to": string, "from": string }) => {
        this.openInvite(body);
      });
      socket.on("onAskForGameDown", (body: { "to": string, "from": string }) => {
        this.closeInvite(body);
      });
      socket.on("onInviteAccepted", (body: { "to": string, "from": string, "partyID": string }) => {
        if (body.to === this.getCurrentUser().auth_id)
          window.location.href = "http://cousinade-baudry.fr/gameup/" + body.partyID;
      });
      socket.on("onInviteDeclined", (body: { "to": string, "from": string }) => {
        if (body.to === this.getCurrentUser().auth_id) {
          const modal = document.getElementById('ModalMatchWaiting') as HTMLDivElement;
          modal.classList.add('hidden');
        }
      });
    }
  }

  componentDidMount = async (): Promise<void> => {
    const ctx: any = this.context;
    let user: UserType | undefined = undefined;
     try {
       user = await Request(
         "GET",
         {},
         {},
         "http://82.165.70.203:3000/user/id/" + this.state.id
       );
     } catch (error) {
       ctx.setError(error);
     }
    let status: string = "offline";
    if (user) {
      if (user.status === 1) {
        status = "online";
      }
      this.setState({ login: user.username, online: status });
    }
    this.setState({ ssid: this.getCurrentUser().auth_id });
    this.setState({ ssname: this.getCurrentUser().username });
    this.initSocket();
    this.setSocket();
  };

  render(): JSX.Element {
    const items: JSX.Element = this.renderUserCards(1);
    return (
      <div
        key={(this.state.id * 5) / 3}
        className="col-12 m-2 d-flex flex-row justify-content-between"
      >
        <ModalMatchWaiting title="Waiting for opponent" calledBy="UserCards" hidden user={this.props.user} />
        <ModalMatchInvite title="Invitation" calledBy="UserCards" user={this.props.user} />
        {items}
      </div>
    );
  }
}

export default UserCards;
