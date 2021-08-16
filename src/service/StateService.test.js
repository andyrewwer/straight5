const {ActionType, AppMode, MoveState} = require('../model/Enums.js')
const {StateService} = require('./StateService.js')

test('StateService', () => {
  const stateService = new StateService(AppMode.GAME, MoveState.START_STATE, ActionType.PASS);

  expect(stateService.getAppMode()).toBe(AppMode.GAME);
  expect(stateService.getMoveState()).toBe(MoveState.START_STATE);
  expect(stateService.getInterruptedActionType()).toBe(ActionType.PASS);

  stateService.setAppMode(AppMode.PLAYER_WIN);
  expect(stateService.getAppMode()).toBe(AppMode.PLAYER_WIN);

  stateService.setMoveState(MoveState.CARD_DRAWN);
  expect(stateService.getMoveState()).toBe(MoveState.CARD_DRAWN);

  stateService.setInterruptedActionType(ActionType.SWAP);
  expect(stateService.getInterruptedActionType()).toBe(ActionType.SWAP);
});

test('StateService error', () => {
  const stateService = new StateService(AppMode.GAME, MoveState.START_STATE, ActionType.PASS);

  expect(() => stateService.setAppMode('ERROR')).toThrow(TypeError);
  expect(() => stateService.setAppMode('ERROR')).toThrow('Invalid AppMode');

  expect(() => stateService.setMoveState('ERROR')).toThrow(TypeError);
  expect(() => stateService.setMoveState('ERROR')).toThrow('Invalid MoveState');

  expect(() => stateService.setInterruptedActionType('ERROR')).toThrow(TypeError);
  expect(() => stateService.setInterruptedActionType('ERROR')).toThrow('Invalid ActionType');
});
