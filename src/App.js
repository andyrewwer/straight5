import React from 'react';
import './App.css';
import Straight5 from './components/Straight5.js';
const { GameService } = require('./service/GameService.js')
const { PlayerService } = require('./service/PlayerService.js')
const { ConfigService } = require('./service/ConfigService.js')

function App() {
  const configService = new ConfigService(6, 9, 2, 3);
  const playerService = new PlayerService(configService)
  const gameService = new GameService(playerService, configService);
  return (
    <div className="App">
      <header>
      <div className="Container">

        <Straight5 playerService={playerService} gameService={gameService} configService={configService}></Straight5>
        </div>
      </header>
    </div>
  );
}

export default App;
