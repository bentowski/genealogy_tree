import { Component, createRef } from 'react';
import { useNavigate } from "react-router-dom";
import { socket, WebsocketProvider, WebsocketContext } from '../contexts/WebSocketContextGame';
import Request from "../components/utils/Requests"
import '../styles/pages/game.css'
import ModalMatchWaiting from '../components/utils/ModalMatchWaiting';
import { io } from 'socket.io-client';
import { UserType } from "../types"
import { AuthContext } from '../contexts/AuthProviderContext';
const updateSocket = io("http://82.165.70.203:3000/update");

let score1 = new Image();
let score2 = new Image();
let globalCtx: any = undefined;
let ball = new Image();
let p1 = new Image();
let p2 = new Image();
let bubble = new Image();

let gameOver = () => {
  socket.off('userJoinChannel')
  socket.off('Init')
  socket.off('Start')
  socket.off('ballMoved')
  socket.off('userJoinChannel')
  socket.off('players')
  socket.off('onEndGame')
  updateSocket.emit('updateUser', {auth_id: settings.currentUser, status: 1})
	window.location.href = "http://cousinade-baudry.fr/history"
}

let joinRoom = async () => {
  const games = await Request('GET', {}, {}, "http://82.165.70.203:3000/parties")
  let url = document.URL
  let index = url.lastIndexOf("/")
  if (index === -1) {
    window.location.href = "http://cousinade-baudry.fr/history"
  }
  else {
    url = url.substring(index + 1)
    let game: any = games.find((c:any) => c.id === url)
    if (game === undefined) {
      window.location.href = "http://cousinade-baudry.fr/history"
    }
    else
			socket.emit('joinRoom', {"game":game, "auth_id": settings.currentUser})
  }
}

const printGame = (ctx: any) => {
	let y = 0;
  if (settings.spec === false) {
    let move = 0;
    if (settings.up == 1)  {
      movePlayer(ctx, -1, settings)
      move += 1;
    }
    if (settings.down == 1) {
      movePlayer(ctx, 1, settings)
      move += 1;
    }
    if (move === 1) {
      socket.emit('barMove', {"ratio": (settings.player1[1] / settings.h), "player": settings.currentUser, "room": settings.room})
    }
  }
  // const element = document.getElementById('canvas') as HTMLDivElement;
  ctx.clearRect(0, 0, 400000, 400000)
  // ctx.clearRect(0, 0, element.clientWidth, element.clientHeight)
  while (y < settings.h) {
      ctx.drawImage(bubble, settings.middle - settings.sizeBall / 2, y - settings.sizeBall / 2, settings.sizeBall, settings.sizeBall * 2)
      y += settings.sizeBall * 2
  }
  ctx.drawImage(p2, settings.player2[0] + (settings.sizeBall * 0.5), settings.player2[1], settings.sizeBall, settings.playerSize)
  ctx.drawImage(p1, settings.player1[0] - (settings.sizeBall * 0.5), settings.player1[1], settings.sizeBall, settings.playerSize)
  ctx.drawImage(ball, settings.ballPos[0], settings.ballPos[1], settings.sizeBall, settings.sizeBall)
  ctx.drawImage(score1, (settings.w / 8) * 5, 0, settings.sizeBall * 6, settings.sizeBall * 6)
  ctx.drawImage(score2, ((settings.w / 8) * 3) - (settings.sizeBall * 6), 0, settings.sizeBall * 6, settings.sizeBall * 6)
  socket.emit("pleaseBall", settings.room)
	window.requestAnimationFrame(() => {
		printGame(ctx)
	})
}

let movePlayer = (ctx: any, move: number, settings: any) => {
    let newPos = settings.player1[1] + (move * settings.playerSpeed)
    if (newPos > 0 && newPos < settings.h - settings.playerSize)
      settings.player1 = [settings.player1[0], newPos]
}

