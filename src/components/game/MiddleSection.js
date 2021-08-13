import React, { Component } from 'react';
import './MiddleSection.css';
const {DrawType, MoveState} = require('../../model/Enums.js')
const classNames = require('classnames');

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

  canDrawCard() {
    return this.props.moveState === MoveState.START_STATE;
  }

  // TODO - move this.state.MoveState to a dedicated service.
  // Now MOVE STATE IS HERE DO WE WANT TO MOVE THE DRAW LOGIC DOWN OR  KEEP IT HIGHER?

  render = () => {
    return (
      <div className="MiddleSection" data-testid="middle-section">
        <div>
        </div>
        <div className="DiscardSection">
          <div className="FullWidth" role="header">
            Discard
          </div>
          <div className={classNames('PlayerCard', {"PlayerCardIsActive" : this.canDrawCard()})} data-testid="middle-section-discard" onClick={() => {this.props.drawCallback(DrawType.DISCARD)}}>
            {this.getTopDiscardValue()}
          </div>
        </div>
        <div  className="DeckSection">
          <div className="FullWidth" role="header">
            Deck
          </div>
          <div className={classNames('PlayerCard', {"PlayerCardIsActive" : this.canDrawCard()})} data-testid="middle-section-deck" onClick={() => {this.props.drawCallback(DrawType.DECK)}}>
            ?
          </div>
        </div>
      </div>
  )}
}

export default Hand;
