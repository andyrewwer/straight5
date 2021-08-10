import React, { Component } from 'react';
import './FooterSection.css';
const { getPlayerTextForMoveState, canClaimToken} = require('../Utils.js')

class Hand extends Component {
  constructor(props) {
    super(props);
    this.gameService = props.gameService;
    this.TableCanvas = React.createRef();
    this.render.bind(this);
  }

  ShowCardActions = () => {
    return ["CardDrawn", "DiscardChosen", "CardDiscarded", "SwapChosen", "SwapInProgress"].includes(this.props.moveState)
  }

  ShowEndActions = () => {
    return this.props.moveState === "PreEndState";
  }

  ShowToken = token => {
    return canClaimToken(this.gameService.getActivePlayersDeck(), token, this.gameService.getActivePlayersTokens());
  }

  render = () => {
    return (
      <div className="CardTableFooter">
        <div className="FullWidth">
          {getPlayerTextForMoveState(this.props.moveState, this.gameService.getSwapCardIndex() + 1)}
        </div>
        {this.ShowCardActions() &&
          <React.Fragment>
            <div className="FullWidth"><button className="mb-2 FullWidth" onClick={this.props.passTurnButtonPressed}> Pass </button></div>
              {(!!this.gameService.getActiveCard() && !!this.gameService.getActiveCard().value) &&
              <React.Fragment>
                <div className="PlayerCard">
                  {this.gameService.getActiveCard()?.value}
                </div>
                <div>
                  <button onClick={this.props.turnCardsFaceUpButtonPressed}> Discard to turn two face up </button>
                  <button onClick={this.props.swapCardsButtonPressed}> Discard to swap two </button>
                </div>
            </React.Fragment>}
          </React.Fragment>}

          {this.ShowEndActions() &&
            <React.Fragment>
                <div className="FullWidth"><button className="mb-2 FullWidth" onClick={this.props.changeTurn}> Pass </button></div>
                {this.ShowToken('THREE_IN_A_ROW') && <div><button onClick={() => this.props.claimToken('THREE_IN_A_ROW')}> THREE IN A ROW </button></div>}
                {this.ShowToken('FOUR_IN_A_ROW') && <div><button onClick={() => this.props.claimToken('FOUR_IN_A_ROW')}> FOUR IN A ROW </button></div>}
                {this.ShowToken('FIVE_IN_A_ROW') && <div><button onClick={() => this.props.claimToken('FIVE_IN_A_ROW')}> FIVE IN A ROW </button></div>}
                {this.ShowToken('THREE_OF_A_KIND') && <div><button onClick={() => this.props.claimToken('THREE_OF_A_KIND')}> THREE OF A KIND </button></div>}
                {this.ShowToken('FULL_HOUSE') && <div><button onClick={() => this.props.claimToken('FULL_HOUSE')}> FULL HOUSE </button></div>}
            </React.Fragment>}
      </div>
  )}
}

export default Hand;
