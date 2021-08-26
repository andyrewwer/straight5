class ConfigService {

  constructor(maxNumberInDeck, repeatsPerNumber, numberOfPlayers, numberOfDiscards, numberOfJokers, numberOfTokensNeededToWin) {
    this.maxNumberInDeck = maxNumberInDeck;
    this.repeatsPerNumber = repeatsPerNumber;
    this.numberOfPlayers = numberOfPlayers;
    this.numberOfDiscards = numberOfDiscards;
    this.numberOfJokers = numberOfJokers;
    this.numberOfTokensNeededToWin = numberOfTokensNeededToWin;
  }

  getMaxNumberInDeck() {
    return this.maxNumberInDeck;
  }

  getRepeatsPerNumber() {
    return this.repeatsPerNumber;
  }

  getNumberOfPlayers() {
    return this.numberOfPlayers;
  }

  getNumberOfDiscards() {
    return this.numberOfDiscards;
  }

  getNumberOfJokers() {
    return this.numberOfJokers;
  }

  getNumberOfTokensNeededToWin() {
    return this.numberOfTokensNeededToWin;
  }

  setMaxNumberInDeck(maxNumberInDeck) {
    this.maxNumberInDeck = maxNumberInDeck;
  }

  setRepeatsPerNumber(repeatsPerNumber) {
    this.repeatsPerNumber = repeatsPerNumber;
  }

  setNumberOfPlayers(numberOfPlayers) {
    this.numberOfPlayers = numberOfPlayers;
  }

  setNumberOfDiscards(numberOfDiscards) {
    this.numberOfDiscards = numberOfDiscards;
  }

  setNumberOfJokers(numberOfJokers) {
    this.numberOfJokers = numberOfJokers;
  }

  setNumberOfTokensNeededToWin(numberOfTokensNeededToWin) {
    this.numberOfTokensNeededToWin = numberOfTokensNeededToWin;
  }

  reset() {
    this.setMaxNumberInDeck(9);
    this.setRepeatsPerNumber(6);
    this.setNumberOfPlayers(2);
    this.setNumberOfDiscards(3);
    this.setNumberOfJokers(2);
    this.setNumberOfTokensNeededToWin(4);
  }

}

export {ConfigService};
