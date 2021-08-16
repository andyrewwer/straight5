import React from 'react';
import './App.css';
import Straight5 from './components/Straight5.js';
const { GameService } = require('./service/GameService.js')
const { PlayerService } = require('./service/PlayerService.js')
const { ConfigService } = require('./service/ConfigService.js')
const { StateService } = require('./service/StateService.js')
const {ActionType, AppMode, MoveState} = require('./model/Enums.js')

function App() {
  const configService = new ConfigService(6, 9, 2, 3);
  const playerService = new PlayerService(configService)
  const gameService = new GameService(playerService, configService);
  const stateService = new StateService(AppMode.START_STATE, MoveState.START_STATE, ActionType.PASS);
  return (
    <div className="App">
      <header>
      <div className="Container">

        <Straight5 playerService={playerService} gameService={gameService} configService={configService} stateService={stateService}></Straight5>
        </div>
      </header>
    </div>
  );
}

export default App;
