import {createContext} from 'react';
import io, { Socket } from 'socket.io-client';

export const socket = io('http://82.165.70.203:3000/chat');
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
