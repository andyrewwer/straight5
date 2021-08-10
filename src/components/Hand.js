import React, { Component } from 'react';
import './Hand.css';


class Hand extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
    this.deck = this.props.playerService.getPlayers()[this.props.id].getDeck();
    this.tokens = this.props.playerService.getPlayers()[this.props.id].getTokens();
  }

  render = () => {
    return (
      <div className="PlayerHand">
        <div role="header" className="PlayerHeader" name="Player1">
          Player {this.props.id+1}
        </div>
        <div className="PlayerTokenHeader">
          Tokens
        </div>
        {this.deck.map((card, index) => (
          <div className='PlayerCard' role='playerCard' key={index} onClick={() => this.props.cardPressedCallback(this.props.id, index)}>
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
