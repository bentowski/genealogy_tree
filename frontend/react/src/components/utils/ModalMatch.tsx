import { Component } from 'react';
import Request from "./Requests"
import "../../styles/components/utils/modal.css";
import io from 'socket.io-client';
import { AuthContext } from '../../contexts/AuthProviderContext';
import { PartiesType } from "../../types";
//import { socket } from '../../contexts/WebSocketContextUpdate';

const socket = io("http://82.165.70.203:3000/update");

class ModalMatch extends Component<{ title: string, calledBy: string }, {}> {

  static contextType = AuthContext;

  hidden = (): void => {
    const modal: HTMLElement | null = document.getElementById("ModalMatch") as HTMLDivElement;
    modal.classList.add('hidden')
  }

  createParties = async (isClassic: number): Promise<void> => {
    const ctx: any = this.context;
    const currentUser: any = ctx.user;
    const radio = document.getElementById('Game2') as HTMLInputElement
    let nbplayer: number = 1;
    if (radio.checked)
      nbplayer = 2;
    const radioSpeed = document.getElementById('Speed2') as HTMLInputElement
    let vitesse: number = 1;
    if (radioSpeed.checked)
      vitesse = 2;
    try {
      await Request(
        "POST",
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        {
          login: currentUser.username,
          nbplayer: nbplayer,
          type: isClassic,
          vitesse: vitesse
        },
        "http://82.165.70.203:3000/parties/create"
      );
      socket.emit('newParty');
      const parties: PartiesType[] = await Request(
          'GET',
          {},
          {},
          "http://82.165.70.203:3000/parties/"
      )
      const ids: number[] = parties.map((p: any) => {
        return p.id;
      })
      this.hidden()
      if (isClassic)
        window.location.href = "http://cousinade-baudry.fr/game/" + Math.max(...ids)//currentUser.user.username
      else
        window.location.href = "http://cousinade-baudry.fr/gameup/" + Math.max(...ids)//currentUser.user.username
      } catch (error) {
       const ctx: any = this.context;
       ctx.setError(error);
    }
  }


  render(): JSX.Element {
    return (
      <div className='Modal hidden' id='ModalMatch'>
        <div className='p-4 pb-1'>
          <header className='mb-3'>
            <h2>{this.props.title}</h2>
          </header>
          <form className='mb-3'>
            <p>
              <input type="radio" name="playerNum" value="1" id="Game1" defaultChecked/>1 player<br />
              <input type="radio" name="playerNum" value="2" id="Game2" />2 players
            </p>
          </form>
          <form className='mb-3'>
            <p>Difficulty</p>
            <p>
              <input type="radio" name="playerNum" value="1" id="Speed1" defaultChecked/>normal<br />
              <input type="radio" name="playerNum" value="2" id="Speed2" />hard
            </p>
          </form>
          <footer>
            <button className='mx-1' onClick={this.hidden}>Cancel</button>
            <button className='mx-1' onClick={() => this.createParties(0)}>Create</button>
            <button className='mx-1' onClick={() => this.createParties(1)}>Create classic</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default ModalMatch;
