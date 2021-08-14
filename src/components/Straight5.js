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
    this.configService = props.configService;
  }

  StartNewGame = () => {
    this.playerService.resetPlayers();
    this.gameService.startNewGame();
    this.setState({
      MoveState: MoveState.START_STATE,
      AppMode: AppMode.GAME
    });
  }


  handleDiscard(index, action) {
    this.gameService.discardCard(index);
    if (action === ActionType.PASS) {
      return this.EndMove();
    } else if (action === ActionType.SWAP) {
      return this.setState({MoveState: MoveState.SWAP_CHOSEN});
    } else if (action ===  ActionType.TURN_FACE_UP) {
      return this.setState({MoveState: MoveState.TURN_FACE_UP_CHOSEN});
    } else if (action === ActionType.REPLACE_CARD) {
      this.EndMove();
    }
  }
  //TODO animation
  deckAndDiscardPressed = (type, index) => {
    if (this.state.MoveState !== MoveState.START_STATE) {
      if (this.state.MoveState === MoveState.DISCARD_CHOSEN &&
           type === DrawType.DISCARD) {
             this.handleDiscard(index, this.state.InterruptedActionType);
      }
      return;
    }
    if (type === DrawType.DECK) {
      this.gameService.drawCardFromDeck();
    } else if (type === DrawType.DISCARD) {

      this.gameService.drawCardFromDiscard(index);
    } else {
      console.error('draw card failed', type);
    }
    this.setState({
      MoveState: MoveState.CARD_DRAWN
    });

  }

  ReplaceCard = index => {
    this.gameService.replaceCard(index);
  }

  TurnCardFaceUp = index => {
    if (!this.gameService.turnCardFaceUp(index)) {
      return;
    }
    if (this.state.MoveState === MoveState.TURN_FACE_UP_IN_PROGRESS) {
      this.EndMove();
      return;
    }
    if (this.gameService.activePlayerHasAllCardsFaceUp()) {
      this.EndMove();
      return;
    }
    this.setState({
      MoveState: MoveState.TURN_FACE_UP_IN_PROGRESS,
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

  setDiscardChosenState(action) {
    const index = this.gameService.discardPileHas0Cards();
    if (index >= 0) {
      this.handleDiscard(index, action);
      return
    }
    this.setState({
      MoveState: MoveState.DISCARD_CHOSEN,
      InterruptedActionType: action
    });
  }

  handleActionButtonPressed = (action, token) => {
    if (action === ActionType.PASS) {
      if (this.state.MoveState === MoveState.CARD_DRAWN) {
        return this.setDiscardChosenState(action);
      }
      return this.EndMove();
    }
    if ([ActionType.SWAP, ActionType.TURN_FACE_UP].includes(action)) {
        return this.setDiscardChosenState(action);
    }
    if (action === ActionType.CHANGE_TURN) {
      return this.ChangeTurn()
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
        this.ReplaceCard(index);
        return this.setDiscardChosenState(ActionType.REPLACE_CARD);
      case MoveState.TURN_FACE_UP_CHOSEN:
      case MoveState.TURN_FACE_UP_IN_PROGRESS:
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

  // TODO MUM gap between hands and footer sectoin. Maybe footsection has constant size.
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
      <MiddleSection gameService={this.gameService} drawCallback={this.deckAndDiscardPressed} moveState={this.state.MoveState}/>
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
