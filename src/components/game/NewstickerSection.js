import React, { Component } from 'react';
import './NewstickerSection.css';
const { getPlayerTextForMoveState } = require('../../Utils.js')

class NewstickerSection extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
  }

  render = () => {
    return (
      <React.Fragment>
      <div className="newsTicker" data-testid="newsticker">
        <div className="newsTickerTriangleLeft"/>
        <div className="newsTickerMain">
          {getPlayerTextForMoveState(this.props.moveState, this.props.gameState.getSwapCardIndex() + 1)}
        </div>
        <div className="newsTickerTriangleRight"/>
      </div>
      </React.Fragment>
  )}
}

export default NewstickerSection;
