import React, { Component } from 'react';
import Hand from './game/Hand.js';
import MiddleSection from './game/MiddleSection.js';
import FooterSection from './game/FooterSection.js';
import RulesSection from './RulesSection.js';
import './Straight5.css';
const {ActionType, AppMode, DrawType, MoveState, TokenType} = require('../model/Enums.js')

class Straight5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppMode: AppMode.START_STATE,
      MoveState: MoveState.START_STATE,
    };
    this.playerService = props.playerService;
    this.gameService = props.gameService;
  }

  StartNewGame = () => {
    this.playerService.setNumberOfPlayers(2);
    this.playerService.resetPlayers();
    this.gameService.startNewGame(6, 9);
    this.setState({
      MoveState: MoveState.START_STATE,
      AppMode: AppMode.GAME
    });
  }

  DrawCard = type => {
    if (this.state.MoveState !== MoveState.START_STATE) {
      //TODO animation?
      return;
    }
    if (type === DrawType.DECK) {
      this.gameService.drawCardFromDeck();
    } else if (type === DrawType.DISCARD) {

      this.gameService.drawCardFromDiscard();
    } else {
      console.error('draw card failed', type);
    }
    this.setState({
      MoveState: MoveState.CARD_DRAWN
    });

  }

  ReplaceCard = index => {
    this.gameService.replaceCard(index);
    this.EndMove();
  }

  DiscardCard = () => {
    this.gameService.discardActiveCard();
  }

  TurnCardFaceUp = index => {
    if (!this.gameService.turnCardFaceUp(index)) {
      return;
    }
    // TODO if all face-up should skip this step
    if (this.state.MoveState === MoveState.CARD_DISCARDED) {
      this.EndMove();
      return;
    }
    this.setState({
      MoveState: MoveState.CARD_DISCARDED,
    });
  }

  SwapCards = index => {
    if (this.gameService.swapIsValid(index)) {
      this.gameService.swapCards(index);
      this.EndMove();
      return
    }
    this.gameService.setSwapCardIndex(index);
    this.setState({
      MoveState: MoveState.SWAP_IN_PROGRESS
    })
  }

  EndMove = () => {
    if (this.gameService.activePlayerCanClaimToken()) {
      this.setState({MoveState: MoveState.PRE_END_STATE});
      return;
    }
    this.ChangeTurn();

  }

  checkIfWinner() {
    if (this.gameService.getActivePlayersTokens().length >= 4) {
      this.setState({
        AppMode: AppMode.PLAYER_WIN
      });
      return true;
    }
    return false;
  }

  ClaimTokenCardPress = index => {
    if (this.gameService.isValidIndexForToken(index)) {
      this.gameService.claimToken(index);
      if (!this.checkIfWinner()) {
        return this.ChangeTurn();
      }
    } else {
      console.error('invalid index :(')
    }
  }

  ChangeTurn = () => {
    this.gameService.nextPlayer();
    return this.setState({
      MoveState: MoveState.START_STATE
    });
  }

  handleActionButtonPressed = (action, token) => {
    if (action === ActionType.PASS) {
      if (this.state.MoveState === MoveState.CARD_DRAWN) {
        this.DiscardCard()
      }
      return this.EndMove();
    }
    if (action === ActionType.SWAP) {
      this.setState({MoveState: MoveState.SWAP_CHOSEN})
      return this.DiscardCard()
    }
    if (action === ActionType.CHANGE_TURN) {
      return this.ChangeTurn()
    }
    if (action === ActionType.TURN_FACE_UP) {
      this.setState({MoveState: MoveState.DISCARD_CHOSEN})
      return this.DiscardCard()
    }
    if (action === ActionType.CLAIM_TOKEN) {
      this.gameService.setTokenToClaim(token);
      if([TokenType.THREE_OF_A_KIND, TokenType.FULL_HOUSE, TokenType.FIVE_IN_A_ROW].includes(token)) {
        // this could be smarter if only one option for three / four in a row
        this.gameService.claimToken();
        if (!this.checkIfWinner()) {
          return this.ChangeTurn();
        }
      }
      // TODO COME BACK TO THIS LATER, would like more auto-claim for 3/4 in a row
      // TODO Less autoclaim if multiple options for three of a
      this.setState({
        MoveState: MoveState.CLAIMING_TOKEN
      });
    }
  }

  handlePlayerCardPressed = (player, index)  =>  {
    if (player !== this.gameService.getActivePlayerIndex()) {
      console.log('card from wrong player clicked')
      return;
    }
    switch (this.state.MoveState) {
      case MoveState.CARD_DRAWN:
        this.ReplaceCard(index)
        break;
      case MoveState.DISCARD_CHOSEN:
      case MoveState.CARD_DISCARDED:
        this.TurnCardFaceUp(index);
        break
      case MoveState.SWAP_CHOSEN:
      case MoveState.SWAP_IN_PROGRESS:
        this.SwapCards(index)
        break
      case MoveState.CLAIMING_TOKEN:
        this.ClaimTokenCardPress(index);
        break;
      default:
        console.log('No action for this status', this.state.MoveState)
    }
  }
  // TODO SHOW ACTIVE PLAYER
  // TODO ADD joker
  // TODO ADD AI
  // TODO  state service instead of this.state


  render = () => {
    return (
  <div className={this.state.AppMode === AppMode.START_STATE ? 'CardTable' : 'CardTable CardTableGame'}>
    <h2 className="startHeader" data-testid="start-header">
      Straight 5
    </h2>
    {this.state.AppMode === AppMode.START_STATE &&
    <React.Fragment>
        <RulesSection/>
        <div className="mb-4 mt-2">
          <button className="small-width-button" onClick={this.StartNewGame}>Start New Game</button>
        </div>

    </React.Fragment>}

    {this.state.AppMode  === AppMode.GAME &&
    <React.Fragment>
      <Hand gameService={this.gameService} moveState={this.state.MoveState} playerService={this.playerService} id={0} cardPressedCallback={this.handlePlayerCardPressed} />
      <MiddleSection gameService={this.gameService} drawCallback={this.DrawCard} moveState={this.state.MoveState}/>
      <Hand gameService={this.gameService} moveState={this.state.MoveState} playerService={this.playerService} id={1} cardPressedCallback={this.handlePlayerCardPressed} />
      <FooterSection gameService={this.gameService} moveState={this.state.MoveState} buttonPressedCallback={this.handleActionButtonPressed} />
    </React.Fragment>}

    {this.state.AppMode === AppMode.PLAYER_WIN &&
    <React.Fragment>
        <div className="mb-4" data-testid="win-header">
        Congratulations to Player {this.gameService.getActivePlayerIndex()+1}
        <button data-testid="win-startNewGame" className="mt-2" onClick={this.StartNewGame}>Start a new Game</button>
        </div>
    </React.Fragment>}
  </div>
  )}
}

export default Straight5;