const start = (ctx: any) => {
	socket.off('Start')
	socket.on('ballMoved', (room) => {
	    if (room.code === settings.room)
			{
        if (room.players[1] === settings.currentUser)
        {
          let relative = -(room.config.ballPos[0] - 50)
          settings.ballPos[0] = (relative + 50) * settings.w / 100;
        }
        else
          settings.ballPos[0] = room.config.ballPos[0] * settings.w / 100;
        settings.ballPos[1] = room.config.ballPos[1] * settings.h / 100;
			}
	  })
		socket.on('players', (body) => {
	    if (body.room.code !== settings.room)
	      return ;
		 if (body.player !== settings.currentUser) {
      if (settings.spec && body.admin)
        settings.player1 = [settings.player1[0], body.ratio * settings.h]
      else
        settings.player2 = [settings.player2[0], body.ratio * settings.h]
     }
		})
    socket.on('newPoint', (room) => {
      switch (room.config.p1Score)
      {
        case 0: score1.src = "http://cousinade-baudry.fr/icons/bob0.png"
          break;
        case 1: score1.src = "http://cousinade-baudry.fr/icons/bob1.png"
          break;
        case 2: score1.src = "http://cousinade-baudry.fr/icons/bob2.png"
          break;
        case 3: score1.src = "http://cousinade-baudry.fr/icons/bob3.png"
          break;
        case 4: score1.src = "http://cousinade-baudry.fr/icons/bob4.png"
          break;
        case 5: score1.src = "http://cousinade-baudry.fr/icons/bob5.png"
          break;
        case 6: score1.src = "http://cousinade-baudry.fr/icons/bob6.png"
          break;
        case 7: score1.src = "http://cousinade-baudry.fr/icons/bob7.png"
          break;
        case 8: score1.src = "http://cousinade-baudry.fr/icons/bob8.png"
          break;
        case 9: score1.src = "http://cousinade-baudry.fr/icons/bob9.png"
          break;
        case 10: score1.src = "http://cousinade-baudry.fr/icons/bob10.png"
          break;
      }
      switch (room.config.p2Score)
      {
        case 0: score2.src = "http://cousinade-baudry.fr/icons/bob0.png"
          break;
        case 1: score2.src = "http://cousinade-baudry.fr/icons/bob1.png"
          break;
        case 2: score2.src = "http://cousinade-baudry.fr/icons/bob2.png"
          break;
        case 3: score2.src = "http://cousinade-baudry.fr/icons/bob3.png"
          break;
        case 4: score2.src = "http://cousinade-baudry.fr/icons/bob4.png"
          break;
        case 5: score2.src = "http://cousinade-baudry.fr/icons/bob5.png"
          break;
        case 6: score2.src = "http://cousinade-baudry.fr/icons/bob6.png"
          break;
        case 7: score2.src = "http://cousinade-baudry.fr/icons/bob7.png"
          break;
        case 8: score2.src = "http://cousinade-baudry.fr/icons/bob8.png"
          break;
        case 9: score2.src = "http://cousinade-baudry.fr/icons/bob9.png"
          break;
        case 10: score2.src = "http://cousinade-baudry.fr/icons/bob10.png"
          break;
      }
    })
	  socket.on('gameoverSend', (room) => {
	    if (room.code === settings.room)
	      gameOver();
	  })
}

let settings = {
  w: 0,
  h: 0,
	currentUser: 0,
	room: '',
  spec: true,
  up: 0,
  down: 0,
  p1: {},
  p2: {},
	ballPos: [0, 0],
	player1: [0, 0],
	player2: [0, 0],
  sizeBall: 0,
	playerSize: 0,
  playerSpeed: 0,
  middle: 0
}

const initSettings = (serv: any) => {
  score1.src = "http://cousinade-baudry.fr/icons/bob0.png"
  score2.src = "http://cousinade-baudry.fr/icons/bob0.png"
  settings = {
    w: settings.w,
    h: settings.h,
    currentUser: settings.currentUser,
    room: settings.room,
    spec: settings.spec,
    up: settings.up,
    down: settings.down,
    p1: serv.p1,
    p2: serv.p2,
    ballPos: [serv.ballPos[0] * settings.w / 100, serv.ballPos[1] * settings.h / 100],
    player1: [serv.player1[0] * settings.w / 100, serv.player1[1] * settings.h / 100],
    player2: [serv.player2[0] * settings.w / 100, serv.player2[1] * settings.h / 100],
    sizeBall: serv.sizeBall * settings.h / 100,
    playerSize: serv.playerSize * settings.h / 100,
    playerSpeed: serv.playerSize,
    middle: serv.middle * settings.w / 100
  }
}

