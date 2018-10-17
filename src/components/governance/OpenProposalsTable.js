import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import moment from 'moment-timezone'
import Tooltip from '../Tooltip'
import ParameterizerService from '../../services/parameterizer'
import GovernanceChallengeContainer from './GovernanceChallengeContainer'
import GovernanceVoteCommitContainer from './GovernanceVoteCommitContainer'
import GovernanceVoteRevealContainer from './GovernanceVoteRevealContainer'
import CountdownSnapshot from '../CountdownSnapshot'
import PubSub from 'pubsub-js'
import './OpenProposalsTable.css'

class OpenProposalsTable extends Component {
  constructor(props) {
    super()
    this.state = {
      open: false,
      table: '',
      loading: true,
      selectedProposal: {
        appExpiry: '',
        name: '',
        minDeposit: '',
        proposedValue: ''
      }
    }
    this.close = this.close.bind(this)
  }

  async componentWillReceiveProps() {
    if (!this.props || !this.props.hasOwnProperty('currentProposals')) {
      return false
    }
    if (this.props.currentProposals.length > 0) {
      await this.createTable()
    }
  }
  componentDidMount() {
    this._isMounted = true
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { open } = this.state
    return (
      <div className='BoxFrame mt-25 RegistryGuideOpenProposals'>
        <span className='BoxFrameLabel ui grid'>OPEN PROPOSALS <Tooltip info={'These are open proposals for new parameter values.'} /></span>
        {
          this.props.currentProposalsLoading
            ? <table className='OpenProposalsTable mt-25'>
              <thead>
                <tr>
                  <th>Parameters</th>
                  <th>Proposed Value</th>
                  <th>Time Remaining</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className={'ui loader small inline active'} />
            </table>
            : this.state.table
              ? <table className='OpenProposalsTable mt-25'>
                <thead>
                  <tr>
                    <th>Parameters</th>
                    <th>Proposed Value</th>
                    <th>Time Remaining</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.table}
                </tbody>
              </table>
              : <div>
                <table className='OpenProposalsTable mt-25'>
                  <thead>
                    <tr>
                      <th>Parameters</th>
                      <th>Proposed Value</th>
                      <th>Time Remaining</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                </table>
                <div className='NoDataMessage' style={{ paddingTop: '9em', minHeight: '300px' }}>
                  Proposed parameter values will be displayed here. You will have the opportunity to challenge, vote, and reveal from this table.
                </div>
              </div>
        }
        <Modal size={'small'} open={open} onClose={this.close}>
          <div>
            {
              this.getModal(this.state.selectedProposal.stage)
            }
          </div>
        </Modal>
      </div>
    )
  }

  getModal(stage) {
    if (stage === 'InApplication') {
      return <GovernanceChallengeContainer proposal={this.state.selectedProposal} {...this.props} />
    } else if (stage === 'InCommit') {
      return <GovernanceVoteCommitContainer proposal={this.state.selectedProposal} {...this.props} />
    } else if (stage === 'InReveal') {
      return <GovernanceVoteRevealContainer proposal={this.state.selectedProposal} {...this.props} />
    } else {
      return []
    }
  }

  createTable() {
    let table = []

    try {
      if (this.props.currentProposals.length > 0) {
        return this.props.currentProposals.map(async (proposal, i) => {

          const {
            commitEndDate,
            revealEndDate
          } = await this.getPoll(proposal.propId, proposal.challengeId)

          let time

          if (commitEndDate > Date.now() / 1000) {
            time = commitEndDate
          }
          else if (revealEndDate > Date.now() / 1000) {
            time = revealEndDate
          }
          else {
            time = proposal.appExpiry
          }

          return this.determineAction(proposal).then(async item => {
            table.push(
              <tr className='table-row' key={i}>
                <td className={proposal.color}>{proposal.normalizedName}</td>
                <td>{`${proposal.proposedValue + ' ' + proposal.metric}`}</td>
                <td><CountdownSnapshot endDate={time} /></td>
                {item}
              </tr>
            )
            if (this._isMounted) {
              this.setState({ table })
            }
          })
        })
      }
    } catch (error) {
      console.log('Error creating table')
    }
  }

  async determineAction(proposal) {
    let action = {
      event: '',
      class: '',
      label: ''
    }

    const propId = proposal.propId
    const challengeOpen = (proposal.challengeId === 0 && proposal.appExpiry && proposal.appExpiry > Date.now() / 1000)

    let commitOpen = await ParameterizerService.commitStageActive(propId)
    let revealOpen = await ParameterizerService.revealStageActive(propId)

    if (commitOpen) {
      action.class = 'ui mini button blue'
      action.label = 'VOTE'
      proposal.stage = 'InCommit'
      action.event = () => { this.promptModal('commit', proposal) }
    } else if (revealOpen) {
      action.class = 'ui mini button green'
      action.label = 'REVEAL'
      proposal.stage = 'InReveal'
      action.event = () => { this.promptModal('reveal', proposal) }
    } else if (challengeOpen) {
      action.class = 'ui mini button red challenge'
      action.label = 'CHALLENGE'
      action.event = () => { this.promptModal('challenge', proposal) }
      proposal.stage = 'InApplication'
    } else if (proposal) {
      action.class = 'ui mini button greyblack refresh'
      action.label = 'REFRESH'
      proposal.stage = 'InApplication'
      action.event = () => {
        try {
          let transactionInfo = {
            src: 'proposal_refresh',
            title: 'Refresh'
          }
          PubSub.publish('TransactionProgressModal.open', transactionInfo)
          ParameterizerService.processProposal(propId)
        } catch (error) {
          console.error(error)
          PubSub.publish('TransactionProgressModal.error')
        }
      }
    } else {
      action.class = 'ui mini button hide'
      action.label = ' '
      proposal.stage = ' '
      action.event = null
      console.log('proposal not found')
    }
    if (this._isMounted) {

      this.setState({ loading: false })
    }
    return (
      <td>
        <a onClick={() => { action.event() }} name={propId} className={action.class}>
          {action.label}
        </a>
      </td>
    )
  }

  async getPoll(propId, challengeId) {
    try {
      const {
        commitEndDate,
        revealEndDate
      } = await ParameterizerService.getChallengePoll(challengeId, String(propId))

      return {
        commitEndDate,
        revealEndDate
      }
    } catch (error) {
      return {
        commitEndDate: null,
        revealEndDate: null
      }
    }
  }

  promptModal(type, proposal) {
    this.show()
    if (this._isMounted) {
      this.setState({
        selectedProposal: proposal
      })
    }
  }

  isExpired(row) {
    const now = moment().unix()
    const end = row._original.stageEndsTimestamp

    if (!end) return false
    return end < now
  }

  show() {
    if (this._isMounted) {
      this.setState({ open: true })
    }
  }

  close() {
    if (this._isMounted) {
      this.setState({ open: false })
    }
  }
}

export default OpenProposalsTable
