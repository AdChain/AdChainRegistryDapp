import React, { Component } from 'react'
import ParameterizerService from '../services/parameterizer'
import _ from 'lodash'
import './GovernanceAndCoreParameters.css'
const commafy = require('commafy')

const coreParameterData = {
  'minDeposit': 0,
  'applyStageLen': 0,
  'commitStageLen': 0,
  'revealStageLen': 0,
  'dispensationPct': 0,
  'voteQuorum': 0
}
const governanceParameterData = {
  'pMinDeposit': 0,
  'pApplyStageLen': 0,
  'pCommitStageLen': 0,
  'pRevealStageLen': 0,
  'pDispensationPct': 0,
  'pVoteQuorum': 0
}

class GovernanceAndCoreParameters extends Component {
  constructor () {
    super()
    this.state = {
      coreParameterData: Object.assign({}, coreParameterData),
      governanceParameterData: Object.assign({}, governanceParameterData)
    }
  }

  async componentWillMount () {
    await ParameterizerService.init()
    await this.getParameterValues('governanceParameterData')
    await this.getParameterValues('coreParameterData')
  }

  render () {
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
                {this.generateCoreParameterTable(this.state.coreParameterData)}
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
                {this.generateCoreParameterTable(this.state.governanceParameterData)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getParameterValues (parameterType) {
    let result
    _.forOwn(this.state[parameterType], (value, name) => {
      try {
        ParameterizerService.get(name)
          .then((response) => {
            result = this.state[parameterType]
            result[name] = response.toNumber()
            this.setState({
              [parameterType]: result
            })
          })
      } catch (error) {
        console.log('error: ', error)
      }
    })
  }

  generateCoreParameterTable (parameterData) {
    if (!this.state.coreParameterData) return
    let parameterNames = []
    let i = 0

    const table = _.reduce(parameterData, (result, value, name) => {
      switch (name) {
        case 'minDeposit':
        case 'pMinDeposit':
          value = commafy(Math.floor(value / 1000000000)) + ' ADT'
          break
        case 'applyStageLen':
        case 'pApplyStageLen':
        case 'commitStageLen':
        case 'pCommitStageLen':
        case 'revealStageLen':
        case 'pRevealStageLen':
          value = (value / 1440 / 60) + ' days'
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
      name = name.replace(/Len/g, 'Length')
      parameterNames.push(
        <div key={value + name} className='ParameterRow'>
          <span key={name} className={parameterData === this.state.coreParameterData ? 'f-blue' : 'f-red'}>{name}</span>
          <span key={i++}>{value}</span>
        </div>
      )
      result = parameterNames
      return result
    }, [])
    return table
  }
}

export default GovernanceAndCoreParameters
