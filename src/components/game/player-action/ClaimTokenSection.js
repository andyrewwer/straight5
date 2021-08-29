import React, { Component } from 'react';
import './ClaimTokenSection.css';
const { ActionType, TokenType } = require('../../../model/Enums.js')

class ClaimTokenSection extends Component {
  constructor(props) {
    super(props);
    this.gameService = props.gameService;
    this.tokenService = props.tokenService;
    this.TableCanvas = React.createRef();
    this.render.bind(this);
  }

  ShowToken = token => {
    return this.tokenService.canClaimToken(this.gameService.getActivePlayersDeck(), token, this.gameService.getActivePlayersTokens());
  }

// TODO dynamic button using funky enums a list
  render = () => {
    return (
        <div className="claim-token-section" data-testid="claim-token-section">
        {this.ShowToken(TokenType.THREE_IN_A_ROW) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.THREE_IN_A_ROW)}> {TokenType.THREE_IN_A_ROW.viewValue} </button></div>}
        {this.ShowToken(TokenType.FOUR_IN_A_ROW) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.FOUR_IN_A_ROW)}> {TokenType.FOUR_IN_A_ROW.viewValue} </button></div>}
        {this.ShowToken(TokenType.FIVE_IN_A_ROW) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.FIVE_IN_A_ROW)}> {TokenType.FIVE_IN_A_ROW.viewValue} </button></div>}
        {this.ShowToken(TokenType.THREE_OF_A_KIND) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.THREE_OF_A_KIND)}> {TokenType.THREE_OF_A_KIND.viewValue} </button></div>}
        {this.ShowToken(TokenType.FULL_HOUSE) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.FULL_HOUSE)}> {TokenType.FULL_HOUSE.viewValue} </button></div>}
        <div className="FullWidth"><button className="mb-2 FullWidth" onClick={() => {this.props.buttonPressedCallback(ActionType.CHANGE_TURN)}}> Pass </button></div>
        </div>
      )
    }
}

export default ClaimTokenSection;
