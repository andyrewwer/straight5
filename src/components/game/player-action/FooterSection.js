import React, { Component } from 'react';
import './FooterSection.css';
import ClaimTokenSection from './ClaimTokenSection.js'
import PlayerTurnActionsSection from './PlayerTurnActionsSection.js'
const { MoveState } = require('../../../model/Enums.js')


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

  ShowEndActions = () => {
    return this.props.moveState === MoveState.PRE_END_STATE;
  }

  render = () => {
    return (
      <div className="CardTableFooter" data-testid="footer-section">
      {this.ShowCardActionsSection() &&
        <PlayerTurnActionsSection gameService={this.props.gameService} moveState={this.props.moveState} buttonPressedCallback={this.props.buttonPressedCallback}/>
      }

      {this.ShowEndActions() &&
        <ClaimTokenSection gameService={this.props.gameService} tokenService={this.props.tokenService} buttonPressedCallback={this.props.buttonPressedCallback}/>
      }
        </div>
      )
    }
}
export default FooterSection;
