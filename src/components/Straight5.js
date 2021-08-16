import React, { Component } from 'react';
import Hand from './game/Hand.js';
import MiddleSection from './game/MiddleSection.js';
import FooterSection from './game/FooterSection.js';
import RulesSection from './RulesSection.js';
import NewstickerSection from './game/NewstickerSection.js';
import './Straight5.css';
const {ActionType, AppMode, DrawType, MoveState, TokenType} = require('../model/Enums.js')
const classNames = require('classnames');

class Straight5 extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   AppMode: AppMode.START_STATE,
    //   MoveState: MoveState.START_STATE,
    // };
    this.playerService = props.playerService;
    this.gameService = props.gameService;
    this.configService = props.configService;
    this.stateService = props.stateService;
  }

  StartNewGame = () => {
    this.playerService.resetPlayers();
    this.gameService.startNewGame();
    this.props.stateService.setMoveState(MoveState.START_STATE);
    this.props.stateService.setAppMode(AppMode.GAME);
  }

  handleDiscard(index) {
    const action = this.stateService.getInterruptedActionType();
    this.gameService.discardCard(index);
    if (action === ActionType.PASS) {
      return this.EndMove();
    } else if (action === ActionType.SWAP) {
      return this.stateService.setMoveState(MoveState.SWAP_CHOSEN);
    } else if (action ===  ActionType.TURN_FACE_UP) {
      return this.stateService.setMoveState(MoveState.TURN_FACE_UP_CHOSEN);
    } else if (action === ActionType.REPLACE_CARD) {
      this.EndMove();
    }
  }

  //TODO animation
  deckAndDiscardPressed = (type, index) => {
    if (this.stateService.getMoveState() !== MoveState.START_STATE) {
      return;
    }
    if (this.stateService.getMoveState() === MoveState.DISCARD_CHOSEN && type === DrawType.DISCARD) {
      this.handleDiscard(index);
      return;
    }
    if (type === DrawType.DECK) {
      this.gameService.drawCardFromDeck();
    } else if (type === DrawType.DISCARD) {
      this.gameService.drawCardFromDiscard(index);
    } else {
      console.error('draw card failed', type);
    }
    this.stateService.setMoveState(MoveState.CARD_DRAWN);
  }

  ReplaceCard = index => {
    this.gameService.replaceCard(index);
  }

  TurnCardFaceUp = index => {
    if (!this.gameService.turnCardFaceUp(index)) {
      return;
    }
    if (this.stateService.getMoveState() === MoveState.TURN_FACE_UP_IN_PROGRESS) {
      this.EndMove();
      return;
    }
    if (this.gameService.activePlayerHasAllCardsFaceUp()) {
      this.EndMove();
      return;
    }
    this.stateService.setMoveState(MoveState.TURN_FACE_UP_IN_PROGRESS);
  }

  SwapCards = index => {
    if (this.gameService.swapIsValid(index)) {
      this.gameService.swapCards(index);
      this.EndMove();
      return
    }
    this.gameService.setSwapCardIndex(index);
    this.stateService.setMoveState(MoveState.SWAP_IN_PROGRESS);
  }

  EndMove = () => {
    if (this.gameService.activePlayerCanClaimToken()) {
      this.stateService.setMoveState(MoveState.PRE_END_STATE);
      return;
    }
    this.ChangeTurn();

  }

  checkIfWinner() {
    if (this.gameService.getActivePlayersTokens().length >= 4) {
      this.stateService.setAppMode(AppMode.PLAYER_WIN);
      this.forceUpdate();
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
    this.stateService.setMoveState(MoveState.START_STATE);
  }

  setDiscardChosenState(action) {
    const index = this.gameService.discardPileHas0Cards();
    if (index >= 0) {
      this.handleDiscard(index, action);
      return
    }
    this.stateService.setMoveState(MoveState.DISCARD_CHOSEN);
    this.stateService.setInterruptedActionType(action);
  }

  handleActionButtonPressed = (action, token) => {
    if (action === ActionType.PASS) {
      if (this.stateService.getMoveState() === MoveState.CARD_DRAWN) {
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
      this.stateService.setMoveState(MoveState.CLAIMING_TOKEN);
    }
  }

  handlePlayerCardPressed = (player, index)  =>  {
    if (player !== this.gameService.getActivePlayerIndex()) {
      console.log('card from wrong player clicked')
      return;
    }
    switch (this.stateService.getMoveState()) {
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
    }
  }
  // TODO SHOW ACTIVE PLAYER
  // TODO ADD joker
  // TODO ADD AI
  // TODO  state service instead of this.state

  // TODO MUM gap between hands and footer sectoin. Maybe footsection has constant size.
  render = () => {
    return (
      <React.Fragment>
  <div className={classNames('CardTable', {'CardTableGame': this.stateService.getAppMode() !== AppMode.START_STATE})}>
    <h2 className="startHeader" data-testid="start-header">
      Straight 5
    </h2>
    {this.stateService.getAppMode() === AppMode.START_STATE &&
    <React.Fragment>
        <RulesSection/>
        <div className="mb-4 mt-2">
          <button className="small-width-button" onClick={this.StartNewGame}>Start New Game</button>
        </div>

    </React.Fragment>}

    {this.stateService.getAppMode()  === AppMode.GAME &&
    <React.Fragment>
      <Hand gameService={this.gameService} moveState={this.stateService.getMoveState()} playerService={this.playerService} id={0} cardPressedCallback={this.handlePlayerCardPressed} />
      <MiddleSection gameService={this.gameService} drawCallback={this.deckAndDiscardPressed} moveState={this.stateService.getMoveState()}/>
      <Hand gameService={this.gameService} moveState={this.stateService.getMoveState()} playerService={this.playerService} id={1} cardPressedCallback={this.handlePlayerCardPressed} />
    </React.Fragment>}

    {this.stateService.getAppMode() === AppMode.PLAYER_WIN &&
    <React.Fragment>
        <div className="mb-4" data-testid="win-header">
        Congratulations to Player {this.gameService.getActivePlayerIndex()+1}
        <button data-testid="win-startNewGame" className="mt-2" onClick={this.StartNewGame}>Start a new Game</button>
        </div>
    </React.Fragment>}
  </div>
    {this.stateService.getAppMode()  === AppMode.GAME && <NewstickerSection gameService={this.gameService} moveState={this.stateService.getMoveState()}/>}
    {this.stateService.getAppMode()  === AppMode.GAME && <FooterSection gameService={this.gameService} moveState={this.stateService.getMoveState()} buttonPressedCallback={this.handleActionButtonPressed} />}
  </React.Fragment>
  )}
}

export default Straight5;
