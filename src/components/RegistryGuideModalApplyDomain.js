import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import './RegistryGuideModalApplyDomain.css'

class RegistryGuideModalApplyDomain extends Component {
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
        title: 'Application - First Step',
        text: 'Enter the domain you wish to apply. Make sure to use the domain.com format (no www.)',
        selector: '.JoyrideForm',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'application-first-step',
        parent: 'SideBarApplicationContainer',
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
        title: 'Application - Second Step',
        text: 'Enter the amount of adToken you wish to stake with your application',
        selector: '.ApplicationContainer',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'application-second-step',
        parent: 'SideBarApplicationContainer',
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
        title: 'Application - Third Step',
        text: 'With MetaMask unlocked, you\'ll be able to see your ETH and ADT balance here. Both ADT and ETH are needed to apply a Domain.',
        selector: '.JoyrideTopBar',
        position: 'bottom',
        type: 'click',
        isFixed: true,
        name: 'application-third-step',
        parent: 'MainTopBar',
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
        title: 'Application - Fourth Step',
        text: 'With all of the fields filled out, and enough ETH to cover the transaction, you will have successfully applied a domain.',
        selector: '.ApplicationContainer',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'application-fourth-step',
        parent: 'SideBarApplicationContainer',
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
        title: 'Application - Fifth Step',
        text: 'Once the transactions are signed, your applied domain can be found in the DOMAINS box.',
        selector: '.DomainsTable',
        position: 'left',
        type: 'click',
        isFixed: true,
        name: 'application-fifth-step',
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
        title: 'Application - Sixth Step',
        text: 'Within your Dashboard, you can also track your domain\'s application into the adChain Registry',
        selector: '.RegistryGuideStaticDashboard',
        position: 'right',
        type: 'click',
        isFixed: true,
        name: 'application-sixth-step',
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
        <Modal.Header className='RegistryGuideModalHeader'><span className='RegistryGuideModalHeaderText'>How Do I Apply a Domain into the adChain Registry?</span></Modal.Header>
        <Modal.Content>
          <div className='GuideDesc'>
            <div>
            By applying your domain into the adChain Registry as a publisher, you will be able to access premium advertising campaign spend.
            </div>
            <br />
            <div>
            The adChain Registry is not structured as a pay-to-play (as most domain whitelists are), but instead allows the domain owners the ability to withdraw their listing once in the adChain Registry.
            </div>
            <br />
            <div>
            For a step-by-step guide on how to apply your domain, please click on the “CONTINUE” button below:
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

export default RegistryGuideModalApplyDomain
