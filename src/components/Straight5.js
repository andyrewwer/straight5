import React, { Component } from 'react';
import Hand from './Hand.js';
import MiddleSection from './MiddleSection.js';
import FooterSection from './FooterSection.js';
import './Straight5.css';
const { GameService } = require('../service/GameService.js')
const { PlayerService } = require('../service/PlayerService.js')

// TODO Start game
//  TODO WIN
class Straight5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AppMode: "StartState", // NOT USED CURRENTLY - NoGame, Game, PlayerWin
      MoveState: "StartState", // StartState, CardDrawn, DiscardChosen, CardDiscarded, SwapChosen, SwapInProgress, PreEndState, ClaimingToken
    };
    this.TableCanvas = React.createRef();
  }

  componentDidMount() {
    // this.StartNewGame();
  }

  StartNewGame = () => {
    this.playerService = new PlayerService(2);
    this.gameService = new GameService(2, this.playerService);
    this.gameService.startNewGame();
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

  SwapCardsButtonPressed = () => {
    if (this.state.MoveState !== 'CardDrawn') {
      return
    }
    this.setState({MoveState: 'SwapChosen'})
    this.DiscardCard()
  }

  TurnCardsFaceUpButtonPressed = () => {
    if (this.state.MoveState !== 'CardDrawn') {
      return
    }
    this.setState({MoveState: 'DiscardChosen'})
    this.DiscardCard()
  }

  PassTurnButtonPressed = () => {
    if (this.state.MoveState === "CardDrawn") {
      this.DiscardCard()
    }
    this.EndMove();
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

  ClaimToken = token => {
    this.gameService.setTokenToClaim(token);
    if(['THREE_OF_A_KIND', 'FULL_HOUSE', 'FIVE_IN_A_ROW'].includes(token)) {
      // this could be smarter if only one option for three / four in a row
      this.gameService.claimToken();
      return this.ChangeTurn();
    }
    // TODO COME BACK TO THIS LATER, would like more auto-claim
    this.setState({
        MoveState: "ClaimingToken"
      });
  }

  ClaimTokenCardPress = index => {
    if (this.gameService.isValidIndexForToken(index)) {
      this.gameService.claimToken(index);
      this.gameService.getActivePlayersTokens().push(this.gameService.getTokenToClaim());
      if (this.gameService.getActivePlayersTokens().length >= 4) {
      // if (this.gameService.getActivePlayersTokens().length >= 4) {
        this.setState({
          AppMode: 'PlayerWin'
        });
      } else {
        this.ChangeTurn();
      }
    } else {
      console.error('invalid index :(')
    }
  }

  ChangeTurn = () => {
    this.gameService.nextPlayer();
    this.setState({
      MoveState: "StartState"
    })
  }

  handlePlayerAction = (player, index)  =>  {
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
  // TODO DISCARD CARDS / SELECT CARDS when you claim token


  render = () => {
    return (
  <div className="CardTable">
    {this.state.AppMode  === 'Game' &&
    <React.Fragment>
      <div>
        Straight 5
      </div>
      <Hand playerService={this.playerService} id={0} cardPressedCallback={this.handlePlayerAction} />
      <MiddleSection gameService={this.gameService} drawDiscardCallback={() => {this.DrawCard('discard')}} drawDeckCallback={() => {this.DrawCard('deck')}} />
      <Hand playerService={this.playerService} id={1} cardPressedCallback={this.handlePlayerAction} />
      <FooterSection gameService={this.gameService} moveState={this.state.MoveState} passTurnButtonPressed={this.PassTurnButtonPressed} turnCardsFaceUpButtonPressed={this.TurnCardsFaceUpButtonPressed} swapCardsButtonPressed={this.SwapCardsButtonPressed} changeTurn={this.ChangeTurn} claimToken={this.ClaimToken} />
    </React.Fragment>}
    {this.state.AppMode === 'StartState' &&
    <React.Fragment>
        <div className="mb-4">
        Welcome to Straight 5!
        <button className="mt-2" onClick={this.StartNewGame}>Start New Game</button>
        </div>
    </React.Fragment>}

    {this.state.AppMode === 'PlayerWin' &&
    <React.Fragment>
        <div className="mb-4">
        Congratulations to Player {this.gameService.getActivePlayerIndex()+1}
        <button className="mt-2" onClick={this.StartNewGame}>Start a new Game</button>
        </div>
    </React.Fragment>}
  </div>
  )}
}

export default Straight5;
