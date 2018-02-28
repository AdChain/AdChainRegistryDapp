import React, { Component } from 'react'
// import commafy from 'commafy'
import { Modal } from 'semantic-ui-react'
import './OpenProposalsTable.css'
import moment from 'moment-timezone'
import GovernanceChallengeContainer from './GovernanceChallengeContainer'
import ParamterizerService from '../services/parameterizer'

class OpenProposalsTable extends Component {
  constructor () {
    super()
    this.state = {
      open: false,
      size: 'mini',
      selectedProposal: null
    }
    this.close = this.close.bind(this)
  }

  show (size) {
    this.setState({ size, open: true })
  }

  close () {
    this.setState({ open: false })
  }

  render () {
    if (this.props.currentProposals.length < 1) return false
    const { open, size } = this.state

    return (
      <div className='BoxFrame mt-25'>
        <span className='BoxFrameLabel ui grid'>OPEN PROPOSALS</span>
        <table className='OpenProposalsTable mt-25'>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Proposed Value</th>
              <th>Proposal Ends</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.createTable()}
          </tbody>
        </table>
        <Modal size={size} open={open} onClose={this.close}>
          <div>
            <GovernanceChallengeContainer />
          </div>
        </Modal>
      </div>
    )
  }

  createTable () {
    return this.props.currentProposals.map((proposal, i) => {
      return (
        <tr className='table-row' key={i}>
          <td className={proposal.color}>{proposal.name}</td>
          <td>{proposal.value}</td>
          <td>{moment.unix(moment.tz(proposal.appExpiry, moment.tz.guess())).format('YYYY-MM-DD HH:mm:ss')}</td>
          {this.determineAction(proposal)}
        </tr>
      )
    })
  }

  determineAction (proposal) {
    let action = {
      event: '',
      class: '',
      label: ''
    }
    const propId = proposal.propId
    const applicationExists = !!proposal.appExpiry
    const challengeOpen = (propId === 0 && proposal.appExpiry)
    let commitOpen
    let revealOpen
    let isInRegistry
    let getStage = async () => {
      commitOpen = await ParamterizerService.commitStageActive(propId)
      revealOpen = await ParamterizerService.revealStageActive(propId)
      isInRegistry = (!commitOpen && !revealOpen)
    }

    getStage()

    console.log(applicationExists, challengeOpen, isInRegistry)

    if (proposal.appExpiry > Date.now()) {
      action.class = 'ui mini button blue challenge'
      action.label = 'CHALLENGE'
      action.event = () => { this.promptModal('tiny') }
    } else if (proposal) {
      action.class = 'ui mini button blue vote'
      action.label = 'VOTE'
      action.event = () => { ParamterizerService.processProposal(propId) }
    } else if (proposal) {
      action.class = 'ui mini button greyblack refresh'
      action.label = 'REFRESH STATUS'
      action.event = () => { ParamterizerService.processProposal(propId) }
    } else if (proposal) {
      action.class = 'ui mini button green reveal'
      action.label = 'REVEAL'
      action.event = () => { ParamterizerService.processProposal(propId) }
    } else {
      console.log('not found')
      return false
    }

    return (
      <td>
        <a onClick={() => { action.event() }} name={propId} className={action.class}>
          {action.label}
        </a>
      </td>
    )
  }

  promptModal (modalType) {
    console.log('modale prompt')
    this.show(modalType)
  }

  isExpired (row) {
    const now = moment().unix()
    const end = row._original.stageEndsTimestamp

    if (!end) return false
    return end < now
  }
}

export default OpenProposalsTable
