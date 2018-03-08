import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalChallengeDomain.css'

class RegistryGuideModalChallengeDomain extends Component {
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
        title: 'Challenge - First Step',
        text: 'You can use the DOMAIN FILTERS box to filter the displayed domains.',
        selector: '.DomainsFilterPanel',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'challenge-first-step',
        parent: 'DomainsContainer'
      },
      {
        title: 'Challenge - Second Step',
        text: 'The filtered domains are all In Application and have until the Stage Ends period to be challenged before they enter the adChain Registry.',
        selector: '.DomainsTable',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'challenge-second-step',
        parent: 'DomainsContainer'
      },
      {
        title: 'Challenge - Third Step',
        text: 'Click on the "CHALLENGE" button to challenge the domain application. This will automatically move the domain\'s application into Voting Commit.',
        selector: '.RegistryGuideStaticChallenge',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'challenge-third-step',
        parent: 'DomainsContainer'
      },
      {
        title: 'Challenge - Fourth Step',
        text: 'Not only can you challenge domains In Application, but you can also challenge domains that are already in the adChain Registry.',
        selector: '.RegistryGuideStaticInRegistry',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'challenge-fourth-step',
        parent: 'DomainsContainer'
      },
      {
        title: 'Challenge - Fifth Step',
        text: 'Simply click on "CHALLENGE" and initiate the voting stage. Domains In Registry that are challenged continue to be in the registry until the voting stage ends and the majority of ADT holders vote to remove the domain.',
        selector: '.RegistryGuideStaticInRegistry .ChallengeButton',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'challenge-fifth-step',
        parent: 'DomainsContainer'
      }
    ]

    return (
      <div>
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How Do I Challenge a Domain?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
            Challenging a domain is the universal right of every adToken holder. Challenges may be issued at any point during a domain’s lifecycle, that is to say, a challenge may be issued when a domain is In-Application or In-Registry.
            </div>
            <br />
            <div>
            Challenges help maintain quality in the adChain Registry.
            </div>
            <br />
            <div>
            For a step-by-step guide on how to challenge your domain, please click on the “CONTINUE” button below:
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

export default RegistryGuideModalChallengeDomain
