import React from 'react';
import './App.css';
import Straight5 from './components/Straight5.js';
const { GameState } = require('./model/GameState.js')
const { GameService } = require('./service/GameService.js')
const { PlayerService } = require('./service/PlayerService.js')
const { ConfigService } = require('./service/ConfigService.js')
const { TokenService } = require('./service/TokenService.js')

function App() {
  const configService = new ConfigService(6, 9, 2, 3);
  const playerService = new PlayerService(configService)
  const tokenService = new TokenService();
  const gameState = new GameState();
  const gameService = new GameService(playerService, tokenService, configService, gameState);
  return (
    <div className="App">
      <header>
      <div className="Container">

        <Straight5 playerService={playerService} gameService={gameService} configService={configService} tokenService={tokenService} gameState={gameState}></Straight5>
        </div>
      </header>
    </div>
  );
}

export default App;
