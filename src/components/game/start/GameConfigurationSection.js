import React, { Component } from 'react';
import './GameConfigurationSection.css';
import Typography from '@material-ui/core/Typography';
import {Straight5Slider} from '../../generic/Slider.js'

// TODO figure out a way to test
class GameConfigurationSection extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
    this.configService = this.props.configService;
    this.onCardRangeChanged = this.onCardRangeChanged.bind(this);
    this.onRepeatChanged = this.onRepeatChanged.bind(this);
    this.onPlayerNumberChanged = this.onPlayerNumberChanged.bind(this);
    this.onDiscardNumberChanged = this.onDiscardNumberChanged.bind(this);
    this.onJokerNumberChanged = this.onJokerNumberChanged.bind(this);
    this.onNumberOfTokensNeededToWinChanged = this.onNumberOfTokensNeededToWinChanged.bind(this);
    this.reset = this.reset.bind(this);
  }

  marks1 = [
    {
      value: 5,
      label: '5',
    },
    {
      value: 6,
      label: '',
    },
    {
      value: 7,
      label: '',
    },
    {
      value: 8,
      label: '',
    },
    {
      value: 9,
      label: '9',
    },
    {
      value: 10,
      label: '',
    },
    {
      value: 11,
      label: '',
    },
    {
      value: 12,
      label: '',
    },
    {
      value: 13,
      label: '13',
    },
  ];

  marks2 = [
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '',
    },
    {
      value: 5,
      label: '',
    },
    {
      value: 6,
      label: '6',
    },
    {
      value: 7,
      label: '',
    },
    {
      value: 8,
      label: '',
    },
    {
      value: 9,
      label: '9',
    }
  ];

  onCardRangeChanged(event, value)  {
    this.configService.setMaxNumberInDeck(value);
    this.forceUpdate();
  }

  onRepeatChanged(event, value)  {
    this.configService.setRepeatsPerNumber(value);
    this.forceUpdate();
  }

  onPlayerNumberChanged(event, value)  {
    this.configService.setNumberOfPlayers(value);
    this.forceUpdate();
  }

  onDiscardNumberChanged(event, value)  {
    this.configService.setNumberOfDiscards(value);
    this.forceUpdate();
  }

  onJokerNumberChanged(event, value)  {
    this.configService.setNumberOfJokers(value);
    this.forceUpdate();
  }
  onNumberOfTokensNeededToWinChanged(event, value)  {
    this.configService.setNumberOfTokensNeededToWin(value);
    this.forceUpdate();
  }

  reset() {
    this.configService.reset();
    this.forceUpdate()
  }
  render = () => {
    return (
      <div className="configuration-container">
        <Typography id="discrete-card-range" gutterBottom>
          Card Range
        </Typography>
        <Straight5Slider min={5} step={1} max={13} value={this.configService.getMaxNumberInDeck()}
        marks={this.marks1}
        onChange={this.onCardRangeChanged}/>

        <Typography id="discrete-repeats" gutterBottom>
          Number of repeats
        </Typography>
        <Straight5Slider min={3} step={1} max={9} value={this.configService.getRepeatsPerNumber()}
          marks={this.marks2}
          onChange={this.onRepeatChanged}
          />

        <Typography id="discrete-num-players" gutterBottom>
          Number of Players
        </Typography>
        <Straight5Slider min={2} step={1} max={5} value={this.configService.getNumberOfPlayers()}
          disabled={true}
          marks
          onChange={this.onPlayerNumberChanged}
          />

        <Typography id="discrete-num-discard-piles" gutterBottom>
          Number of Discard Piles
        </Typography>
        <Straight5Slider min={1} step={1} max={4} value={this.configService.getNumberOfDiscards()}
          marks
          onChange={this.onDiscardNumberChanged}
          />

        <Typography id="discrete-num-jokers" gutterBottom>
          Number of Jokers
        </Typography>
        <Straight5Slider min={0} step={1} max={9} value={this.configService.getNumberOfJokers()}
          marks
          onChange={this.onJokerNumberChanged}
          />

        <Typography id="discrete-num-tokens-to-win" gutterBottom>
          Number of Tokens Needed to win
        </Typography>
        <Straight5Slider min={1} step={1} max={5} value={this.configService.getNumberOfTokensNeededToWin()}
          marks
          onChange={this.onNumberOfTokensNeededToWinChanged}
          />
        <div className="reset-configuration-button">
            <button onClick={this.reset}>Reset</button>
          </div>
      </div>
    )
  }
}

export default GameConfigurationSection;
