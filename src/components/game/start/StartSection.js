import React, { Component } from 'react';
import './StartSection.css';
import GameConfigurationSection from './GameConfigurationSection.js';

class StartSection extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
    this.state = {
      showConfiguration: false
    }
  }
  render = () => {
    return (
      <div className="start-section-container">
        <div>
          <button data-testid="start-section-hide-show-configuration-button" onClick={() => {this.setState({showConfiguration: !this.state.showConfiguration})}}>{this.state.showConfiguration ? 'Hide Configuration' : 'Show Configuration'}</button>
        </div>
        {this.state.showConfiguration &&
          <div className="start-section-slider-container" data-testid="start-section-slider-container">
             <GameConfigurationSection configService={this.props.configService}/>
          </div>}
        <div className="mb-4 mt-2">
          <button className="small-width-button" data-testid="startButton" onClick={this.props.startNewGameCallback}>Start New Game</button>
        </div>
      </div>
      )
    }
}

export default StartSection;
