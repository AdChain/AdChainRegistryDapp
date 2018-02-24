import React, { Component } from 'react'
// import commafy from 'commafy'
import { Modal } from 'semantic-ui-react'
import './OpenProposalsTable.css'
import moment from 'moment-timezone'
import GovernanceChallengeContainer from './GovernanceChallengeContainer'

class OpenProposalsTable extends Component {
  constructor () {
    super()
    this.state = {
      open: false,
      selectedProposal: null
    }
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
          <td>{proposal.name}</td>
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

    if (proposal.appExpiry < Date.now()) {
      action.class = 'ui mini button blue challenge'
      action.label = 'CHALLENGE'
      action.event = this.promptModal
    } else {
      console.log('not foud')
    }

    return (
      <td>
        <a onClick={() => { this.show('mini') }} className={action.class}>
          {action.label}
        </a>
      </td>
    )
  }

  promptModal (modalType) {
    console.log('modale prompt')
    this.show('tiny')
  }
}

export default OpenProposalsTable
