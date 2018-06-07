import React, { Component } from 'react'
import { Modal, Button, Checkbox } from 'semantic-ui-react'
import './RegistryGuideModalGovernance.css'
import { GovernanceSteps } from './WalkthroughSteps'
import PubSub from 'pubsub-js'

class RegistryGuideModalGovernance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      section: props.section,
      src: props.src
    }
    this.doNotDisplay = this.doNotDisplay.bind(this)
    this.launchGuide = this.launchGuide.bind(this)
  }

  doNotDisplay () {
    let doNotDisplay = JSON.parse(window.localStorage.getItem('GovernanceModalDisplay'))
    window.localStorage.setItem('GovernanceModalDisplay', !doNotDisplay)
  }

  async launchGuide () {
    PubSub.publish('RegistryGuideModal.redirect', window.location.pathname)
    PubSub.publish('RegistryGuideModal.startRegistryWalkthrough', GovernanceSteps)
  }

  render () {
    const { section, src } = this.state
    // even if do not display is true, it still needs to be displayed when coming from the registry guide
    // if !src, then it comes from registry guide

    return (
      <div className='RegistryGuideModalGovernance'>
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How do I Interact with the Governance Module?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
          The <b>Governance Module</b> empowers adToken holders to modify parameter values. Modifications to parameters affect the Registry as a whole and therefore affect all adToken holders. In light of this, we expect adToken holders to be diligent with respect to governance. There are two distinct categories of Parameters: <b>Core Parameters</b> and <b>Governance Parameters</b>.
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
            { !src
              ? <Button basic className='ReturnButton' onClick={() => this.props.returnToMenu(section)} content='Return to Guide' />
              : null
            }
            <Button basic className='ContinueButton' content='Continue' onClick={() => this.launchGuide()} />
          </div>
          <div className='GuideText'>
            <span>
          Can’t find what you’re looking for? Click <a href='https://metax.zendesk.com/hc/en-us' target='_blank' rel='noopener noreferrer'>here</a> to visit the help center.
            </span>
            { !src
              ? null
              : <Checkbox label="I don't want to see this again" onClick={() => this.doNotDisplay()} />
            }
          </div>
        </Modal.Content>
      </div>
    )
    
  }
}

export default RegistryGuideModalGovernance
