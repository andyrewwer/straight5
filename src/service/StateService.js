const {ActionType, AppMode, MoveState} = require('../model/Enums.js')

class StateService {

  constructor(appMode, moveState, interruptedActionType) {
    this.setAppMode(appMode);
    this.setMoveState(moveState);
    this.setInterruptedActionType(interruptedActionType);
  }

  getAppMode() {
    return this.appMode;
  }

  getMoveState() {
    return this.moveState;
  }

  getInterruptedActionType() {
    return this.interruptedActionType;
  }

  setAppMode(appMode) {
    if (!AppMode[appMode]) {
      throw new TypeError('Invalid AppMode', 'StateService.js', 25);
    }
    this.appMode = appMode;
  }

  setMoveState(moveState) {
    if (!MoveState[moveState]) {
      throw new TypeError('Invalid MoveState', 'StateService.js', 30);
    }
    this.moveState = moveState;
  }

  setInterruptedActionType(interruptedActionType) {
    if (!ActionType[interruptedActionType]) {
      throw new TypeError('Invalid ActionType', 'StateService.js', 39);
    }
    this.interruptedActionType =  interruptedActionType;
  }
}

export {StateService};
