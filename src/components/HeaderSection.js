import React, { Component } from 'react';
import './HeaderSection.css';
import RulesSectionWrapper from './RulesSectionWrapper.js';

class HeaderSection extends Component {
  constructor(props) {
    super(props);
    this.render.bind(this);
  }

  render () {
    return (
  <div className="straight5-header-container" data-testid="header-section">
    <div className="straight5-header-header">
      <h2 className="startHeader" data-testid="start-header">
        Straight 5
      </h2>
    </div>
    <div className="straight5-header-rulesSection">
      <RulesSectionWrapper configService={this.props.configService}></RulesSectionWrapper>
    </div>
  </div>
  )}
}

export default HeaderSection;
