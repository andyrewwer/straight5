import React, { Component } from 'react';
import Hand from './Hand.js';
import MiddleSection from './MiddleSection.js';
import FooterSection from './FooterSection.js';
import './Straight5.css';

class Straight5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppMode: "StartState", // StartState, Game, PlayerWin
      MoveState: "StartState", // StartState, CardDrawn, DiscardChosen, CardDiscarded, SwapChosen, SwapInProgress, PreEndState, ClaimingToken
    };
    this.playerService = props.playerService;
    this.gameService = props.gameService;
  }

  StartNewGame = () => {
    this.playerService.setNumberOfPlayers(2);
    this.playerService.resetPlayers();
    this.gameService.startNewGame(6, 9);
    this.setState({
      MoveState: "StartState",
      AppMode: "Game"
    });
  }

  DrawCard = type => {
    if (this.state.MoveState !== 'StartState') {
      //TODO animation?
      return;
    }
    if (type === 'deck') {
      this.gameService.drawCardFromDeck();
    } else if (type === 'discard') {

      this.gameService.drawCardFromDiscard();
    } else {
      console.error('draw card failed', type);
    }
    this.setState({
      MoveState: "CardDrawn"
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
    if (this.state.MoveState === 'CardDiscarded') {
      this.EndMove();
      return;
    }
    this.setState({
      MoveState: 'CardDiscarded',
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
      MoveState: 'SwapInProgress'
    })
  }

  EndMove = () => {
    if (this.gameService.activePlayerCanClaimToken()) {
      this.setState({MoveState: 'PreEndState'});
      return;
    }
    this.ChangeTurn();

  }

  checkIfWinner() {
    if (this.gameService.getActivePlayersTokens().length >= 4) {
      this.setState({
        AppMode: 'PlayerWin'
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
      MoveState: "StartState"
    });
  }

  handleActionButtonPressed = (action, token) => {
    if (action === 'pass') {
      if (this.state.MoveState === "CardDrawn") {
        this.DiscardCard()
      }
      return this.EndMove();
    }
    if (action === 'swap') {
      this.setState({MoveState: 'SwapChosen'})
      return this.DiscardCard()
    }
    if (action === 'changeTurn') {
      return this.ChangeTurn()
    }
    if (action === 'turnFaceUp') {
      this.setState({MoveState: 'DiscardChosen'})
      return this.DiscardCard()
    }
    if (action === 'claimToken') {
      this.gameService.setTokenToClaim(token);
      if(['THREE_OF_A_KIND', 'FULL_HOUSE', 'FIVE_IN_A_ROW'].includes(token)) {
        // this could be smarter if only one option for three / four in a row
        this.gameService.claimToken();
        if (!this.checkIfWinner()) {
          return this.ChangeTurn();
        }
      }
      // TODO COME BACK TO THIS LATER, would like more auto-claim for 3/4 in a row
      // TODO Less autoclaim if multiple options for three of a
      this.setState({
        MoveState: "ClaimingToken"
      });
    }
  }

  handlePlayerCardPressed = (player, index)  =>  {
    if (player !== this.gameService.getActivePlayerIndex()) {
      console.error('WRONG PLAYER')
      return;
    }
    switch (this.state.MoveState) {
      case "CardDrawn":
        this.ReplaceCard(index)
        break;
      case "DiscardChosen":
      case "CardDiscarded":
        this.TurnCardFaceUp(index);
        break
      case "SwapChosen":
      case "SwapInProgress":
        this.SwapCards(index)
        break
      case "ClaimingToken":
        this.ClaimTokenCardPress(index);
        break;
      default:
        console.error('NO ACTION FOR THIS')
    }
  }
  // TODO SHOW ACTIVE PLAYER
  // TODO ADD joker
  // TODO ADD AI


  render = () => {
    return (
  <div className="CardTable">
    {this.state.AppMode === 'StartState' &&
    <React.Fragment>
        <div className="mb-4" data-testid="start-header">
        Welcome to Straight 5
        <button className="mt-2" onClick={this.StartNewGame}>Start New Game</button>
        </div>
    </React.Fragment>}

    {this.state.AppMode  === 'Game' &&
    <React.Fragment>
      <div data-testid="game-header">
        Straight 5
      </div>
      <Hand playerService={this.playerService} id={0} cardPressedCallback={this.handlePlayerCardPressed} />
      <MiddleSection gameService={this.gameService} drawCallback={this.DrawCard}/>
      <Hand playerService={this.playerService} id={1} cardPressedCallback={this.handlePlayerCardPressed} />
      <FooterSection gameService={this.gameService} moveState={this.state.MoveState} buttonPressedCallback={this.handleActionButtonPressed} />
    </React.Fragment>}

    {this.state.AppMode === 'PlayerWin' &&
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
