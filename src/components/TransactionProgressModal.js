import React, { Component } from 'react'
import Button from 'antd/lib/button'
import Steps from 'antd/lib/steps'
import 'antd/lib/button/style/css'
import 'antd/lib/steps/style/css'
import { Modal, Loader, Icon } from 'semantic-ui-react'
import './TransactionProgressModal.css'
import PubSub from 'pubsub-js'

class TransactionProgressModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      open: false,
      size: 'small',
      src: '',
      status: null,
      stepClass: null,
      transactionComplete: false
    }

    this.open = this.open.bind(this)
    this.next = this.next.bind(this)
  }

  next (topic, src) {
    const current = this.state.current + 1
    if (this.steps[src][current]) {
      this.setState({
        current,
        stepClass: 'activeStep'
      })
    } else {
      this.setState({
        status: 'finish',
        stepClass: 'finishedStep',
        transactionComplete: true
      })
    }
  }
  close () {
    this.setState({ open: false })
  }

  open (topic, src) {
    this.setState({
      open: true,
      src: src,
      transactionComplete: false,
      status: null,
      stepClass: null
    })
  }

  componentWillMount () {
    this.openEvent = PubSub.subscribe('TransactionProgressModal.open', this.open)
    this.nextEvent = PubSub.subscribe('TransactionProgressModal.next', this.next)
  }

  render () {
    const { current, open, size, src, status, transactionComplete } = this.state
    const Step = Steps.Step

    this.steps = {
      application:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='activeStep'>Allows the adChain Registry contract to transfer ADT deposit from your account</li>
      <li className='nextStep'>Submits the application to the adChain Registry contract</li>
    </ol>
  </div>
        },
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='finishedStep'>Allows the adChain Registry contract to transfer ADT deposit from your account</li>
      <li className={this.state.stepClass}>Submits the application to the adChain Registry contract</li>
    </ol>
  </div>
        }
      ],
      challenge:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='activeStep'>Allows the adChain Registry contract to transfer ADT deposit from your account</li>
      <li className='nextStep'>Submits the challenge to the adChain Registry contract</li>
    </ol>
  </div>
        },
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='finishedStep'>Allows the adChain Registry contract to transfer ADT deposit from your account</li>
      <li className={this.state.stepClass}>Submits the challenge to the adChain Registry contract</li>
    </ol>
  </div>
        }
      ],
      vote:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 3 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='activeStep'>Allows the registry's PLCR contract to transfer ADT from your wallet</li>
      <li className='nextStep'>Request voting rights from the registry's PLCR contract</li>
      <li className='nextStep'>Submits vote to the registry's PLCR contract</li>
    </ol>
  </div>
        },
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 3 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='finishedStep'>Allows the registry's PLCR contract to transfer ADT from your wallet</li>
      <li className='activeStep'>Request voting rights from the registry's PLCR contract</li>
      <li className='nextStep'>Submits vote to the registry's PLCR contract</li>
    </ol>
  </div>
        },
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 3 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='finishedStep'>Allows the registry's PLCR contract to transfer ADT from your wallet</li>
      <li className='finishedStep'>Request voting rights from the registry's PLCR contract</li>
      <li className={this.state.stepClass}>Submits vote to the registry's PLCR contract</li>
    </ol>
  </div>
        }
      ],
      refresh:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt to either:</b></p>
    <ul className='transaction-content-list'>
      <li className={this.state.stepClass}>Admit the domain into the registry if unchallenged</li>
      <li className='ListSpacer'>OR</li>
      <li className={this.state.stepClass}>Resolve the challenge and either admits the domain into the registry or rejects the domain from the registry, depending on the voting outcome</li>
    </ul>
  </div>
        }
      ],
      reveal:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Submits Reveal to the registry's PLCR contract</li>
    </ol>
  </div>
        }
      ]
    }

    return (
      <Modal
        size={size}
        open={open}
        onClose={() => this.close()}
        className='TransactionProgressModal'
        closeOnEscape={false}
        closeOnRootNodeClick={false}>
        <div className='LoadingIconContainer'>
          {
            transactionComplete
              ? <Icon name='check circle' size='huge' className='CheckCircle' />
              : <Loader indeterminate active inline='centered' />
          }
        </div>
        <Modal.Header className='TransactionProgressHeader'>
          {
            transactionComplete
              ? <span>{src} Successful!</span>
              : <span>{src} in Progress</span>
          }
        </Modal.Header>
        <Modal.Content>
          <div>
            <Steps current={current}>
              {
                // possibly remove step icons once transaction complete
                src
                  ? this.steps[src].map((item, idx) => <Step key={idx} status={status} />)
                  : null
              }
            </Steps>
            <div className='steps-content'>
              {
                src
                  ? this.steps[src][current].content
                  : null
              }
            </div>
            <div className='MetaMaskNote'>
              {
              // possibly remove this message once transaction complete
              }
            * If a transaction is stuck, you can check your MetaMask status
            </div>
            <div className='steps-action'>
              {
                transactionComplete
                  ? <Button className='TransactionProgressClose' onClick={() => this.close()}>Close</Button>
                  : null
              }
            </div>
          </div>
        </Modal.Content>
      </Modal>
    )
  }
}

export default TransactionProgressModal
