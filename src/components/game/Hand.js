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

  // TODO maybe add this for claimToken logic. Think too much

  canDrawCard() {
    return [MoveState.CARD_DRAWN, MoveState.DISCARD_CHOSEN, MoveState.CARD_DISCARDED, MoveState.SWAP_CHOSEN, MoveState.SWAP_IN_PROGRESS,  MoveState.CLAIMING_TOKEN].includes(this.props.moveState)  &&
      this.props.id === this.props.gameService.getActivePlayerIndex();

  }

  render = () => {
    return (
      <div className="PlayerHand" data-testid="hand">
        <div role="header" className="PlayerHeader" name="Player1">
          <p className="playerTag">Player {this.props.id+1}</p>
        </div>
        <div className="PlayerTokenHeader">
          <p className="playerTag">Tokens</p>
        </div>
        {this.deck.map((card, index) => (
          <div className={classNames('PlayerCard', {"PlayerCardIsActive" : this.canDrawCard()})} role='playerCard' key={index} onClick={() => this.props.cardPressedCallback(this.props.id, index)}>
            {card.seen ? card.value : '?'}
          </div>
        ))}
        <div className='PlayerTokens'>
        {this.tokens.map((token, index) => (
          <div className='PlayerToken' role='playerToken' key={index}>
            {token}
          </div>
        ))}
        </div>
      </div>
  )}
}

export default Hand;
