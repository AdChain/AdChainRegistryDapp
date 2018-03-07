import React, { Component } from 'react'
import _ from 'lodash'
import GovernanceAndCoreParameters from './GovernanceAndCoreParameters'
import GovernanceRewardsTable from './GovernanceRewardsTable'
import CreateProposal from './CreateProposal'
import OpenProposalsTable from './OpenProposalsTable'
import ParameterizerService from '../services/parameterizer'
import { parameterData } from '../models/parameters'
import moment from 'moment-timezone'
import commafy from 'commafy'
// import store from '../store'

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

  async componentDidMount () {
    this._isMounted = true

    await ParameterizerService.init()
    await this.getParameterValues('governanceParameterData')
    await this.getParameterValues('coreParameterData')
    this.getProposalsAndPropIds()

    // store.subscribe( x => {
    //   this.getParameterValues('governanceParameterData')
    //   this.getParameterValues('coreParameterData')
    //   this.getProposalsAndPropIds()
    // })
  }

  componentWillUnmount () {
    this._isMounted = false
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
          <GovernanceRewardsTable {...props} />
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
            if (this._isMounted) {
              this.setState({
                [parameterType]: result
              })
            }
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
              if (response[0][i][4] === '0x0000000000000000000000000000000000000000') {
              } else {
                proposals.push(this.formatProposal(response[0][i], response[1][i]))
              }
            }
            if (this._isMounted) {
              this.setState({
                currentProposals: proposals
              })
            }
          })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  formatProposal (proposal, propId) {
    return {
      appExpiry: moment.tz(proposal[0].c[0], moment.tz.guess())._i,
      challengeId: proposal[1].c[0],
      deposit: proposal[2].c[0],
      contractName: proposal[3],
      owner: proposal[4],
      processBy: proposal[5].c[0],
      propId,
      proposedValue: this.formatValue(proposal[3], proposal[6].c[0]),
      currentValue: parameterData.coreParameterData[proposal[3]] ? parameterData.coreParameterData[proposal[3]].value : parameterData.governanceParameterData[proposal[3]].value,
      name: parameterData.coreParameterData[proposal[3]] ? parameterData.coreParameterData[proposal[3]].name : parameterData.governanceParameterData[proposal[3]].name,
      color: parameterData.coreParameterData[proposal[3]] ? 'f-blue bold' : 'f-red bold',
      metric: parameterData.coreParameterData[proposal[3]] ? parameterData.coreParameterData[proposal[3]].metric : parameterData.governanceParameterData[proposal[3]].metric
    }
  }

  formatValue (name, value) {
    switch (name) {
      case 'minDeposit':
      case 'pMinDeposit':
        value = commafy(value / 1000000000)
        break
      case 'applyStageLen':
      case 'pApplyStageLen':
      case 'commitStageLen':
      case 'pCommitStageLen':
      case 'revealStageLen':
      case 'pRevealStageLen':
        value = (value / 60)
        break
      default:
        break
    }
    return value
  }
}

export default GovernanceContainer
