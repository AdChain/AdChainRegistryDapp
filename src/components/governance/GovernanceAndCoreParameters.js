import React, { Component } from 'react'
import _ from 'lodash'
import './GovernanceAndCoreParameters.css'
import commafy from 'commafy'
import Tooltip from '../Tooltip'

class GovernanceAndCoreParameters extends Component {
  render () {
    const props = this.props
    return (
      <div className='AllParameters'>
        <div className='BoxFrame mt-25 RegistryGuideCoreParameters'>
          <span className='BoxFrameLabel ui grid'>CORE PARAMETERS <Tooltip info={'The Core Parameters are the current parameters that govern the AdChain Registry. All adToken holders are allowed to submit proposals to change parameter values.'} /></span>
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
        <div className='BoxFrame mt-25 RegistryGuideGovernanceParameters'>
          <span className='BoxFrameLabel ui grid'>GOVERNANCE PARAMETERS <Tooltip info={'The Governance Parameters set the values for all proposals. All adToken holders are allowed to submit proposals to change the values that govern the proposals parameters.'} /></span>
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
          value = commafy(value / 1000000000) + ' ADT'
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
          <span key={name} className={parameterData === this.props.coreParameterData ? 'f-blue' : 'f-red'}>{parameterData[name].normalizedName} <Tooltip info={parameterData[name].info} class={'InfoIconLow'} /></span>
          <span key={i++}>{value}</span>
        </div>
      )
      return result
    }, [])
    return table
  }
}

export default GovernanceAndCoreParameters
