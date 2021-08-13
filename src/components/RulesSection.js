import React, { Component } from 'react';
import './RulesSection.css';

class Hand extends Component {
  constructor(props) {
    super(props);
    this.render.bind(this);
    this.targetTokens = 4;
    this.maxTokens = 5;
  }

  // TODO ability to show rules anytime? (Maybe pop-up)
  // TODO Ability to change some core settings

  render = () => {
    return (
      <div className="rulesSection" data-testid="rules-section">
        <div className="odd">
          <h3 className="rules-header">Rules</h3>
        </div>
        <div className="odd">
          <h4 className="rules-header">Introduction</h4>
          <p className="rules-p">Welcome to Straight 5, a rummy-like, yahtzee-like card game! This is the (work-in-progress) digitial version of the (hopefully future) Straight 5 game. </p>
        </div>

        <div className="even">
          <h4 className="rules-header">Winning</h4>
          <p className="rules-p">
          The first player to claim {this.targetTokens} out of {this.maxTokens} tokens below wins.</p>
          <ul>
            <li>Three in a row</li>
            <li>Four in a row</li>
            <li>Five in a row</li>
            <li>Three of a kind</li>
            <li>Full House</li>
          </ul>
        </div>
        <div className="odd">
          <h4 className="rules-header">Set up</h4>
          <p className="rules-p">Each player begins with 5 cards face-down in front of them.
          The top card of the deck will be turned over as a discard</p>
        </div>
        <div className="even">
          <h4 className="rules-header">Turn Order</h4>
          <p className="rules-p">Each consists of three phases:</p>
          <ol>
            <li><h4 className="phaseHeader">Draw Phase:</h4> draw the top card of the deck or discard piles</li>
            <li><h4 className="phaseHeader">Play Phase:</h4> in this phase you can either place the card you drew in front or discard your to:
              <ul>
                <li> Turn up to two cards face-up</li>
                <li> Swap any two cards </li>
              </ul>
            </li>
            <li><h4 className="phaseHeader">Token Phase</h4>: if you have the cards face-up you may choose to discard them to claim a token.</li>
          </ol>
        </div>
        <div className="odd">
          <h4 className="rules-header">Rule Clarifications</h4>
          <p className="rules-p">Here are some clarifications on rules above:</p>
          <ol>
            <li>When you place the drawn card in front of you, you do not get to take another action</li>
            <li>You can only claim each token once</li>
            <li>The cards to claim the tokens for the straights (3/4/5 in a row) must be adjacent and in ascending order (e.g. 1 2 3 not 3 2 1 or 1 3 2)</li>
            <li>The cards to claim the tokens for three of a kind and full house can be anywhere</li>
          </ol>
        </div>
        <div className="even">
          <h4 className="rules-header">Final notes</h4>
          <p className="rules-p">If you find any bugs or issues with Straight 5 please submit an issue by <a href="https://github.com/andyrewwer/straight5/issues">clicking here</a> or you can email me at <a href="mailto:a.andyrewwer@gmail.com?subject = Feedback on Straight 5">a.andyrewwer@gmail.com.</a> Also feel free to email me with other thoughts/feedback/concerns (about the game or otherwise)!</p>
        </div>

      </div>
  )}
}

export default Hand;
