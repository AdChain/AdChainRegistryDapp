import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import { Input, Segment, Button, Dropdown } from 'semantic-ui-react'
import Tooltip from '../Tooltip'
import Eth from 'ethjs'

import Countdown from '../CountdownText'
import registry from '../../services/registry'
import DomainVoteTokenDistribution from './DomainVoteTokenDistribution'
import PubSub from 'pubsub-js'
import { registryApiURL } from '../../models/urls'
import IndividualGuideModal from './IndividualGuideModal'

import './DomainVoteRevealContainer.css'

const big = (number) => new Eth.BN(number.toString(10))
const tenToTheNinth = big(10).pow(big(9))

class DomainVoteRevealContainer extends Component {
  constructor (props) {
    super()

    let displayRevealModal = JSON.parse(window.localStorage.getItem('RevealGuide'))

    this.state = {
      domain: props.domain,
      applicationExpiry: null,
      votesFor: 0,
      votesAgainst: 0,
      commitEndDate: null,
      revealEndDate: null,
      didChallenge: false,
      didCommit: false,
      didReveal: false,
      salt: '',
      voteOption: '',
      challengeId: '',
      revealedVoteOption: '',
      revealedAmount: 0,
      account: registry.getAccount(),
      displayRevealModal: !displayRevealModal
    }

    this.onVoteOptionChange = this.onVoteOptionChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onFileInput = this.onFileInput.bind(this)
    this.uploadClick = this.uploadClick.bind(this)
    this.onSaltChange = this.onSaltChange.bind(this)
  }

