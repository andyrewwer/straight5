import React, { Component } from 'react';
import './PlayerTurnActionsSection.css';
const { ActionType, MoveState } = require('../../../model/Enums.js')

class PlayerTurnActionsSection extends Component {
  constructor(props) {
    super(props);
    this.gameService = props.gameService;
    this.TableCanvas = React.createRef();
    this.render.bind(this);
  }

  showActiveCard = () => {
    return !!this.gameService.getGameState().getActiveCard() && !!this.gameService.getGameState().getActiveCard().value
  }

  showCardActionButtons = () => {
    return this.props.moveState === MoveState.CARD_DRAWN;
  }

  showTurnUpAction = () => {
    return !this.gameService.activePlayerHasAllCardsFaceUp();
  }

  showPassActions = () => {
    return this.props.moveState !== MoveState.DISCARD_CHOSEN;
  }

  render = () => {
    return (
      <div className="player-turn-action-section" data-testid="player-turn-action-section">
      {this.showActiveCard() &&
        <div className="PlayerCard PlayerCardFront" data-testid="footer-active-card">
          {this.gameService.getGameState().getActiveCard().value}
        </div>
      }
      {this.showCardActionButtons() &&
        <div>
          <button className="swapButton" onClick={() => {this.props.buttonPressedCallback(ActionType.SWAP)}}> Discard to swap two </button>
          {this.showTurnUpAction() && <button className="turnFaceUpButton" data-testid='turn-face-up-button' onClick={() => {this.props.buttonPressedCallback(ActionType.TURN_FACE_UP)}}> Discard to turn two face up </button>}
        </div>
      }
      {this.showPassActions() && <div className="FullWidth"><button className="mb-2 FullWidth" onClick={() => {this.props.buttonPressedCallback(ActionType.PASS)}}> Pass </button></div>}
      </div>
      )
    }
}

export default PlayerTurnActionsSection;
