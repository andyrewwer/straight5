class ConfigService {

  constructor(maxNumberInDeck, repeatsPerNumber, numberOfPlayers, numberOfDiscards) {
    this.maxNumberInDeck = maxNumberInDeck;
    this.repeatsPerNumber = repeatsPerNumber;
    this.numberOfPlayers = numberOfPlayers;
    this.numberOfDiscards = numberOfDiscards;
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

}

export {ConfigService};
