import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import moment from 'moment-timezone'
import Tooltip from '../Tooltip'
import ParamterizerService from '../../services/parameterizer'
import GovernanceChallengeContainer from './GovernanceChallengeContainer'
import GovernanceVoteCommitContainer from './GovernanceVoteCommitContainer'
import GovernanceVoteRevealContainer from './GovernanceVoteRevealContainer'
import CountdownSnapshot from '../CountdownSnapshot'
import './OpenProposalsTable.css'

class OpenProposalsTable extends Component {
  constructor () {
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

  async componentWillReceiveProps () {
    if (!this.props || !this.props.hasOwnProperty('currentProposals')) {
      return false
    }
    if (this.props.currentProposals.length > 0) {
      await this.createTable()
    }
  }

  render () {
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
                  { this.state.table }
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
                <div className='NoDataMessage' style={{paddingTop: '9em', minHeight: '300px'}}>
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

  getModal (stage) {
    if (stage === 'InApplication') {
      return <GovernanceChallengeContainer proposal={this.state.selectedProposal} {...this.props} />
    } else if (stage === 'InCommit') {
      return <GovernanceVoteCommitContainer proposal={this.state.selectedProposal} {...this.props} />
    } else if (stage === 'InReveal') {
      console.log('InReveal')
      return <GovernanceVoteRevealContainer proposal={this.state.selectedProposal} {...this.props} />
    } else {
      return []
    }
  }

  createTable () {
    let table = []
    try {
      if (this.props.currentProposals.length > 0) {
        return this.props.currentProposals.map((proposal, i) => {
          return this.determineAction(proposal).then(async item => {
            table.push(
              <tr className='table-row' key={i}>
                <td className={proposal.color}>{proposal.name}</td>
                <td>{`${proposal.proposedValue + ' ' + proposal.metric}`}</td>
                <td><CountdownSnapshot endDate={proposal.appExpiry} /></td>
                {item}
              </tr>
            )
            this.setState({table})
          })
        })
      }
    } catch (error) {
      console.log('Error creating table')
    }
  }

  async determineAction (proposal) {
    let action = {
      event: '',
      class: '',
      label: ''
    }

    const propId = proposal.propId
    const challengeOpen = (proposal.challengeId === 0 && proposal.appExpiry && proposal.appExpiry > Date.now() / 1000)

    let commitOpen = await ParamterizerService.commitStageActive(propId)
    let revealOpen = await ParamterizerService.revealStageActive(propId)

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
      action.label = 'REFRESH STATUS'
      proposal.stage = 'InApplication'
      action.event = () => { ParamterizerService.processProposal(propId) }
    } else {
      action.class = 'ui mini button hide'
      action.label = ' '
      proposal.stage = ' '
      action.event = null
      console.log('proposal not found')
    }
    this.setState({loading: false})

    return (
      <td>
        <a onClick={() => { action.event() }} name={propId} className={action.class}>
          {action.label}
        </a>
      </td>
    )
  }

  promptModal (type, proposal) {
    this.show()
    this.setState({
      selectedProposal: proposal
    })
  }

  isExpired (row) {
    const now = moment().unix()
    const end = row._original.stageEndsTimestamp

    if (!end) return false
    return end < now
  }

  show () {
    this.setState({ open: true })
  }

  close () {
    this.setState({ open: false })
  }
}

export default OpenProposalsTable
