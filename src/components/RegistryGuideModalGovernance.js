import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalGovernance.css'

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
        title: 'Governance - First Step',
        text: 'The CORE PARAMETERS govern the adChain Registry. These values are what dictate interaction with the adChain Registry.',
        selector: '.RegistryGuideCoreParameters',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'governance-first-step',
        parent: 'GovernanceContainer'
      },
      {
        title: 'Governance - Second Step',
        text: 'The GOVERNANCE PARAMETERS dictate the values for the Governance Module. These values govern the process in proposing a new Governance Module value.',
        selector: '.RegistryGuideGovernanceParameters',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'governance-second-step',
        parent: 'GovernanceContainer'
      },
      {
        title: 'Governance - Third Step',
        text: 'The CREATE PROPOSALS box allows you to propose new values for both Core Parameters and Governance Parameters. If not challenged, the newly proposed parameter values are enacted.',
        selector: '.RegistryGuideCreateProposal',
        position: 'bottom',
        type: 'click',
        isFixed: true,
        name: 'governance-third-step',
        parent: 'GovernanceContainer'
      },
      {
        title: 'Governance - Fourth Step',
        text: 'The OPEN PROPOSALS box demonstrates all of the proposed parameter values for both CORE PARAMETERS and GOVERNANCE PARAMETERS. If an open proposal goes through the gApplyStageLength without being challenged, it is immediately implemented as a new parameter value.',
        selector: '.RegistryGuideOpenProposals',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'governance-fourth-step',
        parent: 'GovernanceContainer'
      },
      {
        title: 'Governance - Fifth Step',
        text: '',
        selector: '.RegistryGuideClaimRewards',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'governance-fifth-step',
        parent: 'GovernanceContainer'
      }
    ]

    return (
      <div>
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
