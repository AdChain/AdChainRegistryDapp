import Eth from 'ethjs'
import React, { Component } from 'react'
import _ from 'lodash'
import ParameterizerService from '../../services/parameterizer'
import token from '../../services/token'
import commafy from 'commafy'
import toastr from 'toastr'
import PubSub from 'pubsub-js'
import Tooltip from '../Tooltip'
import calculateGas from '../../utils/calculateGas'
import './CreateProposal.css'

class CreateProposal extends Component {
  constructor () {
    super()
    this.state = {
      // inProgress: false,
      // defaults
      paramMetric: 'ADT',
      proposalParam: 'minDeposit',
      proposalValue: '',
      currentMinDeposit: 0,
      rawCurrentMinDeposit: 0

    }
    this.setParamMetricAndName = this.setParamMetricAndName.bind(this)
    this.setValue = this.setValue.bind(this)
  }

  componentDidMount () {
    this.getParameterValues('pMinDeposit')
  }

  render () {
    return (
      <div className='CreateProposal'>
        {
        // <div className={this.state.inProgress === true ? 'show InProgressProposal' : 'hide'}>
        //   <div className='Content'>
        //     <div>
        //       <strong>Submission in progress. </strong>
        //       <div className='ui active indeterminate inline small loader' />
        //     </div>
        //     <br />
        //     <p>
        //       You will receive a maximum of <strong><u>two</u></strong> MetaMask prompts:
        //     </p>
        //     <p>
        //       <strong><u>First prompt</u>:</strong><br />
        //       Allow adChain Registry contract to transfer adToken deposit from your account (if not done so already).
        //     </p>
        //     <p>
        //       <strong><u>Second prompt</u>:</strong><br />
        //       Submit proposal application to the Governance contract.
        //     </p>
        //   </div>
        // </div>
        // <div className={this.state.inProgress === null ? 'show InProgressProposal' : 'hide'}>
        //   <div className='Content' style={{paddingTop: '62px'}}>
        //     <div className='t-center'>
        //       <strong>Transaction Successful </strong><br />
        //       <i className='icon check circle' style={{color: 'green'}} />
        //     </div>
        //     <br />
        //     <p className='t-center'>
        //       It may take up to <u>20 seconds</u> for your proposal to appear in the <strong> Open Proposals Table</strong>
        //     </p>
        //   </div>
        // </div>
        }
        <div className='BoxFrame mt-25 RegistryGuideCreateProposal'>
          <span className='BoxFrameLabel ui grid'>CREATE PROPOSAL <Tooltip info={'This is where you create new proposals to change a parameter. You can change Registry and Parameterizer parameters here.'} /></span>
          <div className='ui grid'>
            <div className='column sixteen wide'>
              <div className='header'>Select Parameter</div>
              <div className='selectdiv '>
                <select className={(this.props.coreParameterData[this.state.proposalParam] ? 'f-blue bold' : 'f-red bold') + ' BlueDropdown'} name='proposal' type='text' defaultValue={this.state.proposalParam} onChange={this.setParamMetricAndName}>
                  { this.generateList() }
                </select>
              </div>
              <div className='header'>Enter Proposed Value</div>
              <div className='ProposalInputWrapper '>
                <input min='0' placeholder='0' className='ProposalInput' onChange={this.setValue} value={this.state.proposalValue} /> {this.state.paramMetric}
              </div>
              <div className='header t-center'>ADT amount needed to stake an open proposal: <br /><br /> {this.state.currentMinDeposit} ADT</div>
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
      proposalParam: target.value,
      proposalValue: ''
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
      result.push(<option value={param} key={param}>{listData[param].normalizedName}</option>)
      return result
    }, [])
    return list
  }

  async submitProposal () {
    if (this.state.proposalValue < 1) {
      toastr.error('Please enter a valid proposal value')
      return
    }

    const adtBalance = await token.getBalance()
    if (adtBalance < parseFloat(this.state.currentMinDeposit.replace(/,/g, ''))) {
      toastr.error('You do not have enough ADT to submit this proposal')
      return
    }

    let result
    try {
      console.log('inside submit try')
      // hit parameterizer contract for creating a new proposal
      let proposalValue = this.formatProposedValue(this.state.proposalParam, this.state.proposalValue)
      result = await ParameterizerService.proposeReparameterization(this.state.rawCurrentMinDeposit, this.state.proposalParam, proposalValue)
      console.log('after result try')

      // if (!result) {
      //   // remove loading over box
      //   // this.setState({
      //   //   inProgress: false
      //   // })
      // } else {
      //   // show success loader
      //   this.setState({
      //     inProgress: null
      //   })
      // }
      setTimeout(() => {
        PubSub.publish('GovernanceContainer.getProposalsAndPropIds')
      }, 18000)

      try {
        calculateGas({
          value_staked: this.state.currentMinDeposit,
          parameter: this.state.proposalParam,
          proposal_value: this.state.proposalValue,
          contract_event: true,
          event: 'proposeReparameterization',
          contract: 'parameterizer',
          event_success: true
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    } catch (error) {
      console.log(error)
      toastr.error('There was an error creating proposal')

      try {
        calculateGas({
          value_staked: this.state.currentMinDeposit,
          parameter: this.state.proposalParam,
          proposal_value: this.state.proposalValue,
          contract_event: true,
          event: 'proposeReparameterization',
          contract: 'parameterizer',
          event_success: false
        })
      } catch (error) {
        console.log('error reporting gas')
      }
    }

    return result
  }

  getParameterValues (name, t) {
    let result
    if (this.state.currentMinDeposit) return true
    try {
      ParameterizerService.get(name)
        .then((response) => {
          if (response) {
            result = response.toNumber()
            this.setState({
              // inProgress: false,
              currentMinDeposit: commafy(result / 1000000000),
              rawCurrentMinDeposit: result / 10
            })
          }
        })
    } catch (error) {
      console.log('error: ', error)
    }
  }

  formatProposedValue (name, value) {
    const big = (value) => new Eth.BN(value.toString(10))
    const tenToTheNinth = big(10).pow(big(9))
    const bigTokens = big(value).mul(tenToTheNinth).toString(10)
    try {
      switch (name) {
        case 'minDeposit':
        case 'pMinDeposit':
          value = bigTokens
          break
        case 'applyStageLen':
        case 'pApplyStageLen':
        case 'commitStageLen':
        case 'pCommitStageLen':
        case 'revealStageLen':
        case 'pRevealStageLen':
          value = value * 60
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
