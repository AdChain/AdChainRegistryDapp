import React, { Component } from 'react'
// import commafy from 'commafy'
// import moment from 'moment'
import ParameterizerService from '../services/parameterizer'

import './OpenProposalsTable.css'

class OpenProposalsTable extends Component {
  render () {
    if (this.props.currentProposals.length < 1) return false
    console.log('currentProposals: ', this.props.currentProposals)
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
      </div>
    )
  }

  createTable () {
    return this.props.currentProposals.map((proposal, i) => {
      return (
        <tr className='table-row' key={i}>
          <td>{proposal.name}</td>
          <td>{proposal.value}</td>
          <td>{proposal.processBy}</td>
          <td>action</td>
        </tr>
      )
    })
  }

  async getProposals () {
    let result
    try {
      let temp
      result = await Object.keys(this.props.coreParameterData).map(param => {
        temp = ParameterizerService.getProposals(param, this.props.coreParameterData[param])
        return temp
      })
      return result
    } catch (error) {
      console.log(error)
    }
  }
}

export default OpenProposalsTable
