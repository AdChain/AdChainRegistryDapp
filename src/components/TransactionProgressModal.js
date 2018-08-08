import React, { Component } from 'react'
import Button from 'antd/lib/button'
import Steps from 'antd/lib/steps'
import 'antd/lib/button/style/css'
import 'antd/lib/steps/style/css'
import { Modal, Loader } from 'semantic-ui-react'
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
      title: '',
      status: null,
      stepClass: null,
      transactionComplete: false,
      closeOnLastTransaction: false,
      txHash: null,
      intervalId: 0
    }

    this.open = this.open.bind(this)
    this.next = this.next.bind(this)
    this.close = this.close.bind(this)
    this.error = this.error.bind(this)
  }

  next (topic, transactionInfo) {
    let src = transactionInfo.src
    const current = this.state.current + 1

    if (!this.steps[src][current + 1]) {
      this.setState({
        closeOnLastTransaction: true
      })
    }

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
    clearInterval(this.state.intervalId)
    window.localStorage.removeItem('txHash')

    this.setState({
      open: false,
      src: '',
      title: '',
      stepClass: null,
      current: 0,
      closeOnLastTransaction: false,
      txHash: null,
      intervalId: 0
    })
  }

  error () {
    this.setState({
      src: 'error',
      current: 0,
      title: 'Transaction Taking Too Long?',
      transactionComplete: true,
      closeOnLastTransaction: false
    })
  }

  open (topic, transactionInfo) {
    const intervalId = setInterval(() => {
      const txHash = window.localStorage.getItem('txHash')
      if (txHash) {
        this.setState({ txHash })
      }
    }, 2e3)

    this.setState({
      open: true,
      src: transactionInfo.src,
      title: transactionInfo.title,
      transactionComplete: false,
      status: null,
      stepClass: null,
      closeOnLastTransaction: false,
      intervalId: intervalId
    })

    if (this.steps[transactionInfo.src].length === 1) {
      this.setState({
        closeOnLastTransaction: true
      })
    }
  }

  pubsubSubscription () {
    this.openEvent = PubSub.subscribe('TransactionProgressModal.open', this.open)
    this.nextEvent = PubSub.subscribe('TransactionProgressModal.next', this.next)
    this.closeEvent = PubSub.subscribe('TransactionProgressModal.close', this.close)
    this.errorEvent = PubSub.subscribe('TransactionProgressModal.error', this.error)
  }

  componentWillMount () {
    this.pubsubSubscription()
  }

  render () {
    const { current, open, size, src, status, transactionComplete, title, closeOnLastTransaction, txHash } = this.state
    const Step = Steps.Step

    this.steps = {
      approved_application:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Submits the application to the adChain Registry contract</li>
    </ol>
  </div>
        }
      ],
      not_approved_application:
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
      not_approved_challenge:
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
      approved_challenge:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Submits the challenge to the adChain Registry contract</li>
    </ol>
  </div>
        }
      ],
      not_approved_vote:
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
      approved_vote:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Submits the Vote Commit to the adChain Registry contract</li>
    </ol>
  </div>
        }
      ],
      refresh:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt to update the status of the domain</b></p>
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
      ],
      ADT_approval:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Allows the adChain Registry contract to transfer ADT deposit from your account</li>
    </ol>
  </div>
        }
      ],
      conversion_to_voting_ADT:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='activeStep'>Allows the registry's PLCR contract to transfer ADT from your wallet</li>
      <li className='nextStep'>Request voting rights from the registry's PLCR contract</li>
    </ol>
  </div>
        },
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='finishedStep'>Allows the registry's PLCR contract to transfer ADT from your wallet</li>
      <li className={this.state.stepClass}>Request voting rights from the registry's PLCR contract</li>
    </ol>
  </div>
        }
      ],
      withdraw_voting_ADT:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Withdraws Voting ADT from the registry's PLCR contract and returns them to your wallet</li>
    </ol>
  </div>
        }
      ],
      claim_reward:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Claims ADT reward from the registry contract and adds them to your wallet</li>
    </ol>
  </div>
        }
      ],
      unlock_expired_ADT:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Unlocks expired ADT from the registry's PLCR contract</li>
    </ol>
  </div>
        }
      ],
      withdraw_listing:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Removes listing from the registry contract and returns your deposit</li>
    </ol>
  </div>
        }
      ],
      not_approved_deposit_ADT:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='activeStep'>Allows the registry's PLCR contract to transfer ADT from your wallet</li>
      <li className='nextStep'>Deposit ADT to the registry's PLCR contract</li>
    </ol>
  </div>
        },
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='finishedStep'>Allows the registry's PLCR contract to transfer ADT from your wallet</li>
      <li className={this.state.stepClass}>Deposit ADT to the registry's PLCR contract</li>
    </ol>
  </div>
        }
      ],
      approved_deposit_ADT:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Deposit ADT to the registry's PLCR contract</li>
    </ol>
  </div>
        }
      ],
      withdraw_ADT:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Withdraws specified ADT amount from your listing's deposit in the registry contract</li>
    </ol>
  </div>
        }
      ],
      not_approved_vote_commit_for_parameter_proposal:
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
      approved_vote_commit_for_parameter_proposal:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Submits the Vote Commit to the adChain Registry contract</li>
    </ol>
  </div>
        }
      ],
      vote_reveal_for_parameter_proposal:
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
      ],
      not_approved_parameter_proposal_application:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='activeStep'>Allow adChain Registry contract to transfer adToken deposit from your account (if not done so already)</li>
      <li className='nextStep'>Submit proposal application to the Governance contract</li>
    </ol>
  </div>
        },
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='finishedStep'>Allow adChain Registry contract to transfer adToken deposit from your account (if not done so already)</li>
      <li className={this.state.stepClass}>Submits the parameter proposal application to the Governance contract</li>
    </ol>
  </div>
        }
      ],
      approved_parameter_proposal_application:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Submits the parameter proposal application to the Governance contract</li>
    </ol>
  </div>
        }
      ],
      not_approved_parameter_proposal_challenge:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='activeStep'>Allows the Governance contract to transfer ADT deposit from your account</li>
      <li className='nextStep'>Submits the parameter proposal challenge to the Governance contract</li>
    </ol>
  </div>
        },
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 2 MetaMask prompts:</b></p>
    <ol className='transaction-content-list'>
      <li className='finishedStep'>Allows the Governance contract to transfer ADT deposit from your account</li>
      <li className={this.state.stepClass}>Submits the parameter proposal challenge to the Governance contract</li>
    </ol>
  </div>
        }
      ],
      approved_parameter_proposal_challenge:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Submits the parameter proposal challenge to the Governance contract</li>
    </ol>
  </div>
        }
      ],
      claim_governance_reward:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Claims ADT reward from the Governance contract and adds them to your wallet</li>
    </ol>
  </div>
        }
      ],
      proposal_refresh:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>You will receive 1 MetaMask prompt:</b></p>
    <ol className='transaction-content-list'>
      <li className={this.state.stepClass}>Updating the status of the proposal in the Governance contract</li>
    </ol>
  </div>
        }
      ],
      error:
      [
        {
          content:
  <div className='transaction-content'>
    <p><b>This is because either:</b></p>
    <ol className='transaction-content-list'>
      <li className='activeStep'>Your TX will take longer than 3 minutes. Click "VIEW STATUS ON ETHERSCAN" to see estimated time</li>
      <li className='activeStep'>Someone has completed the transaction you are attempting</li>
      <li className='activeStep'>You are attempting to fund an action you don't have enough token to complete</li>
      <li className='activeStep'>You have failed to input data to complete the transaction</li>
    </ol>
  </div>
        }
      ]
    }
    try {
      return (
        <Modal
          size={size}
          open={open}
          onClose={() => this.close()}
          className='TransactionProgressModal'
          closeOnEscape={closeOnLastTransaction}
          closeOnRootNodeClick={closeOnLastTransaction}
          closeIcon={closeOnLastTransaction}>
          <div className='LoadingIconContainer'>
            {
              transactionComplete
                ? src === 'error'
                  ? <span role='img' aria-label='thinking' className='ErrorIcon'>🤔</span>
                  : null
                : <Loader indeterminate active inline='centered' />
            }
          </div>
          <Modal.Header className='TransactionProgressHeader'>
            {
              transactionComplete
                ? src === 'error'
                  ? <span>{title}</span>
                  : <span>{title} Successful!</span>
                : <span>{title} in Progress</span>
            }
          </Modal.Header>
          <Modal.Content>
            <div>
              <Steps current={current}>
                {
                  // possibly remove step icons once transaction complete
                  src && src !== 'error'
                    ? this.steps[src].map((item, idx) => <Step key={idx} status={status} />)
                    : null
                }
              </Steps>
              <div className='steps-content'>
                {
                  src
                    ? src === 'refresh' && transactionComplete
                      ? null
                      : this.steps[src][current].content
                    : null
                }
              </div>
              <div className='MetaMaskNote'>
                <br />
                {
                  transactionComplete
                    ? null
                    : <p>* Please click "SUBMIT" in your MetaMask extension. If a transaction seems stuck, check MetaMask and/or the transaction's Etherscan link for the current status.</p>
                }
              </div>
              <div className='StatusButtonContainer'>
                <br />
                {
                  txHash
                    ? transactionComplete && src !== 'error'
                      ? null
                      : <a rel='noopener noreferrer' target='_blank' href={`https://etherscan.io/tx/${txHash}`}>
                        <Button className='StatusButton'>View Status on Etherscan</Button>
                      </a>
                    : null
                }
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
    } catch (error) {
      console.log('error')
    }
  }
}

export default TransactionProgressModal
