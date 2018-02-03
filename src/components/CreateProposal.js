import React, { Component } from 'react'
import _ from 'lodash'

import './CreateProposal.css'

// const allParameters = [
//   'minDeposit',
//   'applyStageLength',
//   'commitStageLength',
//   'revealStageLength',
//   'dispensationPct',
//   'voteQuorum',
//   'gMinDeposit',
//   'gApplyStageLength',
//   'gCommitStageLength',
//   'gRevealStageLength',
//   'gDispensationPct',
//   'gVoteQuorum'
// ]

const paramDataMapping = {
  minDeposit: {
    metric: 'ADT'
  },
  applyStageLength: {
    metric: 'days'
  },
  commitStageLength: {
    metric: 'days'
  },
  revealStageLength: {
    metric: 'days'
  },
  dispensationPct: {
    metric: '%'
  },
  voteQuorum: {
    metric: '%'
  },
  gMinDeposit: {
    metric: 'ADT'
  },
  gApplyStageLength: {
    metric: 'days'
  },
  gCommitStageLength: {
    metric: 'days'
  },
  gRevealStageLength: {
    metric: 'days'
  },
  gDispensationPct: {
    metric: '%'
  },
  gVoteQuorum: {
    metric: '%'
  }
}

class CreateProposal extends Component {
  constructor () {
    super()
    this.state = {
      inputlabel: ''

    }
  }

  async componentWillMount () {
  }

  render () {
    return (
      <div className='CreateProposal'>
        <div className='BoxFrame mt-25'>
          <span className='BoxFrameLabel ui grid'>CREATE PROPOSAL</span>
          <div className='ui grid'>
            <div className='column sixteen wide'>
              <div className='header'>Select Parameter</div>
              <div className='selectdiv '>
                <select className='BlueDropdown' onSelect={() => {}}>
                  { this.generateList(paramDataMapping) }
                </select>
              </div>
              <div className='header'>Enter Proposed Value</div>
              <div className='ProposalInputWrapper'>
                <input type='text' placeholder='0' className='ProposalInput' />
              </div>
              <div className='header'>ADT to Stake: min 100 ADT</div>
              <div className='t-center'>
                <button className='ui mini button table-button blue'>SUBMIT PROPOSAL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  generateList (listData) {
    let list = []
    _.reduce(listData, (result, value, param) => {
      list.push(<option key={param}>{param}</option>)
    }, [])
    return list
  }
}

export default CreateProposal
