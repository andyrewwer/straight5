import React, { Component } from 'react';
import './RulesSectionWrapper.css';
import RulesSection from './RulesSection.js';
import Modal from 'react-modal';

class RulesSectionWrapper extends Component {
  constructor(props) {
    super(props);
    this.maxTokens = 5; //TODO tokens to select and count should be a config
    this.state = {
      'modelIsOpen': false
    }
    this.render.bind(this);
  }

  customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '400px',
      maxHeight: '80vh'
    },
  };

  render () {
    const openModal = () => {
      this.setState({'modelIsOpen': true})
    }

    const closeModal = () => {
      this.setState({'modelIsOpen': false})
    }
    return (
      <div>
        <div className="open-modal-container" id="modal-div">
          <div className="open-modal-content">
            <button className="small-width-button" data-testid="open-modal-button" onClick={openModal}>Rules</button>
          </div>
        </div>
        <Modal
          isOpen={this.state.modelIsOpen}
          onRequestClose={closeModal}
          style={this.customStyles}
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
