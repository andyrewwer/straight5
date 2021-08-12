import './App.css';
import Straight5 from './components/Straight5.js';
const { GameService } = require('./service/GameService.js')
const { PlayerService } = require('./service/PlayerService.js')

function App() {
  const playerService = new PlayerService()
  const gameService = new GameService(playerService);

  return (
    <div className="App">
      <header>
      <div className="Container">

        <Straight5 playerService={playerService} gameService={gameService}></Straight5>
        </div>
      </header>
    </div>
  );
}

export default App;
