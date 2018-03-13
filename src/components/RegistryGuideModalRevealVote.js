import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalRevealVote.css'

class RegistryGuideModalRevealVote extends Component {
  constructor (props) {
    super(props)
    this.state = {
      section: props.section
    }
    this.onContinue = this.onContinue.bind(this)
  }

  render () {
    const { section } = this.state

    const walkthroughSteps = [
      {
        title: 'Reveal - First Step',
        text: 'You can use the DOMAIN FILTERS box to filter the domains that are in the Voting Reveal stage.',
        selector: '.DomainsFilterPanel',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'reveal-first-step',
        parent: 'DomainsContainer',
        style: {
          backgroundColor: '#3434CE',
          textAlign: 'left',
          width: '29rem',
          main: {
            padding: '20px'
          },
          footer: {
            display: 'block'
          },
          close: {
            color: '#FFF'
          }
        }
      },
      {
        title: 'Reveal - Second Step',
        text: 'The filtered domains are all in the Voting Reveal stage. Voters have until the Stage Ends period to reveal their votes.',
        selector: '.DomainsTable',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'reveal-second-step',
        parent: 'DomainsContainer',
        style: {
          backgroundColor: '#3434CE',
          textAlign: 'left',
          width: '29rem',
          main: {
            padding: '20px'
          },
          footer: {
            display: 'block'
          },
          close: {
            color: '#FFF'
          }
        }
      },
      {
        title: 'Reveal - Third Step',
        text: 'Revealed votes are outlined here. If you choose not to reveal your votes, then it will not be counted.',
        selector: '.RegistryGuideStaticReveal',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'reveal-third-step',
        parent: 'DomainsContainer',
        style: {
          backgroundColor: '#3434CE',
          textAlign: 'left',
          width: '29rem',
          main: {
            padding: '20px'
          },
          footer: {
            display: 'block'
          },
          close: {
            color: '#FFF'
          }
        }
      },
      {
        title: 'Reveal - Fourth Step',
        text: 'To reveal your previously committed vote, you can either: (1) upload the downloaded Commit JSON file or (2) enter the Secret Phrase, Challenge ID, and your vote option. Once you\'ve done either, press "REVEAL VOTE" and sign the MetaMask transaction.',
        selector: '.RegistryGuideStaticReveal .LeftSegment',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'reveal-fourth-step',
        parent: 'DomainsContainer',
        style: {
          backgroundColor: '#3434CE',
          textAlign: 'left',
          width: '29rem',
          main: {
            padding: '20px'
          },
          footer: {
            display: 'block'
          },
          close: {
            color: '#FFF'
          }
        }
      }
    ]
    return (
      <div>
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How Do I Reveal a Vote?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
            Once the Voting Commit stage ends, the Voting Reveal stage begins. The Voting Reveal stage is when you will reveal your vote to the public. Only previously committed votes can revealed.
            </div>
            <br />
            <div>
            Votes revealed during this stage will be tallied up and counted to determine whether the domain Applicant or Challenger has won the vote, and therefore wether or not the domain is admitted to the adChain Registry.
            </div>
            <br />
            <div>
            For a step-by-step guide on how to reveal a vote, please click on the “CONTINUE” button below:
            </div>
          </div>
          <div className='GuideButtonsContainer'>
            <Button basic className='ReturnButton' onClick={() => this.props.returnToMenu(section)} content='Return to Guide' />
            <Button basic className='ContinueButton' content='Continue' onClick={() => this.onContinue(walkthroughSteps)} />
          </div>
          <div className='GuideText'>
          Can’t find what you’re looking for? Click <a href='https://adchain.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
          </div>
        </Modal.Content>
      </div>
    )
  }
  onContinue (steps) {
    this.props.close()
    this.props.startJoyride(steps)
  }
}

export default RegistryGuideModalRevealVote
