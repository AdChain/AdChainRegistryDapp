import React, { Component } from 'react'
// import commafy from 'commafy'
// import moment from 'moment'
import ParameterizerService from '../services/parameterizer'

import './OpenProposalsTable.css'

class OpenProposalsTable extends Component {
  componentDidMount () {
    this.getProposals()
  }
  render () {
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
            <tr>
              <td>1</td><td>2</td><td>3</td><td>4</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
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
