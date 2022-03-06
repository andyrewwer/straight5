class MoveHistory {

  constructor(initialMoveState) {
      this.initialMoveState = initialMoveState;
  }

  getInitialMoveState() {
    return this.initialMoveState;
  }

  setInitialMoveState(initialMoveState) {
    this.initialMoveState = initialMoveState;
  }
}

export {MoveHistory};
