import { Component } from "react";
import { ChanType, UserType } from "../../types"
import { AuthContext } from "../../contexts/AuthProviderContext";
import ModalBanUser from '../utils/ModalBanUser';
import ModalMuteUser from '../utils/ModalMuteUser';
import ModalAdminUser from "../utils/ModalAdminUser";
import { Socket } from "socket.io-client";
import { channel } from "diagnostics_channel";

class AdminButtons extends Component<
    {
        room: string,
        socket: Socket,
        user: UserType,
        chanList: ChanType[]
        usersInChan: UserType[],
    },
    {
        adminList: ChanType[],
    }> {
    static contextType = AuthContext;
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            adminList: [],
        }
    }
    componentDidMount = (): void => {
        const ctx: any = this.context;
        this.setState({adminList: ctx.adminList})
    }

    componentDidUpdate(
        prevProps: Readonly<{
            room: string;
            socket: Socket;
            user: UserType;
            chanList: ChanType[],
            usersInChan: UserType[],
        }>,
        prevState: Readonly<{
            adminList: ChanType[],
        }>,
        snapshot?: any): void {
        const ctx: any = this.context;
        if (prevState.adminList !== ctx.adminFrom) {
            // console.log('update admin state');
            this.setState({adminList: ctx.adminFrom});
            //this.render();
        }
    }

    isUserAdmin = (): boolean => {
        return this.state.adminList &&
            this.state.adminList.findIndex((c: ChanType) => c.id === this.props.room) > -1;
    }

    render(): JSX.Element {
    const chan: ChanType = this.props.chanList[
        this.props.chanList.findIndex((c: ChanType) => c.id === this.props.room)
        ]
    if (!chan) {
        return <p></p>;
    }
    if (this.isUserAdmin()) {
      return (
         <div className="d-flex flex-rox p-0">
             <ModalBanUser
                 chan={this.props.room}
                 socket={this.props.socket}
                 usersInChan={this.props.usersInChan} />
             <ModalMuteUser
                 chan={this.props.room}
                 socket={this.props.socket}
                 usersInChan={this.props.usersInChan} />
             <ModalAdminUser
                 chan={this.props.room}
                 socket={this.props.socket}
                 usersInChan={this.props.usersInChan}/>
         </div>
      )
    }
    return <p></p>
  }
}

export class PrintAddUserButton extends Component<{chanList: ChanType[], parentCallBack: any}, {}> {
  promptAddUser = (): void => {
    const modal: HTMLElement | null = document.getElementById("Modal") as HTMLDivElement;
    modal.classList.remove("hidden");
    this.props.parentCallBack.setModalType("addUser");
    this.props.parentCallBack.setModalTitle("Add a user");
  };
  render(): JSX.Element {
    let url: string = document.URL;
    url = url.substring(url.lastIndexOf("/") + 1);
    const id: number = parseInt(url);
    if (id && id > 0) {
        const chan = this.props.chanList.find(c => Number(c.id) === Number(id))
        if (chan && chan.type !== "direct") {
      return (<button
          id="addPeople"
          className="col-2 mb-2"
          onClick={this.promptAddUser}>
          Add Peoples
      </button>)
    }}
    return <p></p>
  }
}

export const PrintHeaderChan = (
  {
      chanList,
      usersInChan,
      room,
      socket,
      user,
      parentCallBack}:
  {
      chanList: ChanType[],
      usersInChan: UserType[],
      room: string,
      user: UserType,
      socket: Socket,
      parentCallBack: any
  }): JSX.Element => {
    const setModalType = (newValue: any): void => {
      parentCallBack.setModalType(newValue)
    }
    const setModalTitle = (newValue: any): void => {
      parentCallBack.setModalTitle(newValue)
    }
    return (
        <div className="chatMainTitle row">
          {/* <h3 className="col-10">Channel Name</h3> */}
          <PrintAddUserButton
              chanList={chanList}
              parentCallBack={{setModalType, setModalTitle}}
          />
          <AdminButtons
              room={room}
              socket={socket}
              user={user}
              chanList={chanList}
              usersInChan={usersInChan}
          />
        </div>
    )
}

export default PrintHeaderChan;