  async componentDidMount () {
    this._isMounted = true
    if (this.props.domainData) {
      Promise.all([
        this.getPoll(),
        this.getChallenge(),
        this.getCommit(),
        this.getReveal()
      ])
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillReceiveProps (next) {
    this.getReveal()
    this.getPoll()
    if (next.domainData && next.currentDeposit !== this.props.currentDeposit) {
      this.setState({
        domainData: next.domainData,
        challengeId: next.domainData.challengeId,
        applicationExpiry: next.domainData.applicationExpiry
      })
    }
  }

  render () {
    const {
      domain,
      revealEndDate,
      didChallenge,
      didCommit,
      didReveal,
      revealedVoteOption,
      revealedAmount,
      displayRevealModal
      // voteOption,
      // challengeId,
      // salt
    } = this.state

    const voteOptions = [
      { key: 1, text: 'Support', value: 1 },
      { key: 2, text: 'Oppose', value: 0 }
    ]

    const stageEndMoment = revealEndDate ? moment.unix(revealEndDate) : null
    const stageEnd = stageEndMoment ? stageEndMoment.format('YYYY-MM-DD HH:mm:ss') : '-'
    let redirectState = this.props.redirectState ? this.props.redirectState.cameFromRedirect : false

    return (
      <div className='DomainVoteRevealContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide HeaderColumn'>
            <div className='row HeaderRow'>
              <div className='ui large header'>
                Stage: Reveal
                <Tooltip
                  info='The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of votes to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of votes to either the SUPPORT or OPPOSE side.'
                />
              </div>
            </div>
          </div>
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <div>
              <p>
                Reveal stage ends
              </p>
              <p><strong>{stageEnd}</strong></p>
              <div>Remaining time: <Countdown
                endDate={stageEndMoment}
                onExpire={this.onCountdownExpire.bind(this)} /></div>
            </div>
          </div>
          {didChallenge ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>challenged</strong> this domain.
            </div>
          </div>
            : null}
          {didCommit ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>committed</strong> for this domain.
            </div>
          </div>
            : <div className='column sixteen wide center aligned'>
              <div className='ui message warning'>
                You <strong>did not commit</strong> votes for this domain, and therefore have nothing to reveal.
              </div>
            </div>}
          {didReveal ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>revealed</strong> for this domain.
            </div>
          </div>
            : null}
          <div className='ui divider' />
          <DomainVoteTokenDistribution domainData={this.props.domainData} domain={domain} />
          <div className='ui divider' />
          { // Only displays the upload commit feature if they have actually committed votes for the challenge
            didCommit
              ? !didReveal
                ? <div className='DidRevealContainer'>
                  <div className='column sixteen wide center aligned RevealActionRow'>
                    <Segment className='LeftSegment' floated='left'>
                      <div className='UploadJSONLabel'>
                        Upload your JSON commit file to reveal your vote:
                      </div>
                      <div className='UploadCommitButtonContainer'>
                        <Button className='UploadCommitButton' basic onClick={this.uploadClick}>Upload Commit &nbsp;<i className='icon long arrow up' /></Button>
                        <input
                          type='file'
                          name='file'
                          id='HiddenCommitFile'
                          ref='HiddenFileUploader' style={{ display: 'none' }}
                          onChange={this.onFileInput}
                          className='ui file' />
                      </div>
                    </Segment>
                    <Segment className='RightSegment' floated='right'>
                      <div className='ManualJSONInputLabel'>
                        If you misplaced your JSON commit file, you can enter the information below to reveal:
                      </div>
                      <div className='VoteRevealLabel'>
                        <span className='VoteRevealLabelText'>
                          Challenge ID:
                        </span>
                        <Input id='DomainVoteRevealChallengeIdInput'
                          value={this.props.domainData.challengeId}
                          className='VoteRevealInput' />
                      </div>
                      <div className='VoteRevealLabel'>
                        <span className='VoteRevealLabelText'>
                          Secret Phrase:
                        </span>
                        <Input id='DomainVoteRevealSaltInput' onChange={this.onSaltChange} className='VoteRevealInput' />
                      </div>
                      <div className='VoteRevealLabel'>
                        <span className='VoteRevealLabelText'>
                          Vote Option:
                        </span>
                        <Dropdown
                          onChange={this.onVoteOptionChange}
                          options={voteOptions}
                          placeholder=''
                          selection
                          id='DomainVoteRevealVoteOption'
                          className='VoteRevealDropdown'
                          value={this.state.voteOption}
                        />
                      </div>
                    </Segment>
                  </div>
                  <div className='SubmitVoteButtonContainer'>
                    <Button
                      className='SubmitVoteButton centered'
                      basic
                      type='submit'
                      onClick={this.onFormSubmit}
                    >
                      Reveal Vote
                    </Button>
                  </div>
                </div>
                : <div className='RevealedDataContainer'>
                  <div className='RevealedVoteOption'>
                    You voted to <span className={revealedVoteOption}>{revealedVoteOption}</span> this domain with
                  </div>
                  <div className='RevealedAmount'>
                    {revealedAmount} ADT
                  </div>
                </div>
              : null
          }
        </div>
        {
          redirectState
            ? null
            : <IndividualGuideModal steps={'RevealGuide'} open={displayRevealModal} />
        }
      </div>
    )
  }

  onVoteOptionChange (event, { value }) {
    this.setState({
      voteOption: parseInt(value, 10)
    })
  }

  onSaltChange (e) {
    this.setState({
      salt: e.target.value
    })
  }

  uploadClick (e) {
    this.refs.HiddenFileUploader.click()
  }

  async getCommit () {
    const { account } = this.state
    const { listingHash } = this.props.domainData

    if (!account) {
      return false
    }

    try {
      const didCommit = await registry.didCommit(listingHash)

      this.setState({
        didCommit: didCommit
      })
    } catch (error) {
      console.error('Get Commit Error: ', error)
      toastr.error('There was an error getting commit')
    }
  }

  async getReveal () {
    const { account } = this.state
    const { listingHash } = this.props.domainData

    if (!account) {
      return false
    }

    try {
      const didReveal = await registry.didReveal(listingHash)
      // await this.getPoll()
      if (didReveal) {
        const response = await window.fetch(`${registryApiURL}/account/rewards?account=${account}&status=revealed`)
        const data = await response.json()
        let newState = {
          revealedVoteOption: '',
          revealedAmount: 0,
          didReveal: true
        }
        data.forEach(eachDomain => {
          if (this.props.domainData.listingHash === eachDomain.listing_hash) {
            newState.revealedVoteOption = eachDomain.choice === 1 ? 'support' : 'oppose'
            newState.revealedAmount = big(eachDomain.num_tokens).div(tenToTheNinth).words[0]
            this.setState(newState)
          }
        })
      }
    } catch (error) {
      console.error('Get Reveal Error: ', error)
      toastr.error('There was an error getting reveal')
    }
  }

  async getPoll () {
    const { listingHash } = this.props.domainData
    try {
      const {
        votesFor,
        votesAgainst,
        commitEndDate,
        revealEndDate
      } = await registry.getChallengePoll(listingHash)

      if (this._isMounted) {
        this.setState({
          votesFor,
          votesAgainst,
          commitEndDate,
          revealEndDate
        })
      }
    } catch (error) {
      console.log('Get Poll Error: ', error)
      toastr.error('There was an error getting poll')
    }
  }

  async getChallenge () {
    const { account } = this.state
    const { listingHash } = this.props.domainData

    if (!account) {
      return false
    }

    try {
      const didChallenge = await registry.didChallenge(listingHash)

      if (this._isMounted) {
        this.setState({
          didChallenge
        })
      }
    } catch (error) {
      console.error('Get Challenge Error: ', error)
      toastr.error('There was an error getting challenge')
    }
  }

  onFormSubmit (event) {
    event.preventDefault()

    this.reveal()
  }

  async reveal () {
    const { salt, voteOption } = this.state
    const { listingHash } = this.props.domainData

    if (!salt) {
      toastr.error('Please enter salt value')
      return false
    }

    if (voteOption === null) {
      toastr.error('Please select a vote option')
      return false
    }

    try {
      const revealed = await registry.revealVote({ listingHash, voteOption, salt })

      // using revealed result to update this container
      let newState = {
        revealedVoteOption: big(revealed.data.logs[0].args.choice).toNumber() === 1 ? 'support' : 'oppose',
        revealedAmount: big(revealed.data.logs[0].args.numTokens).div(tenToTheNinth).words[0],
        didReveal: true
      }
      this.setState(newState)
      PubSub.publish('DomainVoteTokenDistribution.getPoll')
    } catch (error) {
      console.error('Reveal Error: ', error)
      PubSub.publish('TransactionProgressModal.error')
    }
  }

  onFileInput (event) {
    event.preventDefault()
    const file = event.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result

      try {
        const { salt, voteOption, challengeId } = JSON.parse(contents)

        if (this._isMounted) {
          this.setState({
            salt,
            voteOption,
            challengeId
          })
        }

        // find element
        let saltInput = document.querySelector('#DomainVoteRevealSaltInput')
        let voteOptionDropdown = document.querySelector('#DomainVoteRevealVoteOption')

        // create event
        // let event = new Event('input', { bubbles: true })
        // set value
        saltInput.value = salt
        voteOptionDropdown.value = voteOption === 1 ? 'Support' : 'Oppose'
        // trigger event
        // saltInput.dispatchEvent(event)
        // voteOptionDropdown.dispatchEvent(event)
      } catch (error) {
        toastr.error('Invalid Commit JSON file')
        return false
      }
    }

    fr.readAsText(file)
  }

  onCountdownExpire () {
    // allow some time for new block to get mined and reload page
    setTimeout(() => {
      window.location.reload()
    }, 15000)
  }
}

DomainVoteRevealContainer.propTypes = {
  domain: PropTypes.string
}

export default DomainVoteRevealContainer
