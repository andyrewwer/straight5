class ConfigService {

  constructor(maxNumberInDeck, repeatsPerNumber, numberOfPlayers, numberOfDiscards, numberOfJokers) {
    this.maxNumberInDeck = maxNumberInDeck;
    this.repeatsPerNumber = repeatsPerNumber;
    this.numberOfPlayers = numberOfPlayers;
    this.numberOfDiscards = numberOfDiscards;
    this.numberOfJokers = numberOfJokers;
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

}

export {ConfigService};
