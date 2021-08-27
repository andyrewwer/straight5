import React, { Component } from 'react';
import './FooterSection.css';
import ClaimTokenSection from './ClaimTokenSection.js'
const { ActionType, MoveState } = require('../../../model/Enums.js')

class FooterSection extends Component {
  constructor(props) {
    super(props);
    this.gameService = props.gameService;
    this.tokenService = props.tokenService;
    this.TableCanvas = React.createRef();
    this.render.bind(this);
  }

  ShowCardActionsSection = () => {
    return [MoveState.CARD_DRAWN, MoveState.TURN_FACE_UP_CHOSEN, MoveState.TURN_FACE_UP_IN_PROGRESS, MoveState.SWAP_CHOSEN, MoveState.SWAP_IN_PROGRESS, MoveState.DISCARD_CHOSEN].includes(this.props.moveState)
  }

  showActiveCard = () => {
    return !!this.gameService.getGameState().getActiveCard() && !!this.gameService.getGameState().getActiveCard().value
  }

  showCardActionButtons = () => {
    return this.props.moveState === MoveState.CARD_DRAWN;
  }

  ShowTurnUpAction = () => {
    return !this.gameService.activePlayerHasAllCardsFaceUp();
  }

  ShowEndActions = () => {
    return this.props.moveState === MoveState.PRE_END_STATE;
  }

  showPassActions = () => {
    return this.props.moveState !== MoveState.DISCARD_CHOSEN;
  }

  render = () => {
    return (
      <React.Fragment>
      <div className="CardTableFooter" data-testid="footer-section">
      {this.ShowCardActionsSection() &&
        <React.Fragment>
        {this.showActiveCard() &&
          <div className="PlayerCard PlayerCardFront" data-testid="footer-active-card">
            {this.gameService.getGameState().getActiveCard().value}
          </div>
        }
        {this.showCardActionButtons() &&
          <div>
            <button className="swapButton" onClick={() => {this.props.buttonPressedCallback(ActionType.SWAP)}}> Discard to swap two </button>
            {this.ShowTurnUpAction() && <button className="turnFaceUpButton" data-testid='turn-face-up-button' onClick={() => {this.props.buttonPressedCallback(ActionType.TURN_FACE_UP)}}> Discard to turn two face up </button>}
          </div>
        }
        {this.showPassActions() && <div className="FullWidth"><button className="mb-2 FullWidth" onClick={() => {this.props.buttonPressedCallback(ActionType.PASS)}}> Pass </button></div>}
        </React.Fragment>
      }

      {this.ShowEndActions() &&
        <ClaimTokenSection gameService={this.props.gameService} tokenService={this.props.tokenService} buttonPressedCallback={this.props.buttonPressedCallback}/>
      }
        </div>
      </React.Fragment>
      )
    }
}
export default FooterSection;
