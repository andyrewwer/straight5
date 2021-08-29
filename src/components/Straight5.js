import React, { Component } from 'react';
import Hand from './game/Hand.js';
import DeckAndDiscardSection from './game/DeckAndDiscardSection.js';
import FooterSection from './game/player-action/FooterSection.js';
import HeaderSection from './HeaderSection.js';
import StartSection from './game/start/StartSection.js';
import NewstickerSection from './game/player-action/NewstickerSection.js';
import './Straight5.css';
import {changeTurnStyles} from '../Styles.js'
import Modal from 'react-modal';

const {ActionType, AppMode, DrawType, MoveState, TokenType} = require('../model/Enums.js')
const classNames = require('classnames');

// TODO undo move
// TODO keep track of number of moves etc
// TODO only highlight options that can be clicked when claiming a token
class Straight5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppMode: AppMode.START_STATE,
      MoveState: MoveState.START_STATE,
    };
    this.playerService = props.playerService;
    this.gameService = props.gameService;
    this.gameState = props.gameState;
    this.configService = props.configService;
    this.tokenService = props.tokenService;
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
    this.EndMove();
  }
  //TODO animation
  deckAndDiscardPressed = (type, index) => {
    if (this.state.MoveState !== MoveState.START_STATE) {
      if (this.state.MoveState === MoveState.DISCARD_CHOSEN &&
           type === DrawType.DISCARD) {
             this.handleDiscard(index);
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
    if (this.state.MoveState === MoveState.TURN_FACE_UP_IN_PROGRESS || this.gameService.activePlayerHasAllCardsFaceUp()) {
      return this.setDiscardChosenState();
    }
    this.setState({
      MoveState: MoveState.TURN_FACE_UP_IN_PROGRESS,
    });
  }

  SwapCards = index => {
    if (this.gameService.swapIsValid(index)) {
      this.gameService.swapCards(index);
      return this.setDiscardChosenState();
    }
    this.gameState.setSwapCardIndex(index);
    this.setState({
      MoveState: MoveState.SWAP_IN_PROGRESS
    })
  }

  EndMove = () => {
    if (this.tokenService.playerCanClaimToken(this.playerService.getPlayers()[this.gameState.getActivePlayerIndex()])) {
      this.setState({MoveState: MoveState.PRE_END_STATE});
      return;
    }
  this.ChangeTurn();

  }

  checkIfWinner() {
    if (this.gameService.getActivePlayersTokens().length >= this.configService.getNumberOfTokensNeededToWin()) {
      this.setState({
        AppMode: AppMode.PLAYER_WIN
      });
      return true;
    }
    return false;
  }

  ClaimTokenCardPress = index => {
    if (this.tokenService.isValidIndexForToken(this.gameService.getActivePlayersDeck(), this.gameState.getTokenToClaim(), index)) {
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
      MoveState: MoveState.CHANGE_TURN_STATE
    });
  }

  setDiscardChosenState() {
    const index = this.gameService.discardPileHas0Cards();
    if (index >= 0) {
      this.handleDiscard(index);
      return
    }
    this.setState({MoveState: MoveState.DISCARD_CHOSEN});
  }

  handleActionButtonPressed = (action, token) => {
    if (action === ActionType.PASS) {
      if (this.state.MoveState === MoveState.CARD_DRAWN) {
        return this.setDiscardChosenState();
      }
      return this.EndMove();
    } else if (action === ActionType.SWAP) {
      return this.setState({MoveState: MoveState.SWAP_CHOSEN});
    } else if (action ===  ActionType.TURN_FACE_UP) {
      return this.setState({MoveState: MoveState.TURN_FACE_UP_CHOSEN});
    }
    if (action === ActionType.CHANGE_TURN) {
      return this.ChangeTurn()
    }
    if (action === ActionType.CLAIM_TOKEN) {
      this.gameState.setTokenToClaim(token);

      const indeces = this.tokenService.getAllIndecesForToken(this.gameService.getActivePlayersDeck(), token);
      if (indeces.length === 1 || token === TokenType.FULL_HOUSE || token === TokenType.THREE_OF_A_KIND) {
        this.gameService.claimToken(indeces[0][0]); //TODO TEST
        if (!this.checkIfWinner()) {
          return this.ChangeTurn();
        }
      }
      // TODO Less autoclaim if multiple options for three of a
      this.setState({
        MoveState: MoveState.CLAIMING_TOKEN
      });
    }
  }

  handlePlayerCardPressed = (player, index)  =>  {
    if (player !== this.gameState.getActivePlayerIndex()) {
      console.log('card from wrong player clicked')
      return;
    }
    switch (this.state.MoveState) {
      case MoveState.CARD_DRAWN:
        this.ReplaceCard(index);
        this.setDiscardChosenState(ActionType.REPLACE_CARD);
        return
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
  // TODO ADD AI
  // TODO state service instead of this.state -- this is on wip-stateService but doesn't work because to update the UI you need to update the state

  render = () => {
    const closeModal = () => {
      this.setState({MoveState: MoveState.START_STATE})
    }

    return (
      <React.Fragment>
  <div className={classNames('CardTable', {'CardTableGame': this.state.AppMode === AppMode.GAME})}>

    <HeaderSection configService={this.configService}></HeaderSection>
    {this.state.AppMode === AppMode.START_STATE &&
    <React.Fragment>
      <StartSection startNewGameCallback={this.StartNewGame} configService={this.configService}/>
    </React.Fragment>}

    {this.state.AppMode  === AppMode.GAME &&
    <React.Fragment>
      <Hand gameService={this.gameService} configService={this.configService} moveState={this.state.MoveState} playerService={this.playerService} id={0} cardPressedCallback={this.handlePlayerCardPressed} />
      <DeckAndDiscardSection gameService={this.gameService} drawCallback={this.deckAndDiscardPressed} moveState={this.state.MoveState}/>
      <Hand gameService={this.gameService} configService={this.configService} moveState={this.state.MoveState} playerService={this.playerService} id={1} cardPressedCallback={this.handlePlayerCardPressed} />
    </React.Fragment>}

    {this.state.AppMode === AppMode.PLAYER_WIN &&
    <React.Fragment>
        <div className="mb-4" data-testid="win-header">
        Congratulations to Player {this.gameState.getActivePlayerIndex() + 1}
        <StartSection startNewGameCallback={this.StartNewGame} configService={this.configService}/>
        </div>
    </React.Fragment>}
  </div>
  {this.state.AppMode === AppMode.GAME &&
  <React.Fragment>
    {this.state.AppMode  === AppMode.GAME && <NewstickerSection gameState={this.gameState} moveState={this.state.MoveState}/>}
    {this.state.AppMode  === AppMode.GAME && <FooterSection gameService={this.gameService} moveState={this.state.MoveState} tokenService={this.tokenService} buttonPressedCallback={this.handleActionButtonPressed} />}
  </React.Fragment>}
  <Modal
          isOpen={this.state.MoveState === MoveState.CHANGE_TURN_STATE}
          onRequestClose={closeModal}
          style={changeTurnStyles}
          ariaHideApp={false}>
          <h1 className="change-turn-modal-title" data-testid="change-turn-modal-title"> Player {this.gameState.getActivePlayerIndex() + 1} Turn
          </h1>
          <button data-testid="change-turn-modal-title-button" hidden onClick={closeModal}>Hide</button>
        </Modal>
  </React.Fragment>
  )}
}

export default Straight5;
