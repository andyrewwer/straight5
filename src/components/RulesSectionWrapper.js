import React, { Component } from 'react';
import './RulesSectionWrapper.css';
import RulesSection from './RulesSection.js';
import Modal from 'react-modal';
import {customStyles} from '../Styles.js'

class RulesSectionWrapper extends Component {
  constructor(props) {
    super(props);
    this.maxTokens = 5; //TODO tokens to select and count should be a config
    this.state = {
      'modalIsOpen': false
    }
    this.render.bind(this);
  }

  render () {
    const openModal = () => {
      this.setState({'modalIsOpen': true})
    }

    const closeModal = () => {
      this.setState({'modalIsOpen': false})
    }
    return (
      <div>
        <div className="open-modal-container" id="modal-div">
          <div className="open-modal-content">
            <button className="small-width-button" data-testid="open-modal-button" onClick={openModal}>Rules</button>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          ariaHideApp={false}
          >
          <RulesSection numberOfTokensNeededToWin={this.props.configService.getNumberOfTokensNeededToWin()} maxTokens={this.maxTokens}></RulesSection>
          <div className="close-modal-container">
            <div className="close-modal-content">
              <button className="open-modal-button" data-testid="close-modal-button" onClick={closeModal}>close</button>
            </div>
          </div>
        </Modal>
      </div>
    )}
  }

  export default RulesSectionWrapper;
