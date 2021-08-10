(this.webpackJsonpstraight5=this.webpackJsonpstraight5||[]).push([[0],[,,,,,,,,,function(e,t){e.exports={shuffleArray:function(e){for(var t=e.length-1;t>0;t--){var a=Math.floor(Math.random()*(t+1)),r=[e[a],e[t]];e[t]=r[0],e[a]=r[1]}return e},getPlayerTextForMoveState:function(e,t){switch(e){case"StartState":return"Please draw a card from Deck or Discard";case"CardDrawn":return"Replace card in your hand or choose a discard option";case"DiscardChosen":return"Select the first card to discard or pass";case"CardDiscarded":return"Select the second card to discard or pass";case"SwapChosen":return"Select the first card you'd like  to swap";case"SwapInProgress":return"Selected "+t+". Please select a second card to swap";case"PreEndState":return"Please select a token to claim or pass";case"ClaimingToken":return"Please select the first card of your run";default:return"UNKONWN STATE DETECTED"}}}},,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t),function(e){var t=a(2),r=a(3),n=a(9).shuffleArray,s=function(){function e(a,r){Object(t.a)(this,e),this.numPlayers=a,this.playerService=r,this.deck=[],this.discard=[],this.swapCardIndex=-1,this.activeCard={},this.activePlayerIndex=0,this.tokenToClaim=""}return Object(r.a)(e,[{key:"createDeck",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:6,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:9;this.deck=[];for(var a=0;a<e;a++)for(var r=0;r<t;r++)this.deck.push({value:r+1,seen:!1});n(this.deck)}},{key:"getTopCardFromDeck",value:function(){0===this.getDeck().length&&this.setDeck(n(this.getDiscard().splice(0,this.getDiscard().length-1)));var e=this.getDeck().pop();return e.seen=!1,e}},{key:"drawCardFromDeck",value:function(){this.setActiveCard(this.getTopCardFromDeck())}},{key:"drawCardFromDiscard",value:function(){0===this.getDiscard().length&&console.error("SOMETHING went wrong,  discard length = 0"),this.setActiveCard(this.getDiscard().pop())}},{key:"initializeDiscard",value:function(){this.discard.push(this.deck.pop())}},{key:"swapIsValid",value:function(e){return this.getSwapCardIndex()>0&&this.getSwapCardIndex()!==e}},{key:"swapCards",value:function(e){var t=this.getActivePlayersDeck(),a=t[e];t[e]=t[this.swapCardIndex],t[this.swapCardIndex]=a,this.setSwapCardIndex(-1)}},{key:"replaceCard",value:function(e){this.getActiveCard().seen=!0,this.getDiscard().push(this.getActivePlayersDeck()[e]),this.getActivePlayersDeck()[e]=this.getActiveCard(),this.setActiveCard({})}},{key:"turnCardFaceUp",value:function(e){var t=this.getActivePlayersDeck()[e];return!0!==this.getActivePlayersDeck()[e].seen&&(t.seen=!0,!0)}},{key:"discardActiveCard",value:function(){this.getDiscard().push(this.getActiveCard()),this.setActiveCard({})}},{key:"startNewGame",value:function(){this.createDeck(),this.playerService.dealCardsToPlayers(this.getDeck()),this.initializeDiscard()}},{key:"activePlayerCanClaimToken",value:function(){return this.canClaimToken("THREE_IN_A_ROW")||this.canClaimToken("FOUR_IN_A_ROW")||this.canClaimToken("FIVE_IN_A_ROW")||this.canClaimToken("THREE_OF_A_KIND")||this.canClaimToken("FULL_HOUSE")}},{key:"canClaimToken",value:function(e){var t=this.getActivePlayersDeck();if(this.getActivePlayersTokens().includes(e))return!1;switch(e){case"THREE_IN_A_ROW":for(var a=0;a<3;a++){var r=!0;if(t[a].seen){for(var n=a+1;n<3+a;n++)if(!t[n].seen||t[n].value!==t[n-1].value+1){r=!1;break}if(r)return!0}}return!1;case"FOUR_IN_A_ROW":for(var s=0;s<2;s++){var i=!0;if(t[s].seen){for(var c=s+1;c<4+s;c++)if(!t[c].seen||t[c].value!==t[c-1].value+1){i=!1;break}if(i)return!0}}return!1;case"FIVE_IN_A_ROW":if(!t[0].seen)return!1;for(var o=1;o<5;o++)if(!t[o].seen||t[o].value!==t[o-1].value+1)return!1;return!0;case"THREE_OF_A_KIND":for(var l={},d=0;d<5;d++)t[d].seen&&(l[t[d].value]||(l[t[d].value]=0),l[t[d].value]=l[t[d].value]+1);for(var u=0,v=Object.keys(l);u<v.length;u++){if(l[v[u]]>=3)return!0}return!1;case"FULL_HOUSE":for(var h={},k=0;k<5;k++)t[k].seen&&(h[t[k].value]||(h[t[k].value]=0),h[t[k].value]=h[t[k].value]+1);var C=Object.keys(h);return 2===C.length&&(2===h[C[0]]&&3===h[C[1]]||3===h[C[0]]&&2===h[C[1]])}return!1}},{key:"nextPlayer",value:function(){this.setActivePlayerIndex(this.getActivePlayerIndex()+1===this.numPlayers?0:this.getActivePlayerIndex()+1)}},{key:"isValidIndexForToken",value:function(e){var t=this.getActivePlayersDeck();if(["THREE_OF_A_KIND","FULL_HOUSE","FIVE_IN_A_ROW"].includes(this.getTokenToClaim()))return this.canClaimToken(t,this.getTokenToClaim(),this.getActivePlayersTokens());if("THREE_IN_A_ROW"===this.getTokenToClaim()){if(!t[e].seen||e>=3)return!1;for(var a=t[e].value,r=e+1;r<e+3;r++)if(!t[r].seen||t[r].value!==++a)return!1;return!0}if("FOUR_IN_A_ROW"===this.getTokenToClaim()){if(!t[e].seen||e>=2)return!1;for(var n=t[e].value,s=e+1;s<e+4;s++)if(!t[s].seen||t[s].value!==++n)return!1;return!0}return!1}},{key:"claimToken",value:function(e){var t=this.getActivePlayersDeck();switch(this.getTokenToClaim()){case"FIVE_IN_A_ROW":case"FULL_HOUSE":for(var a=0;a<t.length;a++)this.getDiscard().push(t[a]),t[a]=this.getTopCardFromDeck();break;case"THREE_OF_A_KIND":for(var r={},n=0;n<5;n++)if(t[n].seen&&(r[t[n].value]||(r[t[n].value]=[]),r[t[n].value].push(n),r[t[n].value].length>=3)){for(var s=r[t[n].value],i=0;i<s.length;i++)this.getDiscard().push(t[s[i]]),t[s[i]]=this.getTopCardFromDeck();break}break;case"THREE_IN_A_ROW":for(var c=e;c<e+3;c++)this.getDiscard().push(t[c]),t[c]=this.getTopCardFromDeck(),t[c].seen=!1;break;case"FOUR_IN_A_ROW":for(var o=e;o<e+4;o++)this.getDiscard().push(t[o]),t[o]=this.getTopCardFromDeck();break;default:return void console.error("something went wrong")}this.getActivePlayersTokens().push(this.getTokenToClaim()),this.setTokenToClaim("")}},{key:"getActivePlayersTokens",value:function(){return this.playerService.getPlayers()[this.getActivePlayerIndex()].getTokens()}},{key:"getActivePlayersDeck",value:function(){return this.playerService.getPlayers()[this.getActivePlayerIndex()].getDeck()}},{key:"getDeck",value:function(){return this.deck}},{key:"getDiscard",value:function(){return this.discard}},{key:"getSwapCardIndex",value:function(){return this.swapCardIndex}},{key:"getActiveCard",value:function(){return this.activeCard}},{key:"getActivePlayerIndex",value:function(){return this.activePlayerIndex}},{key:"getTokenToClaim",value:function(){return this.tokenToClaim}},{key:"setDeck",value:function(e){this.deck=e}},{key:"setDiscard",value:function(e){this.discard=e}},{key:"setSwapCardIndex",value:function(e){this.swapCardIndex=e}},{key:"setActiveCard",value:function(e){this.activeCard=e}},{key:"setActivePlayerIndex",value:function(e){this.activePlayerIndex=e}},{key:"setTokenToClaim",value:function(e){this.tokenToClaim=e}}]),e}();e.exports={GameService:s}}.call(this,a(8)(e))},function(e,t,a){"use strict";a.r(t),function(e){var t=a(2),r=a(3),n=a(24).Player,s=function(){function e(a){Object(t.a)(this,e),this.numPlayers=a,this.players=[];for(var r=0;r<a;r++)this.players.push(new n([],[]))}return Object(r.a)(e,[{key:"dealCardsToPlayers",value:function(e){for(var t=0;t<this.getPlayers().length;t++)for(var a=0;a<5;a++)this.players[t].getDeck().push(e.pop())}},{key:"getPlayers",value:function(){return this.players}},{key:"setPlayers",value:function(e){this.players=e}}]),e}();e.exports={PlayerService:s}}.call(this,a(8)(e))},function(e,t,a){"use strict";a.r(t),function(e){var t=a(2),r=a(3),n=function(){function e(a,r){Object(t.a)(this,e),this.deck=a,this.tokens=r}return Object(r.a)(e,[{key:"getDeck",value:function(){return this.deck}},{key:"getTokens",value:function(){return this.tokens}},{key:"setDeck",value:function(e){this.deck=e}},{key:"setTokens",value:function(e){this.tokens=e}}]),e}();e.exports={Player:n}}.call(this,a(8)(e))},function(e,t,a){"use strict";a.r(t);var r=a(1),n=a.n(r),s=a(10),i=a.n(s),c=(a(15),a(16),a(2)),o=a(3),l=a(6),d=a(5),u=a(4),v=(a(17),a(0)),h=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(c.a)(this,a),(r=t.call(this,e)).render=function(){return Object(v.jsxs)("div",{className:"PlayerHand",children:[Object(v.jsxs)("div",{role:"header",className:"PlayerHeader",name:"Player1",children:["Player ",r.props.id+1]}),Object(v.jsx)("div",{className:"PlayerTokenHeader",children:"Tokens"}),r.deck.map((function(e,t){return Object(v.jsx)("div",{className:"PlayerCard",role:"playerCard",onClick:function(){return r.props.cardPressedCallback(r.props.id,t)},children:e.seen?e.value:"?"},t)})),Object(v.jsx)("div",{className:"PlayerTokens",children:r.tokens.map((function(e,t){return Object(v.jsx)("div",{className:"PlayerToken",role:"playerToken",children:e},t)}))})]})},r.TableCanvas=n.a.createRef(),r.render.bind(Object(u.a)(r)),r.deck=r.props.playerService.getPlayers()[r.props.id].getDeck(),r.tokens=r.props.playerService.getPlayers()[r.props.id].getTokens(),r}return a}(r.Component),k=(a(19),function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(c.a)(this,a),(r=t.call(this,e)).render=function(){return Object(v.jsxs)("div",{className:"MiddleSection",children:[Object(v.jsx)("div",{}),Object(v.jsxs)("div",{className:"DiscardSection",children:[Object(v.jsxs)("div",{className:"FullWidth",children:["Discard (",r.gameService.getDiscard().length,")"]}),Object(v.jsx)("div",{className:"PlayerCard",onClick:r.props.drawDiscardCallback,children:r.gameService.getDiscard().length>0?r.gameService.getDiscard()[r.gameService.getDiscard().length-1].value:""})]}),Object(v.jsxs)("div",{className:"DeckSection",children:[Object(v.jsxs)("div",{className:"FullWidth",children:["Deck (",r.gameService.getDeck().length,")"]}),Object(v.jsx)("div",{className:"PlayerCard Card",onClick:r.props.drawDeckCallback,children:"?"})]})]})},r.TableCanvas=n.a.createRef(),r.render.bind(Object(u.a)(r)),r.gameService=e.gameService,r}return a}(r.Component)),C=(a(20),a(9).getPlayerTextForMoveState),g=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(c.a)(this,a),(r=t.call(this,e)).ShowCardActions=function(){return["CardDrawn","DiscardChosen","CardDiscarded","SwapChosen","SwapInProgress"].includes(r.props.moveState)},r.ShowEndActions=function(){return"PreEndState"===r.props.moveState},r.ShowToken=function(e){return r.gameService.canClaimToken(e)},r.render=function(){return Object(v.jsxs)("div",{className:"CardTableFooter",children:[Object(v.jsx)("div",{className:"FullWidth",role:"header",children:C(r.props.moveState,r.gameService.getSwapCardIndex()+1)}),r.ShowCardActions()&&Object(v.jsxs)(n.a.Fragment,{children:[Object(v.jsx)("div",{className:"FullWidth",children:Object(v.jsx)("button",{className:"mb-2 FullWidth",onClick:r.props.passTurnButtonPressed,children:" Pass "})}),!!r.gameService.getActiveCard()&&!!r.gameService.getActiveCard().value&&Object(v.jsxs)(n.a.Fragment,{children:[Object(v.jsx)("div",{className:"PlayerCard",role:"activeCard",children:r.gameService.getActiveCard().value}),Object(v.jsxs)("div",{children:[Object(v.jsx)("button",{onClick:r.props.turnCardsFaceUpButtonPressed,children:" Discard to turn two face up "}),Object(v.jsx)("button",{onClick:r.props.swapCardsButtonPressed,children:" Discard to swap two "})]})]})]}),r.ShowEndActions()&&Object(v.jsxs)(n.a.Fragment,{children:[Object(v.jsx)("div",{className:"FullWidth",children:Object(v.jsx)("button",{className:"mb-2 FullWidth",onClick:r.props.changeTurn,children:" Pass "})}),r.ShowToken("THREE_IN_A_ROW")&&Object(v.jsx)("div",{children:Object(v.jsx)("button",{onClick:function(){return r.props.claimToken("THREE_IN_A_ROW")},children:" THREE IN A ROW "})}),r.ShowToken("FOUR_IN_A_ROW")&&Object(v.jsx)("div",{children:Object(v.jsx)("button",{onClick:function(){return r.props.claimToken("FOUR_IN_A_ROW")},children:" FOUR IN A ROW "})}),r.ShowToken("FIVE_IN_A_ROW")&&Object(v.jsx)("div",{children:Object(v.jsx)("button",{onClick:function(){return r.props.claimToken("FIVE_IN_A_ROW")},children:" FIVE IN A ROW "})}),r.ShowToken("THREE_OF_A_KIND")&&Object(v.jsx)("div",{children:Object(v.jsx)("button",{onClick:function(){return r.props.claimToken("THREE_OF_A_KIND")},children:" THREE OF A KIND "})}),r.ShowToken("FULL_HOUSE")&&Object(v.jsx)("div",{children:Object(v.jsx)("button",{onClick:function(){return r.props.claimToken("FULL_HOUSE")},children:" FULL HOUSE "})})]})]})},r.gameService=e.gameService,r.TableCanvas=n.a.createRef(),r.render.bind(Object(u.a)(r)),r}return a}(r.Component),p=(a(21),a(22).GameService),f=a(23).PlayerService,m=function(e){Object(l.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(c.a)(this,a),(r=t.call(this,e)).StartNewGame=function(){r.playerService=new f(2),r.gameService=new p(2,r.playerService),r.gameService.startNewGame(),r.setState({MoveState:"StartState",AppMode:"Game"})},r.DrawCard=function(e){"StartState"===r.state.MoveState&&("deck"===e?r.gameService.drawCardFromDeck():"discard"===e?r.gameService.drawCardFromDiscard():console.error("draw card failed",e),r.setState({MoveState:"CardDrawn"}))},r.ReplaceCard=function(e){r.gameService.replaceCard(e),r.EndMove()},r.DiscardCard=function(){r.gameService.discardActiveCard()},r.SwapCardsButtonPressed=function(){"CardDrawn"===r.state.MoveState&&(r.setState({MoveState:"SwapChosen"}),r.DiscardCard())},r.TurnCardsFaceUpButtonPressed=function(){"CardDrawn"===r.state.MoveState&&(r.setState({MoveState:"DiscardChosen"}),r.DiscardCard())},r.PassTurnButtonPressed=function(){"CardDrawn"===r.state.MoveState&&r.DiscardCard(),r.EndMove()},r.TurnCardFaceUp=function(e){r.gameService.turnCardFaceUp(e)&&("CardDiscarded"!==r.state.MoveState?r.setState({MoveState:"CardDiscarded"}):r.EndMove())},r.SwapCards=function(e){if(r.gameService.swapIsValid(e))return r.gameService.swapCards(e),void r.EndMove();r.gameService.setSwapCardIndex(e),r.setState({MoveState:"SwapInProgress"})},r.EndMove=function(){r.gameService.activePlayerCanClaimToken()?r.setState({MoveState:"PreEndState"}):r.ChangeTurn()},r.ClaimToken=function(e){if(r.gameService.setTokenToClaim(e),["THREE_OF_A_KIND","FULL_HOUSE","FIVE_IN_A_ROW"].includes(e))return r.gameService.claimToken(),r.ChangeTurn();r.setState({MoveState:"ClaimingToken"})},r.ClaimTokenCardPress=function(e){r.gameService.isValidIndexForToken(e)?(r.gameService.claimToken(e),r.gameService.getActivePlayersTokens().push(r.gameService.getTokenToClaim()),r.gameService.getActivePlayersTokens().length>=4?r.setState({AppMode:"PlayerWin"}):r.ChangeTurn()):console.error("invalid index :(")},r.ChangeTurn=function(){r.gameService.nextPlayer(),r.setState({MoveState:"StartState"})},r.handlePlayerAction=function(e,t){if(e===r.gameService.getActivePlayerIndex())switch(r.state.MoveState){case"CardDrawn":r.ReplaceCard(t);break;case"DiscardChosen":case"CardDiscarded":r.TurnCardFaceUp(t);break;case"SwapChosen":case"SwapInProgress":r.SwapCards(t);break;case"ClaimingToken":r.ClaimTokenCardPress(t);break;default:console.error("NO ACTION FOR THIS")}else console.error("WRONG PLAYER")},r.render=function(){return Object(v.jsxs)("div",{className:"CardTable",children:["Game"===r.state.AppMode&&Object(v.jsxs)(n.a.Fragment,{children:[Object(v.jsx)("div",{children:"Straight 5"}),Object(v.jsx)(h,{playerService:r.playerService,id:0,cardPressedCallback:r.handlePlayerAction}),Object(v.jsx)(k,{gameService:r.gameService,drawDiscardCallback:function(){r.DrawCard("discard")},drawDeckCallback:function(){r.DrawCard("deck")}}),Object(v.jsx)(h,{playerService:r.playerService,id:1,cardPressedCallback:r.handlePlayerAction}),Object(v.jsx)(g,{gameService:r.gameService,moveState:r.state.MoveState,passTurnButtonPressed:r.PassTurnButtonPressed,turnCardsFaceUpButtonPressed:r.TurnCardsFaceUpButtonPressed,swapCardsButtonPressed:r.SwapCardsButtonPressed,changeTurn:r.ChangeTurn,claimToken:r.ClaimToken})]}),"StartState"===r.state.AppMode&&Object(v.jsx)(n.a.Fragment,{children:Object(v.jsxs)("div",{className:"mb-4",children:["Welcome to Straight 5!",Object(v.jsx)("button",{className:"mt-2",onClick:r.StartNewGame,children:"Start New Game"})]})}),"PlayerWin"===r.state.AppMode&&Object(v.jsx)(n.a.Fragment,{children:Object(v.jsxs)("div",{className:"mb-4",children:["Congratulations to Player ",r.gameService.getActivePlayerIndex()+1,Object(v.jsx)("button",{className:"mt-2",onClick:r.StartNewGame,children:"Start a new Game"})]})})]})},r.state={AppMode:"StartState",MoveState:"StartState"},r.TableCanvas=n.a.createRef(),r}return Object(o.a)(a,[{key:"componentDidMount",value:function(){}}]),a}(r.Component);var S=function(){return Object(v.jsx)("div",{className:"App",children:Object(v.jsx)("header",{children:Object(v.jsx)("div",{className:"Container",children:Object(v.jsx)(m,{})})})})},j=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,26)).then((function(t){var a=t.getCLS,r=t.getFID,n=t.getFCP,s=t.getLCP,i=t.getTTFB;a(e),r(e),n(e),s(e),i(e)}))};i.a.render(Object(v.jsx)(n.a.StrictMode,{children:Object(v.jsx)(S,{})}),document.getElementById("root")),j()}],[[25,1,2]]]);
//# sourceMappingURL=main.7fb98d62.chunk.js.map