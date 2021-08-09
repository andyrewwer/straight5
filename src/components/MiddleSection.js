import React, { Component } from 'react';
import './MiddleSection.css';

class Hand extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
    this.gameService = props.gameService;
  }

  render = () => {
    return (
      <div className="MiddleSection">
        <div>
        </div>
        <div className="DiscardSection">
          <div className="FullWidth">
            Discard ({this.gameService.getDiscard().length})
          </div>
          <div className="PlayerCard" onClick={this.props.drawDiscardCallback}>
            {this.gameService.getDiscard().length > 0 ? this.gameService.getDiscard()[this.gameService.getDiscard().length-1].value : ''}
          </div>
        </div>
        <div  className="DeckSection">
          <div className="FullWidth">
            Deck ({this.gameService.getDeck().length})
          </div>
          <div className="PlayerCard Card" onClick={this.props.drawDeckCallback}>
            ?
          </div>
        </div>
      </div>
  )}
}

export default Hand;
