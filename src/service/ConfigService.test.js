const {ConfigService} = require('./ConfigService.js')

test('configService', () => {
  const configService = new ConfigService(1,2,3,4,5,6);
  expect(configService.getMaxNumberInDeck()).toBe(1);
  expect(configService.getRepeatsPerNumber()).toBe(2);
  expect(configService.getNumberOfPlayers()).toBe(3);
  expect(configService.getNumberOfDiscards()).toBe(4);
  expect(configService.getNumberOfJokers()).toBe(5);
  expect(configService.getNumberOfTokensNeededToWin()).toBe(6);
});

test('configService reset', () => {
  const configService = new ConfigService(0,0,0,0,0,0);
  configService.reset();
  expect(configService.getMaxNumberInDeck()).toBe(9);
  expect(configService.getRepeatsPerNumber()).toBe(6);
  expect(configService.getNumberOfPlayers()).toBe(2);
  expect(configService.getNumberOfDiscards()).toBe(3);
  expect(configService.getNumberOfJokers()).toBe(2);
  expect(configService.getNumberOfTokensNeededToWin()).toBe(4);
});
