import React, { Component } from 'react'
import { Modal, Button, Checkbox } from 'semantic-ui-react'
import { ChallengeSteps, CommitSteps, RevealSteps } from '../registry_guide/WalkthroughSteps'
import './IndividualGuideModal.css'
import PubSub from 'pubsub-js'

class IndividualGuideModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      steps: props.steps, // ChallengeGuide, CommitGuide, RevealGuide
      modalOpen: props.open 
    }
    this.doNotDisplay = this.doNotDisplay.bind(this)
    this.close = this.close.bind(this)
    this.launchGuide = this.launchGuide.bind(this)
  }

  doNotDisplay () {
    const { steps } = this.state
    let doNotDisplay = JSON.parse(window.localStorage.getItem(steps))
    window.localStorage.setItem(steps, !doNotDisplay)
  }

  close () {
    this.setState({ modalOpen: false })
  }

  async launchGuide (guideSteps) {
    // closes the transaction modal just in case it's open
    PubSub.publish('TransactionProgressModal.close')
    // prevents welcome modal from displaying
    window.localStorage.setItem('returningUser', 'true')

    PubSub.publish('MainSidebar.PushHistory', './')
    PubSub.publish('RegistryGuideModal.redirect', window.location.pathname)
    // temporarily using set timeout in order to create a short delay.. without delay, joyride misses the first component. need to figure out a better way
    setTimeout(() => {
      PubSub.publish('RegistryGuideModal.startRegistryWalkthrough', guideSteps)
    }, 500)
  }

  render () {
    const { steps, modalOpen } = this.state
    // display different content based on steps

    return (
      <Modal size={'small'} open={modalOpen} closeIcon className='IndividualGuideModal' onClose={this.close}>

        <Modal.Header className='RegistryGuideModalHeader'>
          {
            steps === 'ChallengeGuide'
              ? <span className='RegistryGuideModalHeaderText'>How do I Challenge a Domain?</span>
              : steps === 'RevealGuide'
                ? <span className='RegistryGuideModalHeaderText'>How do I Reveal a Vote?</span>
                : steps === 'CommitGuide'
                  ? <span className='RegistryGuideModalHeaderText'>How do I Commit a Vote?</span>
                  : <span className='RegistryGuideModalHeaderText'>Registry Guide</span>
          }
        </Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            {
              steps === 'ChallengeGuide'
                ? <div>
                  <div>
                You, as an ADT holder, are eligible to challenge both domains In Application and In Registry. Challenging a domain requires you to stake the existing minDeposit amount.
                You are subject to winning a percentage of the domain’s staked ADT if your challenge is successful, but are also subject to losing all of your ADT used in the challenge if your challenge is unsuccessful. Therefore, you should only challenge a domain
                if you believe that the rest of the ADT holders will agree with you that the domain shouldn’t be in the adChain Registry.
                  </div>
                  <br />
                  <div>
                Below is a guide to walk you through the steps in challenging a domain:
                  </div>
                  <div className='ButtonContainer'>
                    <Button basic className='ContinueButton' content='How Do I Challenge a Domain' onClick={() => this.launchGuide(ChallengeSteps)} />
                  </div>
                </div>
                : steps === 'RevealGuide'
                  ? <div>
                    <div>
                  After you have committed a vote for a domain, you’ll need to reveal it in order to have it counted. You can only reveal a vote if you previously committed one. Don’t worry if you forget to reveal your committed vote. You can get your ADT back from within your dashboard once the voting has concluded for the domain.
                  In order to reveal a vote, you will need either (i) the commit JSON file or (ii) the challenge id, secret phrase, and vote option.
                    </div>
                    <br />
                    <div>
                  Below is a guide to walk you through the steps in revealing a previously committed vote:
                    </div>
                    <div className='ButtonContainer'>
                      <Button basic className='ContinueButton' content='How Do I Reveal a Vote' onClick={() => this.launchGuide(RevealSteps)} />
                    </div>
                  </div>
                  : steps === 'CommitGuide'
                    ? <div>
                      <div>
                    After a challenge has been initiated on a domain, every ADT holder is eligible to vote for a domain. Your votes for a domain will count towards you supporting or opposing the domain’s application into the adChain Registry. Therefore, if you vote SUPPORT, you want the domain in the adChain Registry. If you vote OPPOSE, you do not want the domain in the adChain Registry. All votes are token-weighted and the winner is determined by the number of ADT on the winning side, not the amount of people voting.
                      </div>
                      <br />
                      <div>
                    Voting does not put your ADT in danger. Therefore, vote judiciously and with the peace of mind that you will not lose your ADT if vote incorrectly.
                      </div>
                      <br />
                      <div>
                    If you vote on the winning side, you will be rewarded based on the amount of ADT you contributed towards the winning side. Below is a guide to walk you through the steps in committing a vote for a domain:
                      </div>
                      <br />
                      <div className='ButtonContainer'>
                        <Button basic className='ContinueButton' content='How Do I Commit a Vote' onClick={() => this.launchGuide(CommitSteps)} />
                      </div>
                    </div>
                    : null

            }

            <div className='GuideText'>
              <span>
              Can’t find what you’re looking for? Click <a href='https://metax.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
              </span>
              <Checkbox label="I don't want to see this again" onClick={() => this.doNotDisplay()} />
            </div>
          </div>
        </Modal.Content>
      </Modal>
    )
  }
}

export default IndividualGuideModal
