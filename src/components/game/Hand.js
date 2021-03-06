import React, { Component } from 'react';
import './Hand.css';
const classNames = require('classnames');
const {MoveState} = require('../../model/Enums.js')

class Hand extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
    this.deck = this.props.playerService.getPlayers()[this.props.id].getDeck();
    this.tokens = this.props.playerService.getPlayers()[this.props.id].getTokens();
  }

   // TODO testing lol!
  cardCanBePressed(card, index) {
    return this.props.id === this.props.gameService.getGameState().getActivePlayerIndex()
     && (
       ([MoveState.TURN_FACE_UP_CHOSEN, MoveState.TURN_FACE_UP_IN_PROGRESS].includes(this.props.moveState) && !card.seen)
           ||
       (MoveState.SWAP_IN_PROGRESS === this.props.moveState && this.props.gameService.getGameState().getSwapCardIndex() !== index)
           ||
       [MoveState.CARD_DRAWN, MoveState.SWAP_CHOSEN,  MoveState.CLAIMING_TOKEN].includes(this.props.moveState));
  }

  render = () => {
    return (
      <div className="PlayerHand" data-testid="hand">
        <div data-testid="player-header" className="PlayerHeader" name="Player1">
          <p className="playerTag">Player {this.props.id+1}</p>
        </div>
        <div className="PlayerTokenHeader">
          <p className="playerTag" data-testid='hand-player-tokens'>Tokens [{this.tokens.length}/{this.props.configService.getNumberOfTokensNeededToWin()}]</p>
        </div>
        {this.deck.map((card, index) => (
          <div className="PlayerCardWrapper" key={index}>
          <div className={classNames('PlayerCard', {'PlayerCardBack': !card.seen}, {'PlayerCardFront': card.seen}, {"PlayerCardIsActive" : this.cardCanBePressed(card, index)})} data-testid='player-card' onClick={() => this.props.cardPressedCallback(this.props.id, index)}>
            {card.seen ? card.value : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z"/></svg> }
          </div>
          </div>
        ))}
        <div className='PlayerTokens'>
        {this.tokens.map((token, index) => (
          <div className='PlayerToken' data-testid='player-token' key={index}>
            {token.viewValue}
          </div>
        ))}
        </div>
      </div>
  )}
}

export default Hand;
