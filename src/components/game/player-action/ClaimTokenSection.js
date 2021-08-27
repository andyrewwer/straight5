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
    return this.tokenService.canClaimToken(token, this.gameService.getActivePlayersDeck(), this.gameService.getActivePlayersTokens());
  }

// TODO dynamic button using funky enums a list
  render = () => {
    return (
        <div className="claim-token-section" data-testid="claim-token-section">
        {this.ShowToken(TokenType.THREE_IN_A_ROW) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.THREE_IN_A_ROW)}> THREE IN A ROW </button></div>}
        {this.ShowToken(TokenType.FOUR_IN_A_ROW) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.FOUR_IN_A_ROW)}> FOUR IN A ROW </button></div>}
        {this.ShowToken(TokenType.FIVE_IN_A_ROW) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.FIVE_IN_A_ROW)}> FIVE IN A ROW </button></div>}
        {this.ShowToken(TokenType.THREE_OF_A_KIND) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.THREE_OF_A_KIND)}> THREE OF A KIND </button></div>}
        {this.ShowToken(TokenType.FULL_HOUSE) && <div><button onClick={() => this.props.buttonPressedCallback(ActionType.CLAIM_TOKEN, TokenType.FULL_HOUSE)}> FULL HOUSE </button></div>}
        <div className="FullWidth"><button className="mb-2 FullWidth" onClick={() => {this.props.buttonPressedCallback(ActionType.CHANGE_TURN)}}> Pass </button></div>
        </div>
      )
    }
}

export default ClaimTokenSection;
