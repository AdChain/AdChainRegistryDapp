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
      governanceParameterData: Object.assign({}, parameterData.governanceParameterData),
      coreParameterProposals: Object.assign({}, parameterData.coreParameterData),
      governanceParameterProposals: Object.assign({}, parameterData.governanceParameterData),
      currentProposals: []
    }
  }

  async componentWillMount () {
    await ParameterizerService.init()
    await this.getParameterValues('governanceParameterData')
    await this.getParameterValues('coreParameterData')
    this.getProposalsAndPropIds()
  }

  render () {
    let props = this.state
    return (
      <div className='ui stackable  grid padded'>
        <div className='column four wide'>
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
    _.forOwn(this.state[parameterType], (param, name) => {
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

  getProposalsAndPropIds () {
    let proposals
    try {
      ParameterizerService.getProposalsAndPropIds()
          .then((response) => {
            proposals = this.state.currentProposals
            for (let i = 0; i < response[0].length; i++) {
              proposals.push(this.formatProposal(response[0][i], response[1][i]))
            }
            this.setState({
              currentProposals: proposals
            })
          })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  formatProposal (proposal, propId) {
    return {
      appExpiry: proposal[0].c[0],
      challengeID: proposal[1].c[0],
      deposit: proposal[2].c[0],
      contractName: proposal[3],
      owner: proposal[4],
      processBy: proposal[5].c[0],
      value: proposal[6].c[0],
      name: parameterData.coreParameterData[proposal[3]].name || parameterData.governanceParameterData[proposal[3]].name,
      color: parameterData.coreParameterData[proposal[3]].name ? 'f-blue bold' : 'f-red bold',
      propId
    }
  }
}

export default GovernanceContainer
