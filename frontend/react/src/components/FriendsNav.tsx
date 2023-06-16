import { Component } from "react";
import Request from "./utils/Requests";
import { UserType } from "../types"
import { AuthContext } from "../contexts/AuthProviderContext";
import '../styles/components/friendsnav.css';
import DisplayFriendsList from "./utils/DisplayFriendsList";
import { Alert } from "react-bootstrap";
import { io } from "socket.io-client";
import { FriendUserReceiveDto, FriendUserSendDto } from "../dtos/friend-user.dto";

const socket = io('http://82.165.70.203:3000/update')
class FriendsNav extends Component<{}, {
  uslist: Array<UserType>,
  filteredList: Array<UserType>,
  friends: Array<UserType>,
  alert: boolean,
}> {
  static contextType = AuthContext;
  constructor(props: any, context: any) {
    super(props, context)
    this.state = {
      friends: [],
      filteredList: [],
      uslist: [],
      alert: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<{

    }>,
    prevState: Readonly<{
      uslist: Array<UserType>;
      filteredList: Array<UserType>;
      friends: Array<UserType>;
      alert: boolean
    }>,
    snapshot?: any): void {
    const ctx: any = this.context;
    if (prevState.friends !== ctx.friendsList) {
      this.setState({ friends: ctx.friendsList })
    }
    if (prevState.uslist !== ctx.userList) {
      this.setState({ uslist: ctx.userList });
    }
  }

  componentDidMount = async (): Promise<void> => {
    const ctx: any = this.context;
    this.setState({ friends: ctx.friendsList })
    this.setState({ uslist: ctx.userList })
  }

  addFriends = async (): Promise<void> => {
    const ctx: any = this.context;
    const currentUser: UserType = ctx.user;
    const input = document.getElementById("InputAddFriends") as HTMLInputElement
    if (input.value === "" ||
      input.value === currentUser.username ||
      this.state.friends.find((u: UserType) => u.username === input.value)) {
      input.value = '';
      return;
    }
    try {
      let exist: boolean = false;
      for (let x = 0; x < this.state.uslist.length; x++) {
        if (this.state.uslist[x].username === input.value)
          exist = true;
      }
      if (exist) {
        this.setState({ alert: false })
        const userToAdd: UserType = await Request(
          'GET',
          {},
          {},
          "http://82.165.70.203:3000/user/name/" + input.value
        )
        input.value = '';
        const response: FriendUserReceiveDto = {
          curid: currentUser.auth_id,
          frid: userToAdd.auth_id,
          action: true,
        }
        socket.emit("updateFriend", response)
      }
      else {
        this.setState({ alert: true })
      }
    } catch (error) {
      ctx.setError(error);
    }
  }

  pressEnter = (e: any): void => {
    const ctx: any = this.context;
    const query: string = e.target.value;
    let updatedList: UserType[] = [...this.state.uslist];
    updatedList = updatedList.filter((item: UserType) => {
      if (e.target.value.length === 0) {
        return null;
      }
      for (let index = 0; index < this.state.friends.length; index++) {
        if (item.username === this.state.friends[index].username) {
          return null;
        }
      }
      if (item.username === ctx.user.username) {
        return null;
      }
      return item.username.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    this.setState({ filteredList: updatedList })
    if (e.key === 'Enter') {
      this.addFriends();
      //input.value = "";
    }
  }

  closeAlert = (): void => {
    this.setState({ alert: false });
  }

  render(): JSX.Element {

    let onlines: number = 0;
    if (this.state.friends.length > 0) {
      onlines = 0;
      let x: number = 0;
      while (x < this.state.friends.length) {
        if (this.state.friends[x].status)
          onlines++;
        x++;
      }
    }

    return (
      <div className="FriendsNav col-12">
        <div className="d-none d-lg-block w-100">
          <img className="pat w-50" src="/pictures/pat.png" alt="pat" />
        </div>
        <div className="numberFriendsOnline col-12">
          <p>
            {onlines ? onlines + '/' +
              this.state.friends.length +
              " friends online" : 'No friends online'}
          </p>
        </div>
        <div className="addFriends my-3 col-12">
          <div className="divAddFriend d-flex flex-row px-2 col-12">
            <div className="inputDrop col-8 d-flex justify-content-start">
              <input
                id="InputAddFriends"
                className="col-12 d-flex justify-content-start"
                type="text"
                placeholder="login"
                onKeyDown={this.pressEnter}>
              </input>
            {/*  <div className="item-list">
                <ol>
                  {this.state.filteredList.map((item: UserType, key: any) => (
                    <li className="d-flex justify-content-start p-1" key={key}>{item.username}</li>
                  ))}
                </ol>
              </div>*/}

            </div>
            <button
              className="btnAddUser col-4 ml-2"
              onClick={this.addFriends}>ADD</button>
          </div>
          <div>
            <div>
              {this.state.alert ?
                <Alert
                  onClose={this.closeAlert}
                  variant="danger"
                  dismissible>{"This user doesn't exist"}</Alert> :
                // <Alert onClose={closeAlert} variant="danger" dismissible>{alertMsg}</Alert> :
                <div />
              }
            </div>
            <DisplayFriendsList />
          </div>
        </div>
      </div>
    ); // fin de return
  } // fin de render
} // fin de App
//
export default FriendsNav;
