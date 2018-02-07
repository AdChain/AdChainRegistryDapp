import React, { Component } from 'react'
import _ from 'lodash'
import GovernanceAndCoreParameters from './GovernanceAndCoreParameters'
import CreateProposal from './CreateProposal'
import OpenProposalsTable from './OpenProposalsTable'
import ParameterizerService from '../services/parameterizer'
import { parameterData } from '../models/parameters'

class GovernanceContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coreParameterData: Object.assign({}, parameterData.coreParameterData),
      governanceParameterData: Object.assign({}, parameterData.governanceParameterData)
    }
  }

  async componentWillMount () {
    await ParameterizerService.init()
    await this.getParameterValues('governanceParameterData')
    await this.getParameterValues('coreParameterData')
  }

  render () {
    let props = this.state
    return (
      <div className='ui grid padded'>
        <div className='column five wide'>
          <GovernanceAndCoreParameters {...props} />
        </div>
        <div className='column three wide'>
          <CreateProposal {...props} />
        </div>
        <div className='column eight wide'>
          <OpenProposalsTable {...props} />
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
            result[name].value = response.toNumber()
            this.setState({
              [parameterType]: result
            })
          })
      } catch (error) {
        console.log('error: ', error)
      }
    })
  }
}

export default GovernanceContainer
