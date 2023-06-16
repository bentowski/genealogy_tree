import { Component, useEffect, useState } from "react";
import { socket } from '../../contexts/WebSocketContext';
import { MessagePayload, ChanType, UserType } from "../../types"
import Request from "../utils/Requests"

class DispatchMsg extends Component<{user: UserType, messages: any}, {userList: UserType[]}> {
	constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            userList: [],
        }
    }

	// componentDidUpdate(): void {

    //     const ctx: any = this.context;
	// 	console.log(ctx.userList)
    //     // this.setState({userList: ctx.adminList})
    // }

	// updateUsers = async () => {
	// 	let users:UserType = await Request("GET", {}, {}, "http://82.165.70.203:3000/user")
	// 	this.setState({userList: users})
	// }

	componentDidMount = async () => {
        const ctx: any = this.context;
		this.setState({userList: ctx.userList})
    }

	takeUsername = (msg: MessagePayload) => {
    let user:UserType | undefined = undefined;
    if (this.state.userList)
		  user = (this.state.userList.find((user:UserType) => user.auth_id === msg.auth_id))
		if (user !== undefined)
			return user.username
		return msg.username
	}

  render(): JSX.Element[] {
    const ret: JSX.Element[] = []
    if (!this.props.messages)
      return ret;
    this.props.messages.forEach((msg: MessagePayload, index: number) => {
		  if (msg.username === undefined)
			  msg = JSON.parse(String(msg))
      if (msg.sender_socket_id === this.props.user.auth_id)
        ret.push(
            <div key={index} className="outgoing_msg break-text">
              <div className="sent_msg">
                <p>{msg.content}</p>
              </div>
            </div>
        )
      else
        ret.push(
            <div key={index} className="incoming_msg break-text">
              <div className="incoming_msg_img align-bottom"> <img src={"http://82.165.70.203:3000/user/" + msg.auth_id + "/avatar"} alt="ImageNotFound" /> </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <div className="received_withd_msg"><span className="time_date">{this.takeUsername(msg)}</span></div>
                  <p>{msg.content}</p>
                </div>
              </div>
            </div>
        )
    })
    return ret
  }
}

  export const PrintMessages = ({
                                  user,
                                  currentChan,
                                  chanList,
                                  parentCallBack}: {
    user: UserType,
    currentChan: ChanType,
    chanList: ChanType[],
    parentCallBack: any
  }): JSX.Element => {
    const [messages, setMessage] = useState<MessagePayload[]>([]);

      useEffect((): () => void => {
        socket.on('onMessage', (newMessage: MessagePayload) => {
          const channels: Array<ChanType> = chanList;
          const index: number =
              chanList.findIndex((c: ChanType) => c.id === newMessage.room);
          if (channels[index] !== undefined) {
            if (channels[index].messages)
              channels[index].messages =
                  [...channels[index].messages, newMessage];
            else
              channels[index].messages = [newMessage];
            if (channels[index].isActive) {
              if (channels[index].messages)
                setMessage(channels[index].messages);
              else
                setMessage([])
            }
            parentCallBack.setChanList(channels);
          }
        });
        return () => {
          socket.off('onMessage');
        }
      });

      useEffect((): void => {
        if (currentChan && currentChan.messages) {
          setMessage(currentChan.messages);
        }
        else {
          setMessage([]);
        }
      }, [currentChan]);

      if (messages.length === 0) {
        return (<div>No messages here</div>)
      } else {
        return (
            <div className='messages mt-3' id='messages'>
              <DispatchMsg user={user} messages={messages}/>
            </div>
        )
      }
  }

export default PrintMessages;
