import { Component } from 'react';
import '../../styles/components/utils/historyCards.css'
import {HistoryType, UserType} from "../../types";
import { Link } from "react-router-dom";

class HistoryCards extends Component<{
    history: HistoryType,
    profil: UserType | undefined }, {}> {

    renderStatus = (user: boolean): JSX.Element => {
    if (!user) {
      if (this.props.history.score_one > this.props.history.score_two)
        return (
          <div className='Winner'>winner</div>
        );
      else if (this.props.history.score_one < this.props.history.score_two)
        return (
          <div className='Looser'>looser</div>
        );
    }
    else {
      if (this.props.history.score_one < this.props.history.score_two)
        return (
          <div className='Winner'>winner</div>
        );
      else if (this.props.history.score_one > this.props.history.score_two)
        return (
          <div className='Looser'>looser</div>
        );
    }
    return (
      <div></div>
    );
  }

  renderHistoryCards = (): JSX.Element => {
    const status_one: JSX.Element = this.renderStatus(false);
    const status_two: JSX.Element = this.renderStatus(true);
    if (this.props.profil) {
      if (this.props.profil.auth_id === this.props.history.user_one_id)
        return (
          <div className='historyDiv m-0 my-2 d-flex flex-row justify-content-between align-items-center'>
            <div className='col-4 d-flex flex-row justify-content-start'>{status_one}</div>
            <div className='col-4 d-flex flex-row justify-content-center'>
              <div className='col-5 d-flex flex-row justify-content-end'>{this.props.history.score_one}</div>
              <div className='col-2 d-flex flex-row justify-content-center'> | </div>
              <div className='col-5 d-flex flex-row justify-content-start'>{this.props.history.score_two}</div>
            </div>
            <div className='col-4 d-flex flex-row justify-content-end align-items-center'>
              <Link to={"/profil/" + this.props.history.user_two_name} className='mx-2' >{this.props.history.user_two_name}</Link>
              <img src={"http://82.165.70.203:3000/user/" + this.props.history.user_two_id + "/avatar"} alt="" className='miniAvatar' />
            </div>
          </div>
        )
      else {
        return (
          <div className='historyDiv m-0 my-2 d-flex flex-row justify-content-between align-items-center'>
            <div className='col-4 d-flex flex-row justify-content-start'>{status_two}</div>
            <div className='col-4 d-flex flex-row justify-content-center'>
              <div className='col-5 d-flex flex-row justify-content-end'>{this.props.history.score_two}</div>
              <div className='col-2 d-flex flex-row justify-content-center'> | </div>
              <div className='col-5 d-flex flex-row justify-content-start'>{this.props.history.score_one}</div>
            </div>
            <div className='col-4 d-flex flex-row justify-content-end align-items-center'>
              <Link className='mx-2' to={"/profil/" + this.props.history.user_one_name}>{this.props.history.user_one_name}</Link>
              <img src={"http://82.165.70.203:3000/user/" + this.props.history.user_two_id + "/avatar"} alt="" className='miniAvatar' />
            </div>
          </div>
        )
      }
    }
    else {
      return (
        <div className='historyDiv m-0 my-2 d-flex flex-row justify-content-between align-items-center'>
          <div className='col-2 d-flex flex-row'>
            <img src={"http://82.165.70.203:3000/user/" + this.props.history.user_one_id + "/avatar"} alt="" className='miniAvatar' />
            <Link className='mx-2' to={"/profil/" + this.props.history.user_one_id}>{this.props.history.user_one_name}</Link>
          </div>
          <div className='col-2 d-flex flex-row justify-content-center'>{status_one}</div>
          <div className='col-4 d-flex flex-row justify-content-center'>
            <div className='col-5 d-flex flex-row justify-content-end'>{this.props.history.score_one}</div>
            <div className='col-2 d-flex flex-row justify-content-center'> | </div>
            <div className='col-5 d-flex flex-row justify-content-start'>{this.props.history.score_two}</div>
          </div>
          <div className='col-2 d-flex flex-row justify-content-center'>{status_two}</div>
          <div className='col-2 d-flex flex-row justify-content-end align-items-center'>
            <Link className='mx-2' to={"/profil/" + this.props.history.user_two_name}>{this.props.history.user_two_name}</Link>
            <img src={"http://82.165.70.203:3000/user/" + this.props.history.user_two_id + "/avatar"} alt="" className='miniAvatar' />
          </div>
        </div>
      )
    }
  }

  render(): JSX.Element {
    let items: JSX.Element = this.renderHistoryCards();
    return (
      <div>
        {items}
      </div>
    );
  }
}

export default HistoryCards;
