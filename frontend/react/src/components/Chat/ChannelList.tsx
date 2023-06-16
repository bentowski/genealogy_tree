import { Component } from "react";
import { Link } from "react-router-dom";
import { ChanType, UserType } from "../../types"

class ListOfDirectMessages extends Component<{
  chanList: ChanType[],
  user: UserType,
  parentCallBack: any}, {}>{

  render(): JSX.Element[] {
    const ret: JSX.Element[] = [];
    this.props.chanList.forEach((chan: ChanType) => {
          if (chan.type === "direct" && (this.props.user.auth_id === chan.chanUser[0].auth_id || this.props.user.auth_id === chan.chanUser[1].auth_id))
            ret.push(
                <Link key={chan.id} to={"/chat/" + chan.id}>
                  <li
                      onClick={() => this.props.parentCallBack.joinRoom(chan)}
                      className={
                    "d-flex flex-row d-flex justify-content-between align-items-center m-2 list-group-item "
                          + (this.props.parentCallBack.chanColor(chan))}>
                    {this.props.parentCallBack.printName(chan, this.props.user)}
                  </li>
                </Link>
            )
        }
    )
    return ret
  }
}

class ListOfJoinedChans extends Component<{
  chanList: ChanType[],
  user: UserType,
  parentCallBack: any
}, {}> {
  render(): JSX.Element[] {
    const ret: JSX.Element[] = []
    this.props.chanList.forEach((chan: ChanType) => {
          if (chan.type !== "direct" && this.props.parentCallBack.inChan(chan))
            ret.push(
                <Link key={chan.id} to={"/chat/" + chan.id}>
                  <li
                      onClick={() => this.props.parentCallBack.joinRoom(chan)}
                      className={
                    "d-flex flex-row d-flex justify-content-between align-items-center list-group-item overflow-hidden "
                          + (this.props.parentCallBack.chanColor(chan))}>
                    {this.props.parentCallBack.printName(chan, this.props.user)}
                  </li>
                </Link>
            )
        }
    )
    return ret
  }
}
// export const WebSocket
export const ChannelList = (
  {
    chanList,
    room,
    user,
    parentCallBack}:
  {
    chanList: ChanType[],
    room: string,
    user: UserType,
    parentCallBack: any}): JSX.Element => {

  const chansJoined = (chans: Array<ChanType>): number => {
    let count: number = 0;
    for (let x: number = 0; x < chanList.length; x++)
      if (chans[x].chanUser.find((u: UserType) => u.auth_id === user.auth_id))
        count++;
    return count;
  }

  const printName = (chan: ChanType, user: UserType): string => {
    if (chan && chan.type === "direct") {
      if (user.username === chan.chanUser[0].username)
        return chan.chanUser[1].username;
      else
        return chan.chanUser[0].username;
    }
    else
      return chan.name;
  };

  const chanColor = (channel: ChanType, room: string): string => {
    if (channel.isActive)
      return ("bg-primary");
    else
      return ("bg-white")
  }


  const inChan = (chan: ChanType): number => {
    if (chan.chanUser.find((u: UserType) => u.auth_id === user.auth_id))
      return 1
    return 0
  }

  const joinRoom = (chan: ChanType): void => {
    parentCallBack.joinRoom(chan)
  }

    return (
      <div className="channels col-2">
        <button
            // className="btn btn-outline-dark shadow-none"
            className="mb-2"
            onClick={parentCallBack.createChan}>
          Create Channel
        </button>
        <button
            // className="btn btn-outline-dark shadow-none"
            className="mb-2"
            onClick={parentCallBack.joinChan}>
          Join Channel
        </button>
        <div className="channelsList">
          <p>{chansJoined(chanList)} Channels</p>
          <div className="list-group">
            <ul>
              <ListOfJoinedChans
                chanList={chanList}
                user={user}
                parentCallBack={{printName, chanColor, joinRoom, inChan}}
                />
            </ul>
            <ul>
              <ListOfDirectMessages
                chanList={chanList}
                user={user}
                parentCallBack={{printName, chanColor, joinRoom}}
                />
            </ul>
          </div>
          </div>
        </div>
    )
}

export default ChannelList;
