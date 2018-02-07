import React, { Component } from 'react'
import _ from 'lodash'
import './GovernanceAndCoreParameters.css'
import commafy from 'commafy'

class GovernanceAndCoreParameters extends Component {
  render () {
    const props = this.props
    return (
      <div className='AllParameters'>
        <div className='BoxFrame mt-25'>
          <span className='BoxFrameLabel ui grid'>CORE PARAMETERS</span>
          <div className='ui grid'>
            <div className='column sixteen wide'>
              <div>
                <span>Parameters</span>
                <span className='ValuesTitle'>Values</span>
              </div>
              <div>
                {this.generateCoreParameterTable(props.coreParameterData)}
              </div>
            </div>
          </div>
        </div>
        <div className='BoxFrame mt-25'>
          <span className='BoxFrameLabel ui grid'>GOVERNANCE PARAMETERS</span>
          <div className='ui grid'>
            <div className='column sixteen wide'>
              <div>
                <span>Parameters</span>
                <span className='ValuesTitle'>Values</span>
              </div>
              <div>
                {this.generateCoreParameterTable(props.governanceParameterData)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  generateCoreParameterTable (parameterData) {
    if (!this.props.coreParameterData || !this.props.governanceParameterData) return
    let i = 0
    const table = _.reduce(parameterData, (result, value, name) => {
      value = parameterData[name].value
      switch (name) {
        case 'minDeposit':
        case 'pMinDeposit':
          value = commafy(value) + ' ADT'
          break
        case 'applyStageLen':
        case 'pApplyStageLen':
        case 'commitStageLen':
        case 'pCommitStageLen':
        case 'revealStageLen':
        case 'pRevealStageLen':
          value = (value / 60) + ' min'
          break
        case 'dispensationPct':
        case 'pDispensationPct':
        case 'voteQuorum':
        case 'pVoteQuorum':
          value = value + '%'
          break
        default:
          break
      }
      result.push(
        <div key={value + name} className='ParameterRow'>
          <span key={name} className={parameterData === this.props.coreParameterData ? 'f-blue' : 'f-red'}>{parameterData[name].name}</span>
          <span key={i++}>{value}</span>
        </div>
      )
      return result
    }, [])
    return table
  }
}

export default GovernanceAndCoreParameters
