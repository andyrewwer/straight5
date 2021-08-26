import React, { Component } from 'react';
import { Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const PrettySlider = withStyles({
root: {
  color: '#52af77',
  height: 8,
},
thumb: {
  height: 24,
  width: 24,
  backgroundColor: '#fff',
  border: '2px solid currentColor',
  marginTop: -8,
  marginLeft: -12,
  '&:focus, &:hover, &$active': {
    boxShadow: 'inherit',
  },
},
active: {},
valueLabel: {
  left: 'calc(-50% + 4px)',
},
markLabel: {
  color: 'white'
},
track: {
  height: 8,
  borderRadius: 4,
},
rail: {
  height: 8,
  borderRadius: 4
},
})(Slider);

export class Straight5Slider extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.render.bind(this);
  }
  render = () => {
    return (

      <PrettySlider valueLabelDisplay="on" aria-label="pretty slider"
        min={this.props.min} step={this.props.step} max={this.props.max} value={this.props.value}
        marks={this.props.marks}
        onChange={this.props.onChange}
        disabled={this.props.disabled}
        />
        )
    }
}
