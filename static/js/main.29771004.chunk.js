(this.webpackJsonpstraight5=this.webpackJsonpstraight5||[]).push([[0],[,,,,,,,,function(e,t,a){"use strict";function r(e){for(var t=e.length-1;t>0;t--){var a=Math.floor(Math.random()*(t+1)),r=[e[a],e[t]];e[t]=r[0],e[a]=r[1]}return e}function s(e,t){switch(e){case"StartState":return"Please draw a card from Deck or Discard";case"CardDrawn":return"Replace card in your hand or choose a discard option";case"DiscardChosen":return"Select the first card to discard or pass";case"CardDiscarded":return"Select the second card to discard or pass";case"SwapChosen":return"Select the first card you'd like  to swap";case"SwapInProgress":return"Selected "+t+". Please select a second card to swap";case"PreEndState":return"Please select a token to claim or pass";case"ClaimingToken":return"Please select the first card of your run";default:return"UNKONWN STATE DETECTED"}}a.r(t),a.d(t,"shuffleArray",(function(){return r})),a.d(t,"getPlayerTextForMoveState",(function(){return s}))},,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t),a.d(t,"GameService",(function(){return c}));var r=a(2),s=a(3),n=a(8).shuffleArray,c=function(){function e(t){Object(r.a)(this,e),this.playerService=t,this.deck=[],this.discard=[],this.swapCardIndex=-1,this.activeCard={},this.activePlayerIndex=0,this.tokenToClaim=""}return Object(s.a)(e,[{key:"createDeck",value:function(e,t){this.deck=[];for(var a=0;a<e;a++)for(var r=0;r<t;r++)this.deck.push({value:r+1,seen:!1});n(this.deck)}},{key:"getTopCardFromDeck",value:function(){0===this.getDeck().length&&this.setDeck(n(this.getDiscard().splice(0,this.getDiscard().length-1)));var e=this.getDeck().pop();return e.seen=!1,e}},{key:"drawCardFromDeck",value:function(){this.setActiveCard(this.getTopCardFromDeck())}},{key:"drawCardFromDiscard",value:function(){0===this.getDiscard().length&&console.error("SOMETHING went wrong,  discard length = 0"),this.setActiveCard(this.getDiscard().pop())}},{key:"initializeDiscard",value:function(){this.discard.push(this.deck.pop())}},{key:"swapIsValid",value:function(e){return this.getSwapCardIndex()>0&&this.getSwapCardIndex()!==e}},{key:"swapCards",value:function(e){var t=this.getActivePlayersDeck(),a=t[e];t[e]=t[this.swapCardIndex],t[this.swapCardIndex]=a,this.setSwapCardIndex(-1)}},{key:"replaceCard",value:function(e){this.getActiveCard().seen=!0,this.getDiscard().push(this.getActivePlayersDeck()[e]),this.getActivePlayersDeck()[e]=this.getActiveCard(),this.setActiveCard({})}},{key:"turnCardFaceUp",value:function(e){var t=this.getActivePlayersDeck()[e];return!0!==this.getActivePlayersDeck()[e].seen&&(t.seen=!0,!0)}},{key:"discardActiveCard",value:function(){this.getDiscard().push(this.getActiveCard()),this.setActiveCard({})}},{key:"startNewGame",value:function(e,t){this.createDeck(e,t),this.playerService.dealCardsToPlayers(this.getDeck()),this.initializeDiscard(),this.setSwapCardIndex(-1),this.setActiveCard({}),this.setActivePlayerIndex(0),this.setTokenToClaim("")}},{key:"activePlayerCanClaimToken",value:function(){return this.canClaimToken("THREE_IN_A_ROW")||this.canClaimToken("FOUR_IN_A_ROW")||this.canClaimToken("FIVE_IN_A_ROW")||this.canClaimToken("THREE_OF_A_KIND")||this.canClaimToken("FULL_HOUSE")}},{key:"canClaimToken",value:function(e){var t=this.getActivePlayersDeck();if(this.getActivePlayersTokens().includes(e))return!1;switch(e){case"THREE_IN_A_ROW":for(var a=0;a<3;a++){var r=!0;if(t[a].seen){for(var s=a+1;s<3+a;s++)if(!t[s].seen||t[s].value!==t[s-1].value+1){r=!1;break}if(r)return!0}}return!1;case"FOUR_IN_A_ROW":for(var n=0;n<2;n++){var c=!0;if(t[n].seen){for(var i=n+1;i<4+n;i++)if(!t[i].seen||t[i].value!==t[i-1].value+1){c=!1;break}if(c)return!0}}return!1;case"FIVE_IN_A_ROW":if(!t[0].seen)return!1;for(var l=1;l<5;l++)if(!t[l].seen||t[l].value!==t[l-1].value+1)return!1;return!0;case"THREE_OF_A_KIND":for(var o={},d=0;d<5;d++)t[d].seen&&(o[t[d].value]||(o[t[d].value]=0),o[t[d].value]=o[t[d].value]+1);for(var u=0,h=Object.keys(o);u<h.length;u++){if(o[h[u]]>=3)return!0}return!1;case"FULL_HOUSE":for(var v={},j=0;j<5;j++)t[j].seen&&(v[t[j].value]||(v[t[j].value]=0),v[t[j].value]=v[t[j].value]+1);var k=Object.keys(v);return 2===k.length&&(2===v[k[0]]&&3===v[k[1]]||3===v[k[0]]&&2===v[k[1]])}return!1}},{key:"nextPlayer",value:function(){this.setActivePlayerIndex(this.getActivePlayerIndex()+1===this.playerService.getNumberOfPlayers()?0:this.getActivePlayerIndex()+1)}},{key:"isValidIndexForToken",value:function(e){var t=this.getActivePlayersDeck();if(["THREE_OF_A_KIND","FULL_HOUSE","FIVE_IN_A_ROW"].includes(this.getTokenToClaim()))return this.canClaimToken(t,this.getTokenToClaim(),this.getActivePlayersTokens());if("THREE_IN_A_ROW"===this.getTokenToClaim()){if(!t[e].seen||e>=3)return!1;for(var a=t[e].value,r=e+1;r<e+3;r++)if(!t[r].seen||t[r].value!==++a)return!1;return!0}if("FOUR_IN_A_ROW"===this.getTokenToClaim()){if(!t[e].seen||e>=2)return!1;for(var s=t[e].value,n=e+1;n<e+4;n++)if(!t[n].seen||t[n].value!==++s)return!1;return!0}return!1}},{key:"claimToken",value:function(e){var t=this.getActivePlayersDeck();switch(this.getTokenToClaim()){case"FIVE_IN_A_ROW":case"FULL_HOUSE":for(var a=0;a<t.length;a++)this.getDiscard().push(t[a]),t[a]=this.getTopCardFromDeck();break;case"THREE_OF_A_KIND":for(var r={},s=0;s<5;s++)if(t[s].seen&&(r[t[s].value]||(r[t[s].value]=[]),r[t[s].value].push(s),r[t[s].value].length>=3)){for(var n=r[t[s].value],c=0;c<n.length;c++)this.getDiscard().push(t[n[c]]),t[n[c]]=this.getTopCardFromDeck();break}break;case"THREE_IN_A_ROW":for(var i=e;i<e+3;i++)this.getDiscard().push(t[i]),t[i]=this.getTopCardFromDeck(),t[i].seen=!1;break;case"FOUR_IN_A_ROW":for(var l=e;l<e+4;l++)this.getDiscard().push(t[l]),t[l]=this.getTopCardFromDeck();break;default:return void console.error("something went wrong")}this.getActivePlayersTokens().push(this.getTokenToClaim()),this.setTokenToClaim("")}},{key:"activePlayerHasAllCardsFaceUp",value:function(){for(var e=this.getActivePlayersDeck(),t=0;t<e.length;t++)if(!e[t].seen)return!1;return!0}},{key:"getActivePlayersTokens",value:function(){return this.playerService.getPlayers()[this.getActivePlayerIndex()].getTokens()}},{key:"getActivePlayersDeck",value:function(){return this.playerService.getPlayers()[this.getActivePlayerIndex()].getDeck()}},{key:"getDeck",value:function(){return this.deck}},{key:"getDiscard",value:function(){return this.discard}},{key:"getSwapCardIndex",value:function(){return this.swapCardIndex}},{key:"getActiveCard",value:function(){return this.activeCard}},{key:"getActivePlayerIndex",value:function(){return this.activePlayerIndex}},{key:"getTokenToClaim",value:function(){return this.tokenToClaim}},{key:"setDeck",value:function(e){this.deck=e}},{key:"setDiscard",value:function(e){this.discard=e}},{key:"setSwapCardIndex",value:function(e){this.swapCardIndex=e}},{key:"setActiveCard",value:function(e){this.activeCard=e}},{key:"setActivePlayerIndex",value:function(e){this.activePlayerIndex=e}},{key:"setTokenToClaim",value:function(e){this.tokenToClaim=e}}]),e}()},function(e,t,a){"use strict";a.r(t),a.d(t,"PlayerService",(function(){return c}));var r=a(2),s=a(3),n=a(24).Player,c=function(){function e(t){Object(r.a)(this,e),this.numPlayers=t,this.players=[],this.resetPlayers()}return Object(s.a)(e,[{key:"resetPlayers",value:function(){this.players=[];for(var e=0;e<this.getNumberOfPlayers();e++)this.players.push(new n([],[]))}},{key:"dealCardsToPlayers",value:function(e){for(var t=0;t<5;t++)for(var a=0;a<this.getPlayers().length;a++)this.players[a].getDeck().push(e.pop())}},{key:"getPlayers",value:function(){return this.players}},{key:"setPlayers",value:function(e){this.players=e}},{key:"setNumberOfPlayers",value:function(e){this.numPlayers=e}},{key:"getNumberOfPlayers",value:function(){return this.numPlayers}}]),e}()},function(e,t,a){"use strict";a.r(t),a.d(t,"Player",(function(){return n}));var r=a(2),s=a(3),n=function(){function e(t,a){Object(r.a)(this,e),this.deck=t,this.tokens=a}return Object(s.a)(e,[{key:"getDeck",value:function(){return this.deck}},{key:"getTokens",value:function(){return this.tokens}},{key:"setDeck",value:function(e){this.deck=e}},{key:"setTokens",value:function(e){this.tokens=e}}]),e}()},function(e,t,a){"use strict";a.r(t);var r=a(1),s=a.n(r),n=a(9),c=a.n(n),i=(a(14),a(15),a(2)),l=a(3),o=a(6),d=a(5),u=a(4),h=(a(16),a(0)),v=function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(i.a)(this,a),(r=t.call(this,e)).render=function(){return Object(h.jsxs)("div",{className:"PlayerHand","data-testid":"hand",children:[Object(h.jsx)("div",{role:"header",className:"PlayerHeader",name:"Player1",children:Object(h.jsxs)("p",{className:"playerTag",children:["Player ",r.props.id+1]})}),Object(h.jsx)("div",{className:"PlayerTokenHeader",children:Object(h.jsx)("p",{className:"playerTag",children:"Tokens"})}),r.deck.map((function(e,t){return Object(h.jsx)("div",{className:"PlayerCard",role:"playerCard",onClick:function(){return r.props.cardPressedCallback(r.props.id,t)},children:e.seen?e.value:"?"},t)})),Object(h.jsx)("div",{className:"PlayerTokens",children:r.tokens.map((function(e,t){return Object(h.jsx)("div",{className:"PlayerToken",role:"playerToken",children:e},t)}))})]})},r.TableCanvas=s.a.createRef(),r.render.bind(Object(u.a)(r)),r.deck=r.props.playerService.getPlayers()[r.props.id].getDeck(),r.tokens=r.props.playerService.getPlayers()[r.props.id].getTokens(),r}return a}(r.Component),j=(a(18),function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(i.a)(this,a),(r=t.call(this,e)).render=function(){return Object(h.jsxs)("div",{className:"MiddleSection","data-testid":"middle-section",children:[Object(h.jsx)("div",{}),Object(h.jsxs)("div",{className:"DiscardSection",children:[Object(h.jsx)("div",{className:"FullWidth",role:"header",children:"Discard"}),Object(h.jsx)("div",{className:"PlayerCard","data-testid":"middle-section-discard",onClick:function(){r.props.drawCallback("discard")},children:r.getTopDiscardValue()})]}),Object(h.jsxs)("div",{className:"DeckSection",children:[Object(h.jsx)("div",{className:"FullWidth",role:"header",children:"Deck"}),Object(h.jsx)("div",{className:"PlayerCard Card","data-testid":"middle-section-deck",onClick:function(){r.props.drawCallback("deck")},children:"?"})]})]})},r.TableCanvas=s.a.createRef(),r.render.bind(Object(u.a)(r)),r.gameService=e.gameService,r}return Object(l.a)(a,[{key:"getTopDiscardValue",value:function(){return this.gameService.getDiscard().length>0?this.gameService.getDiscard()[this.gameService.getDiscard().length-1].value:""}}]),a}(r.Component)),k=(a(19),a(8).getPlayerTextForMoveState),f=function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(i.a)(this,a),(r=t.call(this,e)).ShowCardActions=function(){return["CardDrawn","DiscardChosen","CardDiscarded","SwapChosen","SwapInProgress"].includes(r.props.moveState)},r.ShowTurnUpAction=function(){return!r.gameService.activePlayerHasAllCardsFaceUp()},r.ShowEndActions=function(){return"PreEndState"===r.props.moveState},r.ShowToken=function(e){return r.gameService.canClaimToken(e)},r.render=function(){return Object(h.jsxs)("div",{className:"CardTableFooter","data-testid":"footer-section",children:[Object(h.jsx)("div",{className:"FullWidth",role:"header",children:k(r.props.moveState,r.gameService.getSwapCardIndex()+1)}),r.ShowCardActions()&&Object(h.jsxs)(s.a.Fragment,{children:[Object(h.jsx)("div",{className:"FullWidth",children:Object(h.jsx)("button",{className:"mb-2 FullWidth",onClick:function(){r.props.buttonPressedCallback("pass")},children:" Pass "})}),!!r.gameService.getActiveCard()&&!!r.gameService.getActiveCard().value&&Object(h.jsxs)(s.a.Fragment,{children:[Object(h.jsx)("div",{className:"PlayerCard",role:"activeCard",children:r.gameService.getActiveCard().value}),Object(h.jsxs)("div",{children:[r.ShowTurnUpAction()&&Object(h.jsx)("button",{"data-testid":"turn-face-up-button",onClick:function(){r.props.buttonPressedCallback("turnFaceUp")},children:" Discard to turn two face up "}),Object(h.jsx)("button",{onClick:function(){r.props.buttonPressedCallback("swap")},children:" Discard to swap two "})]})]})]}),r.ShowEndActions()&&Object(h.jsxs)(s.a.Fragment,{children:[Object(h.jsx)("div",{className:"FullWidth",children:Object(h.jsx)("button",{className:"mb-2 FullWidth",onClick:function(){r.props.buttonPressedCallback("changeTurn")},children:" Pass "})}),r.ShowToken("THREE_IN_A_ROW")&&Object(h.jsx)("div",{children:Object(h.jsx)("button",{onClick:function(){return r.props.buttonPressedCallback("claimToken","THREE_IN_A_ROW")},children:" THREE IN A ROW "})}),r.ShowToken("FOUR_IN_A_ROW")&&Object(h.jsx)("div",{children:Object(h.jsx)("button",{onClick:function(){return r.props.buttonPressedCallback("claimToken","FOUR_IN_A_ROW")},children:" FOUR IN A ROW "})}),r.ShowToken("FIVE_IN_A_ROW")&&Object(h.jsx)("div",{children:Object(h.jsx)("button",{onClick:function(){return r.props.buttonPressedCallback("claimToken","FIVE_IN_A_ROW")},children:" FIVE IN A ROW "})}),r.ShowToken("THREE_OF_A_KIND")&&Object(h.jsx)("div",{children:Object(h.jsx)("button",{onClick:function(){return r.props.buttonPressedCallback("claimToken","THREE_OF_A_KIND")},children:" THREE OF A KIND "})}),r.ShowToken("FULL_HOUSE")&&Object(h.jsx)("div",{children:Object(h.jsx)("button",{onClick:function(){return r.props.buttonPressedCallback("claimToken","FULL_HOUSE")},children:" FULL HOUSE "})})]})]})},r.gameService=e.gameService,r.TableCanvas=s.a.createRef(),r.render.bind(Object(u.a)(r)),r}return a}(r.Component),m=(a(20),function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(i.a)(this,a),(r=t.call(this,e)).render=function(){return Object(h.jsxs)("div",{className:"rulesSection","data-testid":"rules-section",children:[Object(h.jsx)("div",{className:"odd",children:Object(h.jsx)("h3",{className:"rules-header",children:"Rules"})}),Object(h.jsxs)("div",{className:"odd",children:[Object(h.jsx)("h4",{className:"rules-header",children:"Introduction"}),Object(h.jsx)("p",{className:"rules-p",children:"Welcome to Straight 5, a rummy-like, yahtzee-like card game! This is the (work-in-progress) digitial version of the (hopefully future) Straight 5 game. "})]}),Object(h.jsxs)("div",{className:"even",children:[Object(h.jsx)("h4",{className:"rules-header",children:"Winning"}),Object(h.jsxs)("p",{className:"rules-p",children:["The first player to claim ",r.targetTokens," out of ",r.maxTokens," tokens below wins."]}),Object(h.jsxs)("ul",{children:[Object(h.jsx)("li",{children:"Three in a row"}),Object(h.jsx)("li",{children:"Four in a row"}),Object(h.jsx)("li",{children:"Five in a row"}),Object(h.jsx)("li",{children:"Three of a kind"}),Object(h.jsx)("li",{children:"Full House"})]})]}),Object(h.jsxs)("div",{className:"odd",children:[Object(h.jsx)("h4",{className:"rules-header",children:"Set up"}),Object(h.jsx)("p",{className:"rules-p",children:"Each player begins with 5 cards face-down in front of them. The top card of the deck will be turned over as a discard"})]}),Object(h.jsxs)("div",{className:"even",children:[Object(h.jsx)("h4",{className:"rules-header",children:"Turn Order"}),Object(h.jsx)("p",{className:"rules-p",children:"Each consists of three phases:"}),Object(h.jsxs)("ol",{children:[Object(h.jsxs)("li",{children:[Object(h.jsx)("h4",{className:"phaseHeader",children:"Draw Phase:"})," draw the top card of the deck or discard piles"]}),Object(h.jsxs)("li",{children:[Object(h.jsx)("h4",{className:"phaseHeader",children:"Play Phase:"})," in this phase you can either place the card you drew in front or discard your to:",Object(h.jsxs)("ul",{children:[Object(h.jsx)("li",{children:" Turn up to two cards face-up"}),Object(h.jsx)("li",{children:" Swap any two cards "})]})]}),Object(h.jsxs)("li",{children:[Object(h.jsx)("h4",{className:"phaseHeader",children:"Token Phase"}),": if you have the cards face-up you may choose to discard them to claim a token."]})]})]}),Object(h.jsxs)("div",{className:"odd",children:[Object(h.jsx)("h4",{className:"rules-header",children:"Rule Clarifications"}),Object(h.jsx)("p",{className:"rules-p",children:"Here are some clarifications on rules above:"}),Object(h.jsxs)("ol",{children:[Object(h.jsx)("li",{children:"When you place the drawn card in front of you, you do not get to take another action"}),Object(h.jsx)("li",{children:"You can only claim each token once"}),Object(h.jsx)("li",{children:"The cards to claim the tokens for the straights (3/4/5 in a row) must be adjacent and in ascending order (e.g. 1 2 3 not 3 2 1 or 1 3 2)"}),Object(h.jsx)("li",{children:"The cards to claim the tokens for three of a kind and full house can be anywhere"})]})]}),Object(h.jsxs)("div",{className:"even",children:[Object(h.jsx)("h4",{className:"rules-header",children:"Final notes"}),Object(h.jsxs)("p",{className:"rules-p",children:["If you find any bugs or issues with Straight 5 please submit an issue by ",Object(h.jsx)("a",{href:"https://github.com/andyrewwer/straight5/issues",children:"clicking here"})," or you can email me at ",Object(h.jsx)("a",{href:"mailto:a.andyrewwer@gmail.com?subject = Feedback on Straight 5",children:"a.andyrewwer@gmail.com."})," Also feel free to email me with other thoughts/feedback/concerns (about the game or otherwise)!"]})]})]})},r.render.bind(Object(u.a)(r)),r.targetTokens=4,r.maxTokens=5,r}return a}(r.Component)),b=(a(21),function(e){Object(o.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(i.a)(this,a),(r=t.call(this,e)).StartNewGame=function(){r.playerService.setNumberOfPlayers(2),r.playerService.resetPlayers(),r.gameService.startNewGame(6,9),r.setState({MoveState:"StartState",AppMode:"Game"})},r.DrawCard=function(e){"StartState"===r.state.MoveState&&("deck"===e?r.gameService.drawCardFromDeck():"discard"===e?r.gameService.drawCardFromDiscard():console.error("draw card failed",e),r.setState({MoveState:"CardDrawn"}))},r.ReplaceCard=function(e){r.gameService.replaceCard(e),r.EndMove()},r.DiscardCard=function(){r.gameService.discardActiveCard()},r.TurnCardFaceUp=function(e){r.gameService.turnCardFaceUp(e)&&("CardDiscarded"!==r.state.MoveState?r.setState({MoveState:"CardDiscarded"}):r.EndMove())},r.SwapCards=function(e){if(r.gameService.swapIsValid(e))return r.gameService.swapCards(e),void r.EndMove();r.gameService.setSwapCardIndex(e),r.setState({MoveState:"SwapInProgress"})},r.EndMove=function(){r.gameService.activePlayerCanClaimToken()?r.setState({MoveState:"PreEndState"}):r.ChangeTurn()},r.ClaimTokenCardPress=function(e){if(r.gameService.isValidIndexForToken(e)){if(r.gameService.claimToken(e),!r.checkIfWinner())return r.ChangeTurn()}else console.error("invalid index :(")},r.ChangeTurn=function(){return r.gameService.nextPlayer(),r.setState({MoveState:"StartState"})},r.handleActionButtonPressed=function(e,t){if("pass"===e)return"CardDrawn"===r.state.MoveState&&r.DiscardCard(),r.EndMove();if("swap"===e)return r.setState({MoveState:"SwapChosen"}),r.DiscardCard();if("changeTurn"===e)return r.ChangeTurn();if("turnFaceUp"===e)return r.setState({MoveState:"DiscardChosen"}),r.DiscardCard();if("claimToken"===e){if(r.gameService.setTokenToClaim(t),["THREE_OF_A_KIND","FULL_HOUSE","FIVE_IN_A_ROW"].includes(t)&&(r.gameService.claimToken(),!r.checkIfWinner()))return r.ChangeTurn();r.setState({MoveState:"ClaimingToken"})}},r.handlePlayerCardPressed=function(e,t){if(e===r.gameService.getActivePlayerIndex())switch(r.state.MoveState){case"CardDrawn":r.ReplaceCard(t);break;case"DiscardChosen":case"CardDiscarded":r.TurnCardFaceUp(t);break;case"SwapChosen":case"SwapInProgress":r.SwapCards(t);break;case"ClaimingToken":r.ClaimTokenCardPress(t);break;default:console.log("No action for this status",r.state.MoveState)}else console.log("card from wrong player clicked")},r.render=function(){return Object(h.jsxs)("div",{className:"StartState"===r.state.AppMode?"CardTable":"CardTable CardTableGame",children:[Object(h.jsx)("h2",{className:"startHeader","data-testid":"start-header",children:"Straight 5"}),"StartState"===r.state.AppMode&&Object(h.jsxs)(s.a.Fragment,{children:[Object(h.jsx)(m,{}),Object(h.jsx)("div",{className:"mb-4 mt-2",children:Object(h.jsx)("button",{onClick:r.StartNewGame,children:"Start New Game"})})]}),"Game"===r.state.AppMode&&Object(h.jsxs)(s.a.Fragment,{children:[Object(h.jsx)(v,{playerService:r.playerService,id:0,cardPressedCallback:r.handlePlayerCardPressed}),Object(h.jsx)(j,{gameService:r.gameService,drawCallback:r.DrawCard}),Object(h.jsx)(v,{playerService:r.playerService,id:1,cardPressedCallback:r.handlePlayerCardPressed}),Object(h.jsx)(f,{gameService:r.gameService,moveState:r.state.MoveState,buttonPressedCallback:r.handleActionButtonPressed})]}),"PlayerWin"===r.state.AppMode&&Object(h.jsx)(s.a.Fragment,{children:Object(h.jsxs)("div",{className:"mb-4","data-testid":"win-header",children:["Congratulations to Player ",r.gameService.getActivePlayerIndex()+1,Object(h.jsx)("button",{"data-testid":"win-startNewGame",className:"mt-2",onClick:r.StartNewGame,children:"Start a new Game"})]})})]})},r.state={AppMode:"StartState",MoveState:"StartState"},r.playerService=e.playerService,r.gameService=e.gameService,r}return Object(l.a)(a,[{key:"checkIfWinner",value:function(){return this.gameService.getActivePlayersTokens().length>=4&&(this.setState({AppMode:"PlayerWin"}),!0)}}]),a}(r.Component)),p=a(22).GameService,g=a(23).PlayerService;var O=function(){var e=new g,t=new p(e);return Object(h.jsx)("div",{className:"App",children:Object(h.jsx)("header",{children:Object(h.jsx)("div",{className:"Container",children:Object(h.jsx)(b,{playerService:e,gameService:t})})})})},y=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,26)).then((function(t){var a=t.getCLS,r=t.getFID,s=t.getFCP,n=t.getLCP,c=t.getTTFB;a(e),r(e),s(e),n(e),c(e)}))};c.a.render(Object(h.jsx)(s.a.StrictMode,{children:Object(h.jsx)(O,{})}),document.getElementById("root")),y()}],[[25,1,2]]]);
//# sourceMappingURL=main.29771004.chunk.js.map