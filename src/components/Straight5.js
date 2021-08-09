import React, { Component } from 'react';
import Hand from './Hand.js';
import MiddleSection from './MiddleSection.js';
import FooterSection from './FooterSection.js';
import './Straight5.css';
const { GameService } = require('../service/GameService.js')

class Straight5 extends Component {
  constructor(props) {
    super(props);
    this.gameService = new GameService(2);

// THIS.PLAYERS instead of this.gameService.getPlayers and  this.PlayersTokens. This.Players['deck'] this.players['tokens']
    this.state = {
      AppMode: "NoAction", // NOT USED CURRENTLY - NoAction, Game, PlayerWin,
      MoveState: "StartState", // StartState, CardDrawn, DiscardChosen, CardDiscarded, SwapChosen, SwapInProgress, PreEndState
    };
    this.TableCanvas = React.createRef();

    // binding for set this
    this.SwapCardsButtonPressed.bind(this);
    this.TurnCardsFaceUpButtonPressed.bind(this);
    this.PassTurnButtonPressed.bind(this);
    this.render.bind(this);
  }

  componentDidMount() {
    this.StartNewGame();
  }

  StartNewGame = () => {
    this.gameService.startNewGame(2);
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
    const moveState = this.state.MoveState === 'DiscardChosen' ? 'CardDiscarded' : 'DiscardDone';
    if (moveState === 'DiscardDone') {
      this.EndMove();
      return;
    }
    this.setState({
      MoveState: moveState,
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
    this.gameService.getActivePlayersTokens().push(token);
    this.ChangeTurn()
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
      default:
        console.error('NO ACTION FOR THIS')
    }
  }
  // TODO SHOW THE RESULTS OF THE TOKENS/SCORE SOMEWHERE
  // TODO SHOW ACTIVE PLAYER
  // TODO DISCARD CARDS / SELECT CARDS when you claim token

  render = () => {
    return (
  <div className="CardTable">
    <div>
      Straight 5
    </div>
    {this.state.AppMode  === 'Game' &&
    <React.Fragment>
      <Hand gameService={this.gameService} id={0} cardPressedCallback={this.handlePlayerAction} />
      <MiddleSection gameService={this.gameService} drawDiscardCallback={() => {this.DrawCard('discard')}} drawDeckCallback={() => {this.DrawCard('deck')}} />
      <Hand gameService={this.gameService} id={1} cardPressedCallback={this.handlePlayerAction} />
      <FooterSection gameService={this.gameService} moveState={this.state.MoveState} passTurnButtonPressed={this.PassTurnButtonPressed} turnCardsFaceUpButtonPressed={this.TurnCardsFaceUpButtonPressed} swapCardsButtonPressed={this.SwapCardsButtonPressed} changeTurn={this.ChangeTurn} claimToken={this.ClaimToken} />
    </React.Fragment>}
  </div>
  )}
}

export default Straight5;
