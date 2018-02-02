import React, { Component } from 'react'
import './CreateProposal.css'

const allParameters = [
  'minDeposit',
  'applyStageLength',
  'commitStageLength',
  'revealStageLength',
  'dispensationPct',
  'voteQuorum',
  'gMinDeposit',
  'gApplyStageLength',
  'gCommitStageLength',
  'gRevealStageLength',
  'gDispensationPct',
  'gVoteQuorum'
]

class CreateProposal extends Component {
  constructor () {
    super()
    this.state = {
    }
  }

  async componentWillMount () {
  }

  render () {
    return (
      <div>
        <div className='BoxFrame mt-25'>
          <span className='BoxFrameLabel ui grid'>CREATE PROPOSAL</span>
          <div className='ui grid'>
            <div className='column sixteen wide'>
              <h4>Select Parameter</h4>
              <div className='selectdiv '>
                <select className='BlueDropdown'>
                  {
                    allParameters.map(param => {
                      return (<option key={param}>{param}</option>)
                    })
                  }
                </select>
              </div>
              <h5>Enter Proposed Value</h5>
              <div className='ProposalInputWrapper'>
                <input type='text' placeholder='1000' className='ProposalInput' />
              </div>
              <h5>ADT to Stake: min 100 ADT</h5>
              <div className='t-center'>
                <button className='ui mini button table-button blue'>SUBMIT PROPOSAL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CreateProposal
