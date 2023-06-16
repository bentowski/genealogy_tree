import React, { Component } from 'react';
import ModalMatch from "./utils/ModalMatch";
import SearchBar from './utils/SearchBar'
import Request from "./utils/Requests"
import { ErrorType, PartiesType } from "../types";
import { AuthContext } from '../contexts/AuthProviderContext';
import '../styles/components/matchnav.css';

class MatchNav extends Component<{}, {}> {
	static contextType = AuthContext;
	state = {
		allGames: [],
		val: '',
	}

	/*
	callBackValueFunction = (childData: string) => {
		this.setState({ val: childData })
	}
	 */

	callBackFunction = (childData: any): void => {
		this.setState({ allGames: childData })
	}

	/*
	async reqUrl(request: string, url: string) {
		return await fetch(url, {
			method: request,
		}).then(response => response.json())
	}
	 */

	randomMatchmaking = async (): Promise<void> => {
		const ctx: any = this.context;
		let games: PartiesType[] = [];
		try {
			games = await Request(
				'GET',
				{},
				{},
				"http://82.165.70.203:3000/parties"
			)
		} catch (error) {
			ctx.setError(error);
		}
		const availableGames: PartiesType[] = games.filter((game: PartiesType) => {
			if (game.p1 === null || game.p2 === null)
				return true;
			return false;
		})
		if (availableGames.length === 0) {
			// alert("No available game joinable")
			const error: ErrorType = {
				statusCode: 400,
				message: "Error while trying to join game: No available game joinable"
			}
			ctx.setError(error);
			return;
		}
		const randomGame: PartiesType = availableGames[(Math.floor(Math.random() * availableGames.length))];
		if (randomGame.type == 1)
			window.location.href = "http://cousinade-baudry.fr/game/" + randomGame.id
		else
			window.location.href = "http://cousinade-baudry.fr/gameup/" + randomGame.id
	}

	prompt = (): void => {
		const modal: HTMLElement | null = document.getElementById("ModalMatch") as HTMLDivElement;
		modal.classList.remove('hidden');
	}

	renderGames = (login: string, key: number, id: number, p1: string, p2: string, nbplayer: number, type: number): JSX.Element => {
		let count: number = 0;
		if (p1 !== null)
			count++;
		if (p2 !== null)
			count++;
		//console.log("AAAAAAAAAAAAAAAAAxtype", type)
		if (type === 1)
		{
			return (
				<div key={key} className="gamesDiv text-nowrap d-flex justify-content-between">
					<div>
						<button className="" onClick={() => window.location.href = "http://cousinade-baudry.fr/game/" + id}>{(count === nbplayer) ? "Spec" : "Join"}</button>
					</div>
					<div style={{ verticalAlign: "top" }}>
						<p className="py-2">{login}</p>
					</div>
					<div>
						<p className="py-2">{count}/{nbplayer}</p>
					</div>
				</div>
			)
		}
		else
		{
			return (
				<div key={key} className="gamesDiv text-nowrap d-flex justify-content-between">
					<div>
						<button className="" onClick={() => window.location.href = "http://cousinade-baudry.fr/gameup/" + id}>{(count === nbplayer) ? "Spec" : "Join"}</button>
					</div>
					<div style={{ verticalAlign: "top" }}>
						<p className="py-2">{login}</p>
					</div>
					<div>
						<p className="py-2">{count}/{nbplayer}</p>
					</div>
				</div>
			)
		}

	}
	renderItem = (): JSX.Element[] => {
		let x: number = 0;
		const item: JSX.Element[] = [];
		const games: PartiesType[] = this.state.allGames;
		while (x < this.state.allGames.length) {
			item.push(this.renderGames(games[x].login, x, games[x].id, games[x].p1, games[x].p2, games[x].nbplayer, games[x].type))
			x++;
		}
		return (item)
	}

	render(): JSX.Element {
		return (
			<div className="MatchNav" id="MatchNav">
				<div className="d-none d-lg-block w-100">
					<img className="bob w-50" src="/pictures/bob.png" alt="bob" />
				</div>
				<div className="Wait m-2 p-2">
					<p>{this.state.allGames.length} games found</p>
				</div> {/* Wait */}
				<ModalMatch title="Create new game" calledBy="newGame" />
				<div className="fastAccess">
					<button className="" onClick={this.randomMatchmaking}>Random matching</button>
					<button className="" onClick={this.prompt}>Create</button>
					<div className="m-2 p-2">
						<SearchBar inputSelector={"MatchNav"} routeForRequest={"parties/"} parentCallBack={this.callBackFunction} />
					</div>
				</div>
				<div className="List">
					{this.renderItem()}
					{/* <OpenGames allGames={this.state.allGames} /> */}
				</div> {/* List */}
			</div>
		); // fin de return
	} // fin de render
} // fin de App

export default MatchNav;
