import React, { Component } from 'react'
import _ from 'lodash'
import GovernanceAndCoreParameters from './GovernanceAndCoreParameters'
import GovernanceRewardsTable from './GovernanceRewardsTable'
import CreateProposal from './CreateProposal'
import OpenProposalsTable from './OpenProposalsTable'
import ParameterizerService from '../services/parameterizer'
import registry from '../services/registry'
import { parameterData } from '../models/parameters'
import moment from 'moment-timezone'
import commafy from 'commafy'
import PubSub from 'pubsub-js'
import Eth from 'ethjs'

const url = 'https://adchain-registry-api-staging.metax.io/'
const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))

class GovernanceContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coreParameterData: Object.assign({}, parameterData.coreParameterData),
      governanceParameterData: Object.assign({}, parameterData.governanceParameterData),
      coreParameterProposals: Object.assign({}, parameterData.coreParameterData),
      governanceParameterProposals: Object.assign({}, parameterData.governanceParameterData),
      currentProposalsLoading: true,
      currentProposals: [],
      rewards: [],
      account: ''
    }
  }

  async componentWillMount () {
    try {
      await ParameterizerService.init()
      await this.getParameterValues('governanceParameterData')
      await this.getParameterValues('coreParameterData')
      await this.getAccount()
      await this.fetchRewards()
      this.getProposalsAndPropIds()

      /*
       * ---------------------- PubSub Pattern -----------------------
       * Used to subscribe and publish events on non-related components.
       * Useful for updating state on another component that is not in the same
       * heirarchy or does not have access to the same props/state.
       * Metax's convention for usage is to include the name of the component and the function that
       * is going to be invoked as the first parameter in the subscribe event, and the
       * second parameter is the name of the function that will be invoked and binded by 'this'.
       * In the publishing component you will publish the event by calling PubSub.publish('GovernanceContainer.getProposalsAndPropIds','extradata')
       * You can unsubscribe to an action by calling PubSub.unsubscribe(this.subEvent).
       *
      */

      // PubSub subscription set here
      this.subEvent = PubSub.subscribe('GovernanceContainer.getProposalsAndPropIds', this.getProposalsAndPropIds.bind(this))
    } catch (error) {
      console.log(error)
    }
  }

  componentWillUnmount () {
    // Unsubscribe from event once unmounting
    PubSub.unsubscribe(this.subEvent)
  }

  render () {
    let props = this.state
    if (!this.state.rewards) return false
    return (
      <div className='ui stackable grid padded'>
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
            if (response) {
              result = this.state[parameterType]
              result[name].value = response.toNumber()
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

  getAccount () {
    if (!this.state.account) {
      const account = registry.getAccount()
      this.setState({
        account
      })
    }
  }

  getProposalsAndPropIds () {
    let proposals
    // reset state
    this.setState({
      currentProposals: []
    })
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
          // console.log("proposals:", proposals)
          this.setState({
            currentProposals: proposals,
            currentProposalsLoading: false
          })
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
    try {
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
          value = commafy(value / 60)
          break
        default:
          break
      }
      return value
    } catch (error) {
      console.log('error: ', error)
    }
  }

  async fetchRewards () {
    let data = await (await window.fetch(`${url}/parameterization/rewards?account=${this.state.account}`)).json()
    // data = _.filter(data, (rewards) => rewards.status === 'unclaimed')

    if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        let alreadyClaimed = await ParameterizerService.didClaim(data[i].challenge_id)
        if (!alreadyClaimed) {
          let reward = await ParameterizerService.calculateVoterReward(data[i].sender, data[i].challenge_id, data[i].salt)
          data[i].reward = big(reward).div(tenToTheNinth).words[0]
        }
      }

      this.setState({
        rewards: data
      })
    }
  }
}

export default GovernanceContainer
