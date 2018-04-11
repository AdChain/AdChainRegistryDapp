import React, { Component } from 'react'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import moment from 'moment'
import { Input, Segment, Button, Dropdown } from 'semantic-ui-react'
import Tooltip from '../Tooltip'

import Countdown from '../CountdownText'
import registry from '../../services/registry'
import DomainVoteTokenDistribution from './DomainVoteTokenDistribution'
import PubSub from 'pubsub-js'

import './DomainVoteRevealContainer.css'

class DomainVoteRevealContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      account: registry.getAccount(),
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
      challengeId: ''
    }

    this.onVoteOptionChange = this.onVoteOptionChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onFileInput = this.onFileInput.bind(this)
    this.uploadClick = this.uploadClick.bind(this)
    this.onSaltChange = this.onSaltChange.bind(this)
  }

  async componentDidMount () {
    this._isMounted = true

    Promise.all([
      this.getListing(),
      this.getPoll(),
      this.getChallenge(),
      this.getCommit(),
      this.getReveal()
    ])
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      revealEndDate,
      didChallenge,
      didCommit,
      didReveal
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
            : null}
          {didReveal ? <div className='column sixteen wide center aligned'>
            <div className='ui message warning'>
              You've <strong>revealed</strong> for this domain.
            </div>
          </div>
            : null}
          <div className='ui divider' />
          <DomainVoteTokenDistribution domain={domain} />
          <div className='ui divider' />
          <div className='column sixteen wide center aligned'>
            <Segment className='LeftSegment' floated='left'>
              <div className='NumberCircleContainer'>
                <div className='NumberCircle'>1</div>
              </div>
                  Upload your JSON commit file to reveal your vote:
              <div className='UploadCommitButtonContainer'>
                <Button className='UploadCommitButton' basic onClick={this.uploadClick}>Upload Commit &nbsp;<i className='icon long arrow up' /></Button>
                <input
                  type='file'
                  name='file'
                  id='HiddenCommitFile'
                  ref='HiddenFileUploader' style={{display: 'none'}}
                  onChange={this.onFileInput}
                  className='ui file' />
              </div>
            </Segment>
            <Segment className='RightSegment' floated='right'>
                If you misplaced your JSON commit file, you can enter the information below to reveal:
              <div className='VoteRevealLabel'>
                <span className='VoteRevealLabelText'>
                    Challenge ID:
                </span>
                <Input id='DomainVoteRevealChallengeIdInput' value={this.state.challengeId} className='VoteRevealInput' />
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

  async getListing () {
    const {domain} = this.state
    const listing = await registry.getListing(domain)

    const {
      applicationExpiry,
      challengeId
    } = listing

    if (this._isMounted) {
      this.setState({
        applicationExpiry,
        challengeId
      })
    }
  }

  async getCommit () {
    const {domain, account} = this.state

    if (!account) {
      return false
    }

    try {
      const didCommit = await registry.didCommit(domain)

      this.setState({
        didCommit: didCommit
      })
    } catch (error) {
      console.error('Get Commit Error: ', error)
      toastr.error('There was an error getting commit')
    }
  }

  async getReveal () {
    const {account, domain} = this.state

    if (!account) {
      return false
    }

    try {
      const didReveal = await registry.didReveal(domain)

      if (this._isMounted) {
        this.setState({
          didReveal: didReveal
        })
      }
    } catch (error) {
      console.error('Get Reveal Error: ', error)
      toastr.error('There was an error getting reveal')
    }
  }

  async getPoll () {
    const {domain} = this.state

    try {
      const {
        votesFor,
        votesAgainst,
        commitEndDate,
        revealEndDate
      } = await registry.getChallengePoll(domain)

      if (this._isMounted) {
        this.setState({
          votesFor,
          votesAgainst,
          commitEndDate,
          revealEndDate
        })
      }
    } catch (error) {
      console.error('Get Poll Error: ', error)
      toastr.error('There was an error getting poll')
    }
  }

  async getChallenge () {
    const {domain, account} = this.state

    if (!account) {
      return false
    }

    try {
      const didChallenge = await registry.didChallenge(domain)

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
    const {domain, salt, voteOption} = this.state

    if (!salt) {
      toastr.error('Please enter salt value')
      return false
    }

    if (voteOption === null) {
      toastr.error('Please select a vote option')
      return false
    }

    try {
      let transactionInfo = {
        src: 'reveal',
        title: 'reveal'
      }
      PubSub.publish('TransactionProgressModal.open', transactionInfo)
      const revealed = await registry.revealVote({domain, voteOption, salt})

      if (revealed) {
        toastr.success('Successfully revealed')

        // TODO: better way of resetting state
        // setTimeout(() => {
        //   window.location.reload()
        // }, 2e3)
      } else {
        toastr.error('There was an error with the reveal process.')
      }
    } catch (error) {
      console.error('Reveal Error: ', error)
      toastr.error('There was an error with your request')
    }
  }

  onFileInput (event) {
    event.preventDefault()
    const file = event.target.files[0]
    const fr = new window.FileReader()

    fr.onload = () => {
      const contents = fr.result

      try {
        const {salt, voteOption, challengeId} = JSON.parse(contents)

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
