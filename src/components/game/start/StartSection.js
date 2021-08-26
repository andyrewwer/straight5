import React, { Component } from 'react';
import './StartSection.css';

class StartSection extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
  }

  render = () => {
    return (
      <div className="mb-4 mt-2">
        <button className="small-width-button" data-testid="startButton" onClick={this.props.startNewGameCallback}>Start New Game</button>
      </div>
      )
    }
}

export default StartSection;
