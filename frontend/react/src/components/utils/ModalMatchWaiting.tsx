import { Component } from 'react';
import "../../styles/components/utils/modal.css";
import { io } from 'socket.io-client';
import { AuthContext } from '../../contexts/AuthProviderContext';
import {UserType} from "../../types";
//import { socket } from '../../contexts/WebSocketContextUpdate';

const socket = io("http://82.165.70.203:3000/update");

class ModalMatchWaiting extends Component<{ title: string, calledBy: string, hidden?: boolean, user?: any, countdown?: number}, {}> {

  static contextType = AuthContext;
  constructor(props: any) {
	super(props)
  	this.state = {
		countdown: 5,
  	}
  }
  hidden = (): void => {
    const modal: HTMLElement | null = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
    modal.classList.add('hidden')
      socket.emit("askForGamedown", {"to": this.props.user.auth_id, "from": this.getCurrentUser().auth_id})
  }

  getCurrentUser = (): UserType => {
    const ctx: any = this.context;
    return ctx.user;
  };

  display = (): JSX.Element => {
	if (this.props.countdown !== undefined) {
		return (
			<h2>Game start in {this.props.countdown}</h2>
		)
	}
	else
		return (
		<h2>Waiting for { this.props.user !== undefined ? this.props.user.username : "opponent"}</h2>
		)
  }

  render(): JSX.Element {
    return (
      <div className={this.props.hidden ? "Modal hidden" : "Modal"} id='ModalMatchWaiting'>
        <div className='p-4 pb-1'>
          <header className='mb-3'>
            {this.display()}
            <div className=''></div>
          </header>
          <footer>
            <button onClick={this.hidden}>cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatchWaiting;
