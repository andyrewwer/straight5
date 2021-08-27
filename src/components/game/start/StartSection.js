import React, { Component } from 'react';
import './StartSection.css';
import GameConfigurationSection from './GameConfigurationSection.js';
import {customStyles} from '../../../Styles.js'
import Modal from 'react-modal';

class StartSection extends Component {
  constructor(props) {
    super(props);
    this.TableCanvas = React.createRef();
    this.state = {
      modalIsOpen: false
    }
    this.render.bind(this);
  }

  render = () => {
    const openModal = () => {
      this.setState({modalIsOpen: true})
    }

    const closeModal = () => {
      this.setState({modalIsOpen: false})
    }
    return (
      <div className="start-section-container">
        <div>
          <button data-testid="start-section-hide-show-configuration-button" onClick={openModal}>Show Configuration</button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          ariaHideApp={false}>
          <div className="configuration-modal-container">
            <h2 className="mb-4">Configuration Settings</h2>
            <div className="start-section-slider-container" data-testid="start-section-slider-container">
              <GameConfigurationSection configService={this.props.configService}/>
            </div>
            <div className="close-modal-container">
              <div className="close-modal-content">
                <button className="open-modal-button" data-testid="close-modal-button" onClick={this.props.startNewGameCallback}>Start New Game</button>
              </div>
            </div>
          </div>
        </Modal>
        <div className="mb-4 mt-2">
          <button className="small-width-button" data-testid="startButton" onClick={this.props.startNewGameCallback}>Start New Game</button>
        </div>
      </div>
    )
  }
}

export default StartSection;
