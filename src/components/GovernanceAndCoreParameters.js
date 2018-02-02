import React, { Component } from 'react'
import ParameterizerService from '../services/parameterizer'
import _ from 'lodash'
import './GovernanceAndCoreParameters.css'

const coreParameterData = {
  '_minDeposit': 1,
  '_applyStageLen': 0,
  '_commitStageLen': 0,
  '_revealStageLen': 0,
  '_dispensationPct': 0,
  '_voteQuorum': 0
}
const governanceParameterData = {
  '_pMinDeposit': 0,
  '_pApplyStageLen': 0,
  '_pCommitStageLen': 0,
  '_pRevealStageLen': 0,
  '_pDispensationPct': 0,
  '_pVoteQuorum': 0
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
            result[name] = response.c[0]
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
      name = name.match('_p') ? name.replace(/_p/g, 'g') : name.replace(/_/g, '')
      name = name.replace(/Len/g, 'Length')
      parameterNames.push(
        <div className='ParameterRow'>
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
