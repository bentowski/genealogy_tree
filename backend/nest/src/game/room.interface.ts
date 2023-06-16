import { UserEntity } from '../user/entities/user-entity';

export interface Position {
  x: number,
  y: number
}

interface Ball {
  position: Position,
  velocity: Position
}

export enum State {
  WAITING,
  STARTING,
  COUNTDOWN,
  INGAME,
  END
}

export interface Config {
  ballPos: [number, number],
  player1: [number, number],
  player2: [number, number],
  sizeBall:  number,
  speed: number,
  playerSize: number,
  playerSpeed: number,
  middle: number,
  vector: [number, number],
  p1Score: number,
  p2Score: number,
  baseSpeed: number
}

export interface Room {
  code: number,
  state: State,
  mode: number,
  players: [number, number],
  spectators: Array<number>,
  config: Config,
}
