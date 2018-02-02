import React, { Component } from 'react'
import ParameterizerService from '../services/parameterizer'
import _ from 'lodash'

const coreParameterData = {
  '_minDeposit': 0,
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

class CoreParameters extends Component {
  constructor () {
    super()
    this.state = {
      coreParameterData: Object.assign({}, coreParameterData),
      governanceParameterData: Object.assign({}, governanceParameterData)
    }
  }

  async componentWillMount () {
    await ParameterizerService.init()
    await this.getParameterValues(this.state.coreParameterData)
    await this.getParameterValues(this.state.governanceParameterData)
  }

  render () {
    return (
      <div>
        <div className='BoxFrame mt-25'>
          <span className='BoxFrameLabel ui grid'>CORE PARAMETERS</span>
          <div className='ui grid'>
            <div className='column ten wide'>
              <h4>Parameter</h4>
              {this.generateCoreParameterTable(this.state.coreParameterData)[0]}
            </div>
            <div className='column six wide'>
              <h4>Values</h4>
              {this.generateCoreParameterTable(this.state.coreParameterData)[1]}
            </div>
          </div>
        </div>
        <div className='BoxFrame mt-25'>
          <span className='BoxFrameLabel ui grid'>GOVERNANCE PARAMETERS</span>
          <div className='ui grid'>
            <div className='column ten wide'>
              <h4>Parameter</h4>
              {this.generateCoreParameterTable(this.state.governanceParameterData)[0]}
            </div>
            <div className='column six wide'>
              <h4>Values</h4>
              {this.generateCoreParameterTable(this.state.governanceParameterData)[1]}
            </div>
          </div>
        </div>
      </div>
    )
  }

  getParameterValues (parameterType) {
    let result
    _.forOwn(parameterType, (value, name) => {
      try {
        ParameterizerService.get(name)
          .then((response) => {
            result = this.state.coreParameterData
            result[name] = response.c[0]
          })
      } catch (error) {
        console.log('error: ', error)
      }
    })
    if (result) {
      this.setState({
        coreParameterData: result
      })
    }
  }

  generateCoreParameterTable (parameterType) {
    if (!this.state.coreParameterData) return
    let parameterNames = []
    let parameterValues = []
    let i = 0
    const table = _.reduce(parameterType, (result, value, name) => {
      parameterNames.push(<div key={name}>{name}</div>)
      parameterValues.push(<div key={i++}>{value}</div>)
      result = [parameterNames, parameterValues]
      return result
    }, [])
    return table
  }
}

export default CoreParameters
