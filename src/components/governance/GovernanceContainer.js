import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment-timezone'
import commafy from 'commafy'
import PubSub from 'pubsub-js'
import Eth from 'ethjs'
import isMobile from 'is-mobile'
import { Modal } from 'semantic-ui-react'

import GovernanceAndCoreParameters from './GovernanceAndCoreParameters'
import GovernanceRewardsTable from './GovernanceRewardsTable'
import CreateProposal from './CreateProposal'
import OpenProposalsTable from './OpenProposalsTable'
import ParameterizerService from '../../services/parameterizer'
import RequestVotingRightsContainer from '../dashboard/RequestVotingRightsContainer.js'
import WithdrawVotingRightsContainer from '../dashboard/WithdrawVotingRightsContainer.js'
import ExpiredVotingADT from '../dashboard/ExpiredVotingADT'
import registry from '../../services/registry'
import { parameterData } from '../../models/parameters'
import { registryApiURL } from '../../models/urls'
import Tooltip from '../Tooltip'
import RegistryGuideModalGovernance from '../registry_guide/RegistryGuideModalGovernance'

const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))

class GovernanceContainer extends Component {
  constructor (props) {
    super(props)
    let doNotDisplay = JSON.parse(window.localStorage.getItem('GovernanceModalDisplay'))
    this.state = {
      coreParameterData: Object.assign({}, parameterData.coreParameterData),
      governanceParameterData: Object.assign({}, parameterData.governanceParameterData),
      coreParameterProposals: Object.assign({}, parameterData.coreParameterData),
      governanceParameterProposals: Object.assign({}, parameterData.governanceParameterData),
      currentProposalsLoading: true,
      currentProposals: [],
      rewards: [],
      account: '',
      modalOpen: false,
      registryGuideSrc: false,
      doNotDisplay: doNotDisplay
    }
    this.close = this.close.bind(this)
  }

  async componentWillMount () {
    try {
      await ParameterizerService.init()
      this.getAccount()
      
      await this.getParameterValues('governanceParameterData')
      await this.getParameterValues('coreParameterData')

      await this.fetchRewards()
      this.getProposalsAndPropIds()

      /*
       * ---------------------- PubSub Pattern -----------------------
       *
       * Subscribe and Publish events on non-related components.
       * Useful for updating state on another component that is not in the same
       * heirarchy or does not have access to the same props/state.
       *
       * Metax's convention for usage is to include the name of the component and the function that
       * is going to be invoked as the first parameter in the subscribe event, and the
       * second parameter is the name of the function that will be invoked and binded by 'this'.
       *
       * In the publishing component you will publish the event by calling `PubSub.publish('GovernanceContainer.getProposalsAndPropIds','extradata')`
       * In subscribing the event you will call `PubSub.subscribe('GovernanceContainer.getProposalsAndPropIds', this.getProposalsAndPropIds.bind(this))`
       * You can unsubscribe to an action by calling PubSub.unsubscribe(this.subEvent).
       *
      */

      // PubSub subscription set here
      this.subEvent = PubSub.subscribe('GovernanceContainer.getProposalsAndPropIds', this.getProposalsAndPropIds.bind(this))
      this.closeEvent = PubSub.subscribe('GovernanceContainer.closeModal', this.close)
    } catch (error) {
      console.log(error)
    }
  }
  componentDidMount () {
    this._isMounted = true
    // launch modal on load only if it's not coming from the main registry guide modal or they clicked do not see this again
  }
  componentWillUnmount () {
    // Unsubscribe from event once unmounting
    PubSub.unsubscribe(this.subEvent)
    this._isMounted = false
  }

  render () {
    let props = this.state
    const { account, doNotDisplay, modalOpen } = this.state
    let registryGuideSrc = this.props.location.state ? this.props.location.state.registryGuideSrc : null

    // if (!this.state.rewards || !account || account === '0x0') return null

    return (
      <div className='ui stackable grid padded'>
        <div className='column four wide'>
          <GovernanceAndCoreParameters {...props} />
        </div>
        <div className='column twelve wide mobile-hide'>
          <div className='ui stackable grid'>
            <div className='column four wide '>
              <CreateProposal {...props} />
              <GovernanceRewardsTable {...props} />
            </div>
            <div className='column twelve wide'>
              <OpenProposalsTable {...props} />
            </div>
            <div className='column sixteen wide mobile-hide'>
              <div className='BoxFrame'>
                <span className='ui grid BoxFrameLabel'>PRE-APPROVE TOKENS FOR VOTING<Tooltip info={'Pre-Approve Voting Rights to reduce the number of MetaMask transactions.'} /></span>
                <div className='ui grid'>
                  <div className='row f-13 f-os'>
                    <RequestVotingRightsContainer account={account} contract={'parameterizer'} />
                    <ExpiredVotingADT account={account} contract={'parameterizer'} />
                    <WithdrawVotingRightsContainer account={account} contract={'parameterizer'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          registryGuideSrc
            ? null
            : doNotDisplay || isMobile()
              ? null
              : <Modal size={'small'} open={modalOpen} closeIcon className='GovernanceGuideModal' onClose={this.close}>
                <RegistryGuideModalGovernance src={'governance'} />
              </Modal>
        }
      </div>
    )
  }

  close () {
    this.setState({modalOpen: false})
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
    const account = registry.getAccount()
    if (this._isMounted) {
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
          if (this._isMounted) {
            this.setState({
              currentProposals: proposals,
              currentProposalsLoading: false
            })
          }
        })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  formatProposal (proposal, propId) {
    return {
      propId,
      appExpiry: moment.tz(proposal[0].c[0], moment.tz.guess())._i,
      challengeId: proposal[1].c[0],
      deposit: proposal[2].c[0],
      contractName: proposal[3],
      owner: proposal[4],
      processBy: proposal[5].c[0],
      proposedValue: this.formatValue(proposal[3], proposal[6].c[0]),
      currentValue: parameterData.coreParameterData[proposal[3]] ? parameterData.coreParameterData[proposal[3]].value : parameterData.governanceParameterData[proposal[3]].value,
      name: parameterData.coreParameterData[proposal[3]] ? parameterData.coreParameterData[proposal[3]].name : parameterData.governanceParameterData[proposal[3]].name,
      normalizedName: parameterData.coreParameterData[proposal[3]] ? parameterData.coreParameterData[proposal[3]].normalizedName : parameterData.governanceParameterData[proposal[3]].normalizedName,
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
    if(!this.state.account || this.state.account === '0x0'){
      return null
    }
    let data = await (await window.fetch(`${registryApiURL}/parameterization/rewards?account=${this.state.account}`)).json()
    // data = _.filter(data, (rewards) => rewards.status === 'unclaimed')

    if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        let alreadyClaimed = await ParameterizerService.didClaim(data[i].challenge_id)
        if (!alreadyClaimed) {
          let reward = await ParameterizerService.calculateVoterReward(data[i].sender, data[i].challenge_id, data[i].salt)
          data[i].reward = big(reward).div(tenToTheNinth).words[0]
        }
      }
      if (this._isMounted) {
        this.setState({
          rewards: data
        })
      }
    }
  }
}

export default GovernanceContainer
