import React, { Component } from 'react'
import _ from 'lodash'
import ParameterizerService from '../services/parameterizer'
import commafy from 'commafy'

import './CreateProposal.css'

class CreateProposal extends Component {
  constructor () {
    super()
    this.state = {
      paramMetric: 'ADT',
      proposalParam: '',
      proposalValue: '',
      currentMinDeposit: ''

    }
    this.setParamMetricAndName = this.setParamMetricAndName.bind(this)
    this.setValue = this.setValue.bind(this)
  }

  componentDidMount () {
    this.getParameterValues('minDeposit')
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
                <select className='BlueDropdown' name='proposal' type='text' defaultValue={this.state.paramMetric} onChange={this.setParamMetricAndName}>
                  { this.generateList() }
                </select>
              </div>
              <div className='header'>Enter Proposed Value</div>
              <div className='ProposalInputWrapper '>
                <input min='0' placeholder='0' className='ProposalInput' onChange={this.setValue} value={this.state.proposalValue} /> {this.state.paramMetric}
              </div>
              <div className='header t-center'>ADT amount needed to stake to open a proposal: <br /><br /> {this.state.currentMinDeposit} ADT</div>
              <div className='t-center'>
                <button className='ui mini button table-button blue' onClick={() => { this.submitProposal() }}>SUBMIT PROPOSAL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  setParamMetricAndName ({target}) {
    let listData = Object.assign({}, this.props.coreParameterData, this.props.governanceParameterData)
    this.setState({
      paramMetric: listData[target.value].metric,
      proposalParam: target.value
    })
  }

  setValue ({target}) {
    this.setState({
      proposalValue: target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<> |^[A-Za-z]/gi, '')
    })
  }

  generateList () {
    let listData = Object.assign({}, this.props.coreParameterData, this.props.governanceParameterData)
    let list = _.reduce(listData, (result, value, param) => {
      result.push(<option value={param} key={param}>{listData[param].name}</option>)
      return result
    }, [])
    return list
  }

  async submitProposal () {
    let result
    try {
      console.log(this.state.proposalParam, this.formatProposedValue(this.state.proposalParam, this.state.proposalValue))
      result = await ParameterizerService.proposeReparameterization(this.state.proposalParam, this.formatProposedValue(this.state.proposalParam, this.state.proposalValue))
    } catch (error) {
      console.log(error)
    }
    console.log(result)
  }

  getParameterValues (name) {
    let result
    try {
      ParameterizerService.get(name)
        .then((response) => {
          result = response.toNumber()
          this.setState({
            currentMinDeposit: commafy(Math.floor(result / 1000000000))
          })
        })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  formatProposedValue (name, value) {
    try {
      switch (name) {
        case 'minDeposit':
        case 'pMinDeposit':
          value = value * 1000000000
          break
        case 'applyStageLen':
        case 'pApplyStageLen':
        case 'commitStageLen':
        case 'pCommitStageLen':
        case 'revealStageLen':
        case 'pRevealStageLen':
          value = value * 1440 * 60
          break
        default:
          break
      }
      return value
    } catch (error) {
      console.log(error)
    }
  }
}

export default CreateProposal
