import { Component, useState } from "react";
import UserCards from '../utils/UserCards'
import { socket } from '../../contexts/WebSocketContext';
import { ChanType, UserType } from "../../types"
import { useAuthData } from "../../contexts/AuthProviderContext";
import { PrintHeaderChan } from './PrintHeaderChan'
import { PrintMessages } from './PrintMessages'
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

class UsersInActualchannel extends Component<{ usersList: UserType[] }, {}> {

  render(): JSX.Element[] {
    const users: JSX.Element[] = [];
    const actualChan = this.props.usersList;
    if (actualChan.length)
      actualChan.forEach((u: UserType) => {
        users.push(
          <div key={u.user_id}>
            <UserCards user={u} avatar={false} stat={false} />
          </div>)
      })
    return users;
  }
}

export const PrintChannel = (
  {
    msgInput,
    value,
    chanList,
    user,
    room,
    usersInChan,
    currentChan,
    parentCallBack
  }:
    {
      msgInput: any,
      value: any,
      chanList: ChanType[],
      user: UserType,
      room: any,
      usersInChan: UserType[],
      currentChan: any,
      parentCallBack: any
    }): JSX.Element => {
  const navigate = useNavigate();
  const { mutedFrom } = useAuthData();
  const [err, setErr] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);

  const setModalType = (newValue: any): void => {
    parentCallBack.setModalType(newValue)
  }

  const setModalTitle = (newValue: any): void => {
    parentCallBack.setModalTitle(newValue)
  }

  const setValue = (newValue: any): void => {
    parentCallBack.setValue(newValue)
  }

  const setChanList = (newValue: any): void => {
    parentCallBack.setChanList(newValue)
  }

  /*
  useEffect(() => {
    const checkIfBanned = async () => {
      let ban = await Request(
          "GET",
          {},
          {},
          "http://82.165.70.203:3000/user/chan/banned"
      )
      for (let i = 0; i < ban.length; i++) {
        if (ban[i].id === room) {
          socket.emit("leaveRoom", {room: room, auth_id: user.auth_id});
          parentCallBack.changeActiveRoom("");
          parentCallBack.setMessage([]);
          parentCallBack.setRoom("null");
          parentCallBack.getChan();
          window.location.href = "http://cousinade-baudry.fr/chat"; //!
        }
      }
    }
    checkIfBanned();
  }, [bannedFrom])
  */

  const checkIfMuted = (): boolean => {
    /*
    let mutedList: ChanType[] = [];
    try {
      mutedList = await Request(
          "GET",
          {},
          {},
          "http://82.165.70.203:3000/user/chan/muted"
      )
    } catch (error) {
      setError(error);
    }
     */
    for (let i: number = 0; i < mutedFrom.length; i++) {
      if (mutedFrom[i].id === room) {
        return true;
      }
    }
    return false;
  }

  const onSubmit = (): void => {
    var minmax: RegExp = /^.{0,150}$/

    // check if array is empty or contain only whitespace
    if (!checkIfMuted()) {
      if (!minmax.test(value)) {
        setErr("The message must contains between 0 and 150 characters")
        setAlert(true);
      }
      else {
        if (value !== "" && value.replace(/\s/g, "") !== "" && room !== undefined) {
          if (value === "/leave") {
            // console.log(room, user.auth_id)
            socket.emit("leaveRoom", { room: room, auth_id: user.auth_id });
            parentCallBack.changeActiveRoom("");
            //parentCallBack.setMessage([]);
            parentCallBack.setRoom("null");
            //parentCallBack.getChan();
            //window.location.href = "http://cousinade-baudry.fr/chat"; //!
            navigate("/chat");
          } else {
            socket.emit("newMessage", {
              chat: value,
              sender_socket_id: user.auth_id,
              username: user.username,
              avatar: user.avatar,
              auth_id: user.auth_id,
              room: room,
            });
          }
        }
        setAlert(false);
        setErr("")
        setValue("");
      }
    } else {
      // setValue("You've been muted");
      // setTimeout(() => {
      //   setValue("");
      // }, 1800)
      setErr("You've been muted")
      setAlert(true);
    }
  };

  const pressEnter = (e: any): void => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const closeAlert = (): void => {
    setAlert(false);
    setErr("");
  }

  const printName = (): JSX.Element => {
    if (currentChan.type === "direct") {
      if (user.auth_id === currentChan.chanUser[0].auth_id) {
        return (
          <h3>{currentChan.chanUser[1].username}</h3>
        )
      }
      else {
        return (
          <h3>{currentChan.chanUser[0].username}</h3>
        )
      }
    }
    return (
      <h3>{currentChan.name}</h3>
    )
  };

  if (room && room != "null") {
    return (
      <div className="inChat row col-10">
        <div className="d-flex justify-content-start p-0">
          {printName()}
        </div>
        <div className="chatMain col-10">
          <PrintHeaderChan
            chanList={chanList}
            usersInChan={usersInChan}
            room={room}
            socket={socket}
            user={user}
            parentCallBack={{ setModalType, setModalTitle }} />
          <div className="row">
            <div>
              <PrintMessages
                user={user}
                currentChan={currentChan}
                chanList={chanList}
                parentCallBack={{ setChanList }} />
              <div className="row">
                <div>
                  <input
                    id="message"
                    ref={msgInput}
                    className="col-10"
                    type="text"
                    placeholder="type your message"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={pressEnter}
                  />
                  <button className="col-1" onClick={onSubmit}>Send</button>
                </div>
                <div>
                  {alert ?
                    <Alert
                      onClose={closeAlert}
                      variant="danger"
                      dismissible>{err}</Alert> :
                    <div />
                  }
                </div>
              </div>
            </div>
          </div>
        </div> {/*fin chatMain*/}
        <div className="chatMembers col-2 p-0">
          <p> Channel's members ({usersInChan.length}) </p>
          <UsersInActualchannel usersList={usersInChan} />
        </div>
      </div>
    )
  } else {
    return (
      <div>
      </div>
    )
  }
}
export default PrintChannel;
