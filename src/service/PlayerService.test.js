const {shuffleArray} = require('../Utils');
const {PlayerService} = require('./PlayerService.js')

const playerService = new PlayerService();

//TODO
beforeEach(() => {
  // this.playerService = new PlayerService(2);
})

test('dealCardsToPlayers deals cards for any player number', () => {
  // this.playerService = new PlayerService(1);
  // this.playerService.createDeck(1,5);
  // this.playerService.dealCardsToPlayers();
  // expect(this.playerService.getPlayers()).toEqual([[{value:5, seen:false},{value:4, seen:false},{value:3, seen:false},{value:2, seen:false},{value:1, seen:false}]]);
  // expect(this.playerService.getPlayersTokens()).toEqual([[]]);
  //
  // this.playerService = new PlayerService(2);
  // this.playerService.createDeck(1,10);
  // this.playerService.dealCardsToPlayers();
  // expect(this.playerService.getPlayers()).toEqual([[{value:10, seen:false},{value:9, seen:false},{value:8, seen:false},{value:7, seen:false},{value:6, seen:false}], [{value:5, seen:false},{value:4, seen:false},{value:3, seen:false},{value:2, seen:false},{value:1, seen:false}]]);
  // expect(this.playerService.getPlayersTokens()).toEqual([[], []]);
  //
  // this.playerService = new PlayerService(3);
  // this.playerService.createDeck(1,15);
  // this.playerService.dealCardsToPlayers();
  // expect(this.playerService.getPlayers()).toEqual([[{value:15, seen:false},{value:14, seen:false},{value:13, seen:false},{value:12, seen:false},{value:11, seen:false}], [{value:10, seen:false},{value:9, seen:false},{value:8, seen:false},{value:7, seen:false},{value:6, seen:false}], [{value:5, seen:false},{value:4, seen:false},{value:3, seen:false},{value:2, seen:false},{value:1, seen:false}]]);
  // expect(this.playerService.getPlayersTokens()).toEqual([[], [], []]);
});
