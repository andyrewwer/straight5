const {ConfigService} = require('./ConfigService.js')

test('configService', () => {
  const configService = new ConfigService(1,2,3,4,5);
  expect(configService.getMaxNumberInDeck()).toBe(1);
  expect(configService.getRepeatsPerNumber()).toBe(2);
  expect(configService.getNumberOfPlayers()).toBe(3);
  expect(configService.getNumberOfDiscards()).toBe(4);
  expect(configService.getNumberOfJokers()).toBe(5);
});
