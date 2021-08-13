import React, { Component } from 'react';
import './FooterSection.css';
const {MoveState} = require('../../model/Enums.js')
const { getPlayerTextForMoveState} = require('../../Utils.js')

class Hand extends Component {
  constructor(props) {
    super(props);
    this.gameService = props.gameService;
    this.TableCanvas = React.createRef();
    this.render.bind(this);
  }

  ShowCardActions = () => {
    return [MoveState.CARD_DRAWN, MoveState.DISCARD_CHOSEN, MoveState.CARD_DISCARDED, MoveState.SWAP_CHOSEN, MoveState.SWAP_IN_PROGRESS].includes(this.props.moveState)
  }

  ShowTurnUpAction = () => {
    return !this.gameService.activePlayerHasAllCardsFaceUp();
  }

  ShowEndActions = () => {
    return this.props.moveState === MoveState.PRE_END_STATE;
  }

  ShowToken = token => {
    return this.gameService.canClaimToken(token);
  }

  render = () => {
    return (
      <div className="CardTableFooter" data-testid="footer-section">
        <div className="FullWidth" role='header'>
          {getPlayerTextForMoveState(this.props.moveState, this.gameService.getSwapCardIndex() + 1)}
        </div>
        {this.ShowCardActions() &&
          <React.Fragment>
              {(!!this.gameService.getActiveCard() && !!this.gameService.getActiveCard().value) &&
              <React.Fragment>
                <div className="PlayerCard" role="activeCard">
                  {this.gameService.getActiveCard().value}
                </div>
                <div>
                  {this.ShowTurnUpAction() && <button data-testid='turn-face-up-button' onClick={() => {this.props.buttonPressedCallback('turnFaceUp')}}> Discard to turn two face up </button>}
                  <button onClick={() => {this.props.buttonPressedCallback('swap')}}> Discard to swap two </button>
                </div>
            </React.Fragment>}
            <div className="FullWidth"><button className="mb-2 FullWidth" onClick={() => {this.props.buttonPressedCallback('pass')}}> Pass </button></div>

          </React.Fragment>}

          {this.ShowEndActions() &&
            <React.Fragment>
                {this.ShowToken('THREE_IN_A_ROW') && <div><button onClick={() => this.props.buttonPressedCallback('claimToken', 'THREE_IN_A_ROW')}> THREE IN A ROW </button></div>}
                {this.ShowToken('FOUR_IN_A_ROW') && <div><button onClick={() => this.props.buttonPressedCallback('claimToken', 'FOUR_IN_A_ROW')}> FOUR IN A ROW </button></div>}
                {this.ShowToken('FIVE_IN_A_ROW') && <div><button onClick={() => this.props.buttonPressedCallback('claimToken', 'FIVE_IN_A_ROW')}> FIVE IN A ROW </button></div>}
                {this.ShowToken('THREE_OF_A_KIND') && <div><button onClick={() => this.props.buttonPressedCallback('claimToken', 'THREE_OF_A_KIND')}> THREE OF A KIND </button></div>}
                {this.ShowToken('FULL_HOUSE') && <div><button onClick={() => this.props.buttonPressedCallback('claimToken', 'FULL_HOUSE')}> FULL HOUSE </button></div>}
                <div className="FullWidth"><button className="mb-2 FullWidth" onClick={() => {this.props.buttonPressedCallback('changeTurn')}}> Pass </button></div>
            </React.Fragment>}
      </div>
  )}
}

export default Hand;