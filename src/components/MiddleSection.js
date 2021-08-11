import React, { Component } from 'react';
import './MiddleSection.css';

class Hand extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
    this.gameService = props.gameService;
  }

  getTopDiscardValue() {
    return this.gameService.getDiscard().length > 0 ? this.gameService.getDiscard()[this.gameService.getDiscard().length-1].value : '';
  }

  render = () => {
    return (
      <div className="MiddleSection">
        <div>
        </div>
        <div className="DiscardSection">
          <div className="FullWidth" role="header">
            Discard
          </div>
          <div className="PlayerCard" role="playerCard" onClick={() => {this.props.drawCallback('discard')}}>
            {this.getTopDiscardValue()}
          </div>
        </div>
        <div  className="DeckSection">
          <div className="FullWidth" role="header">
            Deck
          </div>
          <div className="PlayerCard Card" role="playerCard" onClick={() => {this.props.drawCallback('deck')}}>
            ?
          </div>
        </div>
      </div>
  )}
}

export default Hand;