// Change type to SettingType
const init = (servSettings: any, ctx: any) => {
  p1.src = "http://cousinade-baudry.fr/pictures/barre2.png";
  p2.src = "http://cousinade-baudry.fr/pictures/barre1.png";
  ball.src = "http://cousinade-baudry.fr/pictures/ball.png";
  bubble.src = "http://cousinade-baudry.fr/pictures/bubble2.png";
	socket.off('Init')
  initSettings(servSettings)
	const globale = document.getElementById('globale') as HTMLCanvasElement
  globalCtx = ctx;
  printGame(ctx)
	socket.on('Start', (body) => {
    if ((body.room.players[0] && body.room.players[0] === settings.currentUser)
      || (body.room.players[1] && body.room.players[1] === settings.currentUser)
      || !body.room.players[0] || (!body.room.players[1] && body.room.mode != 1))
        settings.spec = false
    if (body.room.code == settings.room)
      start(ctx)
	})
  let infosClavier = (e: KeyboardEvent) => {
    let number = Number(e.keyCode);
      switch (number) {
        case 38:
          settings.up = 1;
          break;
        case 40:
          settings.down = 1;
          break;
        default:
    }
  }
  let infosClavier2 = (e: KeyboardEvent) => {
    let number = Number(e.keyCode);
      switch (number) {
        case 38:
          settings.up = 0;
          break;
        case 40:
          settings.down = 0;
          break;
        default:
    }
  }
  document.addEventListener("keydown", infosClavier);
  document.addEventListener("keyup", infosClavier2);
}

const justwait = (ctx: any) => {
	socket.on('Init', (body) => {
		socket.off('userJoinChannel')
		let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
		modal.classList.add("hidden")
		if (body.room.id === settings.room)
			init(body.settings, ctx);
	})
}

const changeSize = () => {
  let element = document.body as HTMLDivElement;
  globalCtx.clearRect(0, 0, globalCtx.width, globalCtx.height)
  let winWidth = element.clientWidth;
  let winHeight = element.clientHeight;
  if ((winWidth * 19) / 26 > winHeight)
    winWidth = ((winHeight * 26) / 19)
  else
    winHeight = ((winWidth * 19) / 26)
  settings.w = winWidth
  settings.h = winHeight
  socket.emit('plzstats', {"room": settings.room})
  socket.on('stats', (serv) => {
    settings = {
      w: settings.w,
      h: settings.h,
      currentUser: settings.currentUser,
      room: settings.room,
      spec: settings.spec,
      up: settings.up,
      down: settings.down,
      p1: settings.p1,
      p2: settings.p2,
      ballPos: [serv.ballPos[0] * settings.w / 100, serv.ballPos[1] * settings.h / 100],
      player1: [serv.player1[0] * settings.w / 100, serv.player1[1] * settings.h / 100],
      player2: [serv.player2[0] * settings.w / 100, serv.player2[1] * settings.h / 100],
      sizeBall: serv.sizeBall * settings.h / 100,
      playerSize: serv.playerSize * settings.h / 100,
      playerSpeed: serv.playerSize,
      middle: serv.middle * settings.w / 100
    }
  })
  socket.off('stats');
}

class Game extends Component<{},{}> {

	static contextType = AuthContext;
	private globale: any = createRef()

  componentWillUnmount = () => {
		socket.off('userJoinChannel')
		socket.off('Init')
		socket.off('Start')
		socket.off('ballMoved')
		socket.off('userJoinChannel')
		socket.off('players')
		socket.off('onEndGame')
    updateSocket.emit('updateUser', {auth_id: settings.currentUser, status: 1})
  }

  componentDidMount = () => {
		const ctxReact: any = this.context;
    const globale = document.getElementById('globale') as HTMLCanvasElement
    const globalCtx: any = globale.getContext('2d')
    let element = document.body as HTMLDivElement;
    let winWidth = element.clientWidth;
    let winHeight = element.clientHeight;
    if ((winWidth * 19) / 26 > winHeight)
      winWidth = ((winHeight * 26) / 19)
    else
      winHeight = (winWidth / 26) * 19
      //(winHeight)
    settings.w = winWidth
    settings.h = winHeight
	  settings.currentUser = ctxReact.user.auth_id;
    let url = document.URL
  	url = url.substring(url.lastIndexOf("/") + 1)
    settings.room = url
		joinRoom()
		socket.on('userJoinChannel', () => {
			socket.off('Init')
			justwait(globalCtx);
		})
		socket.on('Init', (body) => {
			socket.off('userJoinChannel')
			let modal = document.getElementById("ModalMatchWaiting") as HTMLDivElement;
			modal.classList.add("hidden")
			if (body.room.id === settings.room)
        init(body.settings, globalCtx);
		})
  }

  render() {
    window.onresize = () => {changeSize()}
    return (
      <div>
        <div className="canvas" id="canvas" style={{maxHeight: settings.h}}>
        <canvas ref={this.globale} id="globale" width={settings.w} height={settings.h} className="global-bg"></canvas>
          <ModalMatchWaiting title="In wait for player" calledBy="newGame" />
        </div>
      </div>
    );
  }
}

export default Game;
