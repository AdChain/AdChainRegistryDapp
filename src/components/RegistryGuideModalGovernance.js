import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalGovernance.css'
import { Redirect } from 'react-router-dom'

class RegistryGuideModalGovernance extends Component {
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
        title: 'First Step',
        text: 'Enter the domain you wish to apply. Make sure to use the domain.com format (no www.)',
        selector: '.RegistryGuideCoreParameters',
        position: 'right',
        type: 'click',
        trigger: '.HelpButton',
        isFixed: true,
        name: 'application-first-step',
        parent: 'SideBarApplicationContainer'
      },
      {
        title: 'Second Step',
        text: 'Enter the amount of adToken you wish to stake with your application',
        selector: '.RegistryGuideGovernanceParameters',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'application-second-step',
        parent: 'SideBarApplicationContainer'
      },
      {
        title: 'Third Step',
        text: 'With MetaMask unlocked, you\'ll be able to see your ETH and ADT balance here. Both ADT and ETH are needed to apply a Domain.',
        selector: '.RegistryGuideCreateProposal',
        position: 'bottom',
        type: 'click',
        isFixed: true,
        name: 'application-third-step',
        parent: 'MainTopBar'
      }
    ]

    return (
      <div>
        <Redirect to='/governance' />
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How do I Interact with the Governance Module?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
            The <b>Governance Module</b> empowers adToken holders to modify parameter values. Modifications to parameters affect the Registry as a whole and therefore affect all adToken holders. In light of this, we expect adToken holders to be diligent with respect to governance. There are two distinct categories of Parameters: <b>Core Parameters</b> and <b>Parameterizer Parameters</b>.
            </div>
            <br />
            <div>
              <b>Core Parameters</b> are the foundational building blocks of the adChain Registry. The values in the adChain Registry are defined by the Core Parameters and proposing modifications to Core Parameters is done via the Governance Module.
            </div>
            <br />
            <div>
            The <b>Parameterizer Parameters</b> determine the values for Proposals in the Governance Module.
            </div>
            <br />
            <div>
            For a step-by-step guide on how to interact with the governance module, please click on the "CONTINUE" button below:
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

export default RegistryGuideModalGovernance
