import { Component } from 'react';
import Request from "./Requests"
import { AuthContext } from "../../contexts/AuthProviderContext"
import "../../styles/components/utils/modal.css";
import { Link } from "react-router-dom";
import { ChanType, UserType } from "../../types"
import { Alert } from 'react-bootstrap';
import ModalCheckPass from './ModalCheckPass';

class Modal extends Component<
  {
    title: string,
    calledBy: string,
    userChan?: UserType[],
    userBan?: UserType[],
    parentCallBack?: any,
    chans?: ChanType[],
    chanList?: ChanType[]
  },
  {
    user: UserType | undefined,
    friends: UserType[],
    input: string,
    allChans: Array<ChanType>,
    protected: boolean,
    alertRadio: boolean,
    fieldName: string,
    errName: string,
    alertName: boolean,
    fieldPass: string,
    errPass: string,
    alertPass: boolean,
    printed: JSX.Element[],
    type: string
    banned: ChanType[],
    joined: ChanType[],
  }
> {
  static contextType = AuthContext;
  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      user: undefined,
      friends: [],
      input: "",
      allChans: [],
      protected: false,
      alertRadio: false,
      fieldName: "",
      errName: "",
      alertName: false,
      fieldPass: "",
      errPass: "",
      alertPass: false,
      printed: [],
      type: "",
      banned: [],
      joined: [],
    };
  }

  componentDidUpdate(props:any, state:any) {
    const ctx: any = this.context;
    if (state.banned.length !== ctx.bannedFrom.length) {
      //this.setState({ banned: ctx.bannedFrom });
      // console.log('modal banned refresh')
      setTimeout(() => {
        this.updateChan()
      }, 10)
    }
    if (state.joined.length !== ctx.chanFrom.length) {
      //this.setState({ joined: ctx.chanFrom })
      // console.log('modal joined refresh')
      setTimeout(() => {
        this.updateChan()
      }, 10)
    }
    if (props.chanList.length !== this.state.allChans.length
    ) {
      // console.log('modal chanlist refresh')
      setTimeout(() => {
        this.updateChan()
      }, 10)
    }
  }

  hiddenCreate = (): void => {
    let modal: HTMLElement | null = document.getElementById("Modal") as HTMLDivElement;
    const radioPub: HTMLInputElement | null = document.querySelector("#public") as HTMLInputElement;
    const radioPri: HTMLInputElement | null = document.querySelector("#private") as HTMLInputElement;
    const radioPro: HTMLInputElement | null = document.querySelector("#protected") as HTMLInputElement;
    const chanName: HTMLInputElement | null = document.querySelector("#chanName") as HTMLInputElement;
    const chanPassword: HTMLInputElement | null = document.querySelector("#chanPassword") as HTMLInputElement;
    radioPub.checked = true;
    radioPri.checked = false;
    radioPro.checked = false;
    chanName.value = "";
    chanPassword.value = "";
    this.setState({
      protected: false,
      alertRadio: false,
      fieldName: "",
      errName: "",
      alertName: false,
      fieldPass: "",
      errPass: "",
      alertPass: false,
    });
    modal.classList.add("hidden");
    chanPassword.classList.add("hidden");
  };

  hiddenJoin = (): void => {
    const modal: HTMLElement | null = document.getElementById("Modal") as HTMLDivElement;
    this.setState({
      protected: false,
      alertRadio: false,
      fieldName: "",
      errName: "",
      alertName: false,
      fieldPass: "",
      errPass: "",
      alertPass: false
    });
    modal.classList.add("hidden");
  };

  hiddenAddUser = (): void => {
    const modal: HTMLElement | null = document.getElementById("Modal") as HTMLDivElement;
    this.setState({
      protected: false,
      alertRadio: false,
      fieldName: "",
      errName: "",
      alertName: false,
      fieldPass: "",
      errPass: "",
      alertPass: false
    });
    modal.classList.add("hidden");
  };

   updateChan = async (): Promise<void> => {
    const ctx: any = this.context
    this.setState({ banned: ctx.bannedFrom })
    this.setState({ joined: ctx.chanFrom })
    const newUser: UserType = ctx.user
    if (newUser) {
      this.setState({ user: newUser });
    }
    //let users: UserType[] = [];
    let chans: ChanType[] = [];
    try {
      /*
      users = await Request(
        "GET",
        {},
        {},
        "http://82.165.70.203:3000/user/"
      );
       */

      chans = await Request(
        "GET",
        {},
        {},
        "http://82.165.70.203:3000/chan"
      );

    } catch (error) {
      ctx.setError(error);
    }
    this.setState({ friends: ctx.userList, allChans: chans });
    this.chans();
   }


  componentDidMount = () => {

    this.updateChan();
  };

  // displayUser = (id: number, user: UserType) => {
  //   return (
  //       <div
  //           key={id}
  //           className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center"
  //       >
  //         <div className="col-5 h-100 overflow-hidden buttons">
  //           <button
  //             className='btn btn-outline-dark shadow-none'
  //               onClick={() =>
  //                   this.props.parentCallBack.socket.emit("addToChannel", {
  //                     room: this.props.parentCallBack.room,
  //                     auth_id: user.auth_id,
  //                   })
  //               }
  //           >
  //             ADD
  //           </button>for(let x: number = 0; x < usersChan.length; x++)
  //         {
  //             if (usersChan[x].user?.username !== user.username)
  //             {
  //                 ret.push(
  //                         <div key={x} className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center">
  //                          <div className="col-5 h-100 overflow-hidden buttons">
  //                             <button type="button" onClick={ () => banUser(usersChan[x]) }>
  //                                 {
  //                                     usersChan[x].isBan ?
  //                                         <p>UNBAN</p> :
  //                                         <p>BAN</p>
  //                                 }
  //                             </button>
  //                          </div>
  //                         <div className="col-2 d-flex flex-row d-flex justify-content-center">
  //                             <input className={usersChan[x].user?.status ? "online" : "offline"} type="radio"></input>
  //                         </div>
  //                         <div className="col-5 d-flex flex-row justify-content-end align-items-center">
  //                             <Link to={"/profil/" + usersChan[x].user?.username} className="mx-2">{usersChan[x].user?.username}</Link>
  //                             <img alt="" src={'http://82.165.70.203:3000/user/' + usersChan[x].user?.auth_id + '/avatar'} className="miniAvatar" width={150} height={150}/>
  //                         </div>
  //                     </div>
  //                 );
  //             }
  //         }
  //         setList(ret);
  //         </div>
  //         <div className="col-2 d-flex flex-row d-flex justify-content-center">
  //           <input
  //               className={user.status ? "online" : "offline"}
  //               type="radio"
  //           ></input>
  //         </div>
  //         <div className="col-5 d-flex flex-row justify-content-end align-items-center">
  //           <a href={"/profil/#" + user.username} className="mx-2">
  //             {user.username}
  //           </a>
  //           <img
  //               src={user.avatar}
  //               className="miniAvatar"
  //               width={150}
  //               height={150}
  //           />
  //         </div>
  //       </div>
  //   );
  // };

  // users = () => {
  //   let friends: Array<any> = [];
  //   let isUsers: boolean = false;
  //   let x: number = 0;
  //   if (this.state.friends.length > 0) {
  //     let chanUser: Array<UserType> | undefined = this.props.userChan;
  //     while (
  //         chanUser?.length &&
  //         chanUser?.length > 0 &&
  //         x < this.state.friends.length
  //         ) {
  //       let friend: UserType = this.state.friends[x];
  //       if (!chanUser.find((user) => user.auth_id === friend.auth_id)) {
  //         isUsers = true;
  //         if (
  //             this.state.input.length === 0 ||
  //             friend.username.includes(this.state.input)
  //         )
  //           friends.push(this.displayUser(x, this.state.friends[x]));
  //       }
  //       x++;
  //     }
  //   }
  //   if (isUsers)
  //     friends.unshift(
  //         <input
  //             key={x++}
  //             id="searchUserToAdd"
  //             className="w-100"
  //             type="text"
  //             placeholder="Search user here"
  //             value={this.state.input}
  //             onChange={(e) => this.setState({ input: e.target.value })}
  //         />
  //     );
  //     // if (!allChans) return;
  //     // this.setState({ friends: friends, allChans: allChans });
  //   // } catch (error) {
  //   //   const ctx: any = this.context;
  //   //   ctx.setError(error);
  //   // }
  // };

  verifRadio = async (): Promise<boolean> => {
    const radioPub: HTMLInputElement | null = document.querySelector("#public") as HTMLInputElement;
    const radioPri: HTMLInputElement | null = document.querySelector("#private") as HTMLInputElement;
    const radioPro: HTMLInputElement | null = document.querySelector("#protected") as HTMLInputElement;
    if (radioPub.checked === false && radioPri.checked === false && radioPro.checked === false) {
      this.setState({ alertRadio: true });
      return false;
    }
    else if (radioPub.checked === true) {
      await this.setState({ alertRadio: false, type: "public" });
    }
    else if (radioPri.checked === true) {
      await this.setState({ alertRadio: false, type: "private" });
    }
    else if (radioPro.checked === true) {
      await this.setState({ alertRadio: false, type: "protected" });
    }
    return true;
  };

  verifName = (): boolean => {
    // let users = await getUsers();
    const regex: RegExp = /^[\w-]+$/
    const minmax: RegExp = /^.{3,10}$/
    // let retPass = true;
    // if (this.state.protected)
    //   retPass = this.verifPass()
    if (!regex.test(this.state.fieldName)) {
      this.setState({ errName: "Non valid character" });
      this.setState({ alertName: true });
      return false;
    }
    else if (!minmax.test(this.state.fieldName)) {
      this.setState({ errName: "Name must contains between 3 and 10 characters" });
      this.setState({ alertName: true });
      return false;
    }
    else if (this.state.allChans.findIndex((c: any) => c.name === this.state.fieldName) > -1) {
      this.setState({ errName: "This channel name already exists" });
      this.setState({ alertName: true });
      return false;
    }
    else {
      this.setState({ errName: "" });
      this.setState({ alertName: false });
    }
    // if (!retPass)
    //   return false;
    return true;
  };

  verifPass = (): boolean => {
    var minmax = /^.{8,30}$/

    if (!minmax.test(this.state.fieldPass)) {
      // if (this.state.fieldPass.length < 8 || this.state.fieldPass.length > 30) {
      this.setState({ errPass: "Password must contains between 8 and 30 characters" });
      this.setState({ alertPass: true });
      return false;
    }
    else {
      this.setState({ errPass: "" });
      this.setState({ alertPass: false });
      return true;
    }
  };

  createChan = async (): Promise<void> => {
    const retRadio: boolean = await this.verifRadio();
    const retName: boolean = this.verifName();
    let retPass: boolean = true;
    if (this.state.protected) {
      retPass = this.verifPass();
    }
    if (retRadio && retName && retPass) {
      this.props.parentCallBack.createChannel(
          this.state.fieldName,
          this.state.type,
          this.state.fieldPass)
      this.hiddenCreate()
    }
  };

  displayUser = (id: number, user: UserType): JSX.Element => {
    return (
      <div
        key={id}
        className="friendsDiv d-flex flex-row d-flex justify-content-between align-items-center mb-2"
      >
        <div className="col-5 buttons">
          <button
            onClick={() =>
              this.props.parentCallBack.socket.emit("addToChannel", {
                room: this.props.parentCallBack.room,
                auth_id: user.auth_id,
              })
            }
          >
            ADD
          </button>
        </div>
        <div className="col-2 d-flex flex-row d-flex justify-content-center">
          <input
            className={user.status ? "online" : "offline"}
            type="radio"
          ></input>
        </div>
        <div className="col-5 d-flex flex-row justify-content-end align-items-center">
          <Link to={"/profil/" + user.username} className="mx-2">
            {user.username}
          </Link>
          <img
            alt=""
            src={
              "http://82.165.70.203:3000/user/" +
              user.auth_id +
              "/avatar"
            }
            className="miniAvatar"
            width={150}
            height={150}
          />
        </div>
      </div>
    );
  };

  users = (): JSX.Element[] => {
    const friends: Array<JSX.Element> = [];
    let isUsers: boolean = false;
    let x: number = 0;
    if (this.state.friends.length > 0) {
      const chanUser: Array<UserType> | undefined = this.props.userChan;
      while (
        chanUser?.length &&
        chanUser?.length > 0 &&
        x < this.state.friends.length
      ) {
        const friend: UserType = this.state.friends[x];
        if (!chanUser.find((user) => user.auth_id === friend.auth_id)) {
          isUsers = true;
          if (
            this.state.input.length === 0 ||
            friend.username.includes(this.state.input)
          )
          friends.push(this.displayUser(x, this.state.friends[x]));
        }
        x++;
      }
    }
    if (isUsers)
      friends.unshift(
        <input
          key={x++}
          id="searchUserToAdd"
          className="w-100 mb-2"
          type="text"
          placeholder="Search user here"
          value={this.state.input}
          onChange={(e) => this.setState({ input: e.target.value })}
        />
      );
    if ((isUsers && friends.length === 1) || !isUsers) {
      friends.push(<p key={x}>No available users to add</p>);
    }
    return friends;
  };

  checkIfBanned = (chan: ChanType): boolean => {
    //const ctx: any = this.context;
    //const banned: ChanType[] = ctx.bannedFrom;
    for (let index: number = 0; index < this.state.banned.length; index++) {
      if (chan.id === this.state.banned[index].id) {
        return true;
      }
    }
    return false;
  }

  checkIfAlreadyIn = (chan: ChanType): boolean => {
    //const ctx: any = this.context;
    //const joined: ChanType[] = ctx.chanFrom;
    for (let index: number = 0; index < this.state.joined.length; index++) {
      if (chan.id === this.state.joined[index].id) {
        return true;
      }
    }
    return false;
  }

  // checkPassword = (x: number) => {
  //   let modalCheckPass = document.getElementById(
  //     "checkPassword" + x
  //   ) as HTMLDivElement;
  //   modalCheckPass.classList.remove("hidden");
  // }

  joinRoom = (newRoom: ChanType): void => {
    this.props.parentCallBack.joinRoom(newRoom)
    // this.hiddenJoin()
  }

  joinRoomPublic = (key: number): void => {
    this.props.parentCallBack.joinRoom(
      this.state.allChans[key],
      true
    )
    this.hiddenJoin()
  }

  chans = (): void => {
    const ret: JSX.Element[] = [];
    for (let x: number = 0; x < this.state.allChans.length; x++) {
      if (
        this.state.allChans[x].type !== "private" &&
        this.state.allChans[x].type !== "direct"
      ) {
        if (!this.checkIfAlreadyIn(this.state.allChans[x]) &&
            !this.checkIfBanned(this.state.allChans[x])
        ) {
          ret.push(
            <div className="row TEST" key={x}>
              <div className='d-flex flex-row'>
                {
                  this.state.allChans[x].type === "protected" ?
                    <ModalCheckPass chanToJoin={this.state.allChans[x]} clef={x} parentCallBack={this.joinRoom} />
                    :
                    <button
                      onClick={() =>
                        this.joinRoomPublic(x)
                      }
                    >
                      JOIN
                    </button>
                }
                <p className="col-6">{this.state.allChans[x].name}</p>
                <div>
                  {
                    this.state.allChans[x].type === "protected" ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                      </svg> :
                      <div />
                  }
                </div>
              </div>
            </div >
          );
        }
      }
    }
    this.setState({ printed: ret })
  };

  joinPrivateChan = async (): Promise<void> => {
    const input = document.getElementById(
      "InputJoinPrivateChan"
    ) as HTMLInputElement;
    try {
      const chan: ChanType = await Request(
          "GET",
          {},
          {},
          "http://82.165.70.203:3000/chan/" + input.value
      );
      if (!chan || this.checkIfBanned(chan)) {
        return;
      }
      this.props.parentCallBack.joinRoom(chan, true);
    } catch (error) {
      const ctx: any = this.context;
      ctx.setError(error);
    }
  };

  pressEnter = (e: any): void => {
    if (e.key === "Enter") {
      this.joinPrivateChan();
    }
  };


  showPass = (): void => {
    const intput: HTMLElement | null = document.getElementById("chanPassword") as HTMLDivElement;
    intput.classList.remove("hidden");
    this.setState({ protected: true });
    // login.value = "";
  };

  hiddenPass = (): void => {
    const intput: HTMLElement | null = document.getElementById("chanPassword") as HTMLDivElement;
    intput.classList.add("hidden");
    this.setState({ protected: false });
    // login.value = "";
  };

  closeAlertRadio = (): void => {
    this.setState({ alertRadio: false });
  }

  handleName = (evt: any): void => {
    evt.preventDefault();
    this.setState({ fieldName: evt.target.value });
  };

  closeAlertName = (): void => {
    this.setState({ alertName: false });
    this.setState({ errName: "" })
  }

  handlePass = (evt: any): void => {
    evt.preventDefault();
    this.setState({ fieldPass: evt.target.value });
  };

  closeAlertPass = (): void => {
    this.setState({ alertPass: false });
    this.setState({ errPass: "" })
  }

  printer = (): JSX.Element | undefined => {
    switch (this.props.calledBy) {
      case "newChan":
        return (
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <form className="mb-3 d-flex align-items-start flex-column">
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  name="ChanType"
                  value="public"
                  id="public"
                  onChange={this.hiddenPass}
                  className='mx-2'
                  defaultChecked
                />
                Public
              </div>
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  name="ChanType"
                  value="private"
                  id="private"
                  onChange={this.hiddenPass}
                  className='mx-2'
                />
                Private
              </div>
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  name="ChanType"
                  value="protected"
                  id="protected"
                  onChange={this.showPass}
                  className='mx-2'
                />
                Protected
              </div>
              <div>
                {this.state.alertRadio ?
                  <Alert onClose={this.closeAlertRadio} variant="danger" dismissible>{"Choose a chan type"}</Alert> :
                  // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                  <div />
                }
              </div>
              <input
                type="text"
                id="chanName"
                placeholder="name"
                onChange={this.handleName}
                className='mt-2'
              />
              <div>
                {this.state.alertName ?
                  <Alert onClose={this.closeAlertName} variant="danger" dismissible>{this.state.errName}</Alert> :
                  // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                  <div />
                }
              </div>
              {/* <br /> */}
              <input
                type="text"
                id="chanPassword"
                placeholder="password"
                onChange={this.handlePass}
                className='hidden'
              ></input>
              <div>
                {this.state.alertPass ?
                  <Alert onClose={this.closeAlertPass} variant="danger" dismissible>{this.state.errPass}</Alert> :
                  // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                  <div />
                }
              </div>
              {/* <br /> */}
            </form>
            <footer>
              <button className="mx-1" onClick={this.hiddenCreate}>
                Cancel
              </button>
              <button className="mx-1" onClick={this.createChan}>
                Create
              </button>
            </footer>
          </div>
        );
      case "addUser":
        return (
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <div>{this.users()}</div>
            <footer>
              <button className="mx-1" onClick={this.hiddenAddUser}>
                Close
              </button>
            </footer>
          </div>
        );
      case "joinChan":
        return (
          <div className="p-4 pb-1">
            <header className="mb-3">
              <h2>{this.props.title}</h2>
            </header>
            <div>
              <div>
                <input
                  id="InputJoinPrivateChan"
                  className="col-8"
                  type="text"
                  placeholder="Enter Private Channel"
                  onKeyDown={this.pressEnter}
                ></input>
                <button onClick={this.joinPrivateChan}>JOIN</button>
              </div>
              {/* <div>{this.chans()}</div> */}
              <div>{this.state.printed}</div>
            </div>
            <footer>
              <button className="mx-1" onClick={this.hiddenJoin}>
                Close
              </button>
            </footer>
          </div>
        )
    }
  };

  render(): JSX.Element {
    return (
      <div className="Modal hidden" id="Modal">
        {this.printer()}
      </div>
    );
  }
}

export default Modal;
