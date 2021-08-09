import React, { Component } from 'react';
import './Hand.css';

class Hand extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
    this.deck = this.props.gameService.getPlayers()[this.props.id];
  }

  render = () => {
    return (
      <div className="PlayerHand">
        <div className="FullWidth">
          Player {this.props.id+1}
        </div>
        {this.deck.map((card, index) => (
          <div className='PlayerCard' key={index} onClick={() => this.props.cardPressedCallback(this.props.id, index)}>
            {card.seen ? card.value : '?'}
          </div>
        ))}
      </div>
  )}
}

export default Hand;
