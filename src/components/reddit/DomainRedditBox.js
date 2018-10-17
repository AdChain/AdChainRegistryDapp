import React, { Component } from 'react'
import _ from 'lodash'
import toastr from 'toastr'
import moment from 'moment'
import PubSub from 'pubsub-js'
import PropTypes from 'prop-types'

import registry from '../../services/registry'
import RedditReasonModal from './RedditReasonModal'
import { Tab, Button, Loader, TextArea } from 'semantic-ui-react'
import { getPosts, createComment, createPostApplication } from '../../services/redditActions'

import './DomainRedditBox.css'

class DomainRedditBox extends Component {
  constructor (props) {
    super()

    const {
      domain,
      description,
      listingHash
    } = props

    this.state = {
      domain,
      account: registry.getAccount(),
      listingHash,
      description,
      appliedObj: {},
      challengedObj: {},
      comment: '',
      redditIdApplied: '',
      redditIdChallenged: '',
      redditTabIndex: 0,
      inProgress: '',
      redditRefreshInProgress: false
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.onCommentSubmit = this.onCommentSubmit.bind(this)
    this.onEnterPress = this.onEnterPress.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.fetchRedditData = this.fetchRedditData.bind(this)
    this.redditRefresh = _.debounce(this.redditRefresh.bind(this), 3e3, { 'leading': true, 'trailing': false })
  }

  componentWillMount () {
    this._isMounted = true
    PubSub.subscribe('DomainRedditBox.fetchRedditData', this.fetchRedditData)
    this.setDomainState(this.props.domainData)
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const { appliedObj, challengedObj, domain, redditTabIndex, inProgress, redditRefreshInProgress } = this.state

    const appliedData = !_.isEmpty(appliedObj) && appliedObj.id && appliedObj.comments.length > 0
      ? appliedObj.comments.map((comment, idx) =>
        <div className='RedditPosts' key={idx}>
          <div className='PostInfo'>
            <span className='PostAuthor'>
              {comment[idx].author}
            </span>
            <span className='PostVotes'>
              {'+' + comment[idx].score}
            </span>
            <span className='PostTime'>
              {moment.unix(comment[idx].created - 28800).fromNow()}
            </span>
          </div>
          <div className='PostContent'>
            {comment[idx].body}
          </div>
        </div>) : <div className={'t-center pd-10 f-os'}>There is currently no discussion for this domain. Feel free to be the first to start the discussion!</div>

    const challengedData = !_.isEmpty(challengedObj) && challengedObj.id && challengedObj.comments.length > 0
      ? challengedObj.comments.map((comment, idx) =>

        <div className='RedditPosts' key={idx}>
          <div className='PostInfo'>
            <span className='PostAuthor'>
              {comment[idx].author}
            </span>
            <span className='PostVotes'>
              {'+' + comment[idx].score}
            </span>
            <span className='PostTime'>
              {moment.unix(comment[idx].created - 28800).fromNow()}
            </span>
          </div>
          <div className='PostContent'>
            {comment[idx].body}
          </div>
        </div>) : <div className={'t-center pd-10 f-os'}>There is currently no discussion for this domain. Feel free to be the first to start the discussion!</div>

    const redditIconSvg = (
      <svg className='redditSvg' width='20px' height='20px' viewBox='0 0 16 14'>
        <defs />
        <g id='Reddit-Feature' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
          <g id='reddit_icon_orange' fillRule='nonzero'>
            <path className='redditPath' d='M10.238,10.444073 C10.323,10.5304706 10.323,10.6713808 10.238,10.7588069 C9.773,11.2339933 9.044,11.4654153 8.007,11.4654153 L7.999,11.4633582 L7.991,11.4654153 C6.955,11.4654153 6.225,11.2339933 5.76,10.7577783 C5.675,10.6713808 5.675,10.5304706 5.76,10.444073 C5.844,10.3576755 5.982,10.3576755 6.067,10.444073 C6.446,10.8318334 7.075,11.0210851 7.991,11.0210851 L7.999,11.0231422 L8.007,11.0210851 C8.922,11.0210851 9.551,10.8318334 9.931,10.444073 C10.016,10.3576755 10.154,10.3576755 10.238,10.444073 Z M15,6.86783235 C15,5.99254307 14.305,5.28079198 13.45,5.28079198 C13.033,5.28079198 12.655,5.4525585 12.376,5.72820777 C11.32,5.01337105 9.891,4.55875546 8.31,4.50012857 L9.175,1.69838005 L11.518,2.26304963 L11.515,2.29802006 C11.515,3.01388532 12.084,3.59604011 12.783,3.59604011 C13.482,3.59604011 14.05,3.01388532 14.05,2.29802006 C14.05,1.5821548 13.482,1 12.783,1 C12.246,1 11.789,1.34456158 11.604,1.8269478 L9.079,1.21805091 C8.969,1.19028028 8.856,1.25610697 8.822,1.36718951 L7.857,4.49190023 C6.201,4.51247107 4.702,4.97120082 3.599,5.70660838 C3.322,5.44433016 2.955,5.27976344 2.549,5.27976344 C1.695,5.28079198 1,5.99254307 1,6.86783235 C1,7.44998714 1.311,7.95397274 1.768,8.23065055 C1.738,8.39933145 1.718,8.57109797 1.718,8.74492157 C1.718,11.091026 4.523,13 7.971,13 C11.419,13 14.224,11.091026 14.224,8.74492157 C14.224,8.58035485 14.207,8.41887375 14.18,8.25944973 C14.666,7.99100026 15,7.47158653 15,6.86783235 Z M6.798,7.95705837 C6.798,7.43558755 6.384,7.01182823 5.876,7.01182823 C5.367,7.01182823 4.953,7.43558755 4.953,7.95705837 C4.953,8.47750064 5.367,8.90125996 5.876,8.90125996 C6.384,8.90228851 6.798,8.47852918 6.798,7.95705837 Z M10.128,7.01285678 C9.619,7.01285678 9.206,7.4366161 9.206,7.95808691 C9.206,8.47852918 9.62,8.90228851 10.128,8.90228851 C10.636,8.90228851 11.05,8.47852918 11.05,7.95808691 C11.05,7.4366161 10.637,7.01285678 10.128,7.01285678 Z' id='Shape' fill='#FF5700' />
            <g className='redditG' id='iconmonstr-reddit-4' transform='translate(4.000000, 6.000000)' fill='#FFFFFF'>
              <path d='M6.238,4.182 C6.323,4.266 6.323,4.403 6.238,4.488 C5.773,4.95 5.044,5.175 4.007,5.175 L3.999,5.173 L3.991,5.175 C2.955,5.175 2.225,4.95 1.76,4.487 C1.675,4.403 1.675,4.266 1.76,4.182 C1.844,4.098 1.982,4.098 2.067,4.182 C2.446,4.559 3.075,4.743 3.991,4.743 L3.999,4.745 L4.007,4.743 C4.922,4.743 5.551,4.559 5.931,4.182 C6.016,4.098 6.154,4.098 6.238,4.182 Z M2.798,1.764 C2.798,1.257 2.384,0.845 1.876,0.845 C1.367,0.845 0.953,1.257 0.953,1.764 C0.953,2.27 1.367,2.682 1.876,2.682 C2.384,2.683 2.798,2.271 2.798,1.764 Z M6.128,0.846 C5.619,0.846 5.206,1.258 5.206,1.765 C5.206,2.271 5.62,2.683 6.128,2.683 C6.636,2.683 7.05,2.271 7.05,1.765 C7.05,1.258 6.637,0.846 6.128,0.846 Z' id='Shape' />
            </g>
          </g>
        </g>
      </svg>
    )

    const loadingMessage = inProgress === 'success'
      ? (
        <div className='LoadingMessage success'>
          <i className='icon big check circle' />
          Your comment was successfully posted!
        </div>
      )
      : inProgress === 'error'
        ? (
          <div className='LoadingMessage error'>
            <i className='icon big remove circle ' />
            There was an error with your submission.
          </div>
        ) : inProgress === 'loading'
          ? (
            <Loader indeterminate active inline='centered' />
          ) : inProgress === 'blank'
            ? (
              <div className='LoadingMessage error'>
                <i className='icon big remove circle ' />
                Please enter a comment.
              </div>
            ) : null

    const panes = [
      {
        menuItem: 'APPLICATION',
        render: () =>
          <Tab.Pane className='RedditTab' attached={false}>
            <div className='RedditActionButtons'>
              <span className='RedditStageLabel'>
                Application Reasoning:
              </span>
              <div className='RedditButtonsContainer'>
                <RedditReasonModal domain={domain} data={appliedObj} view={'application'} />
                <a href={!_.isEmpty(appliedObj) ? appliedObj.url : 'https://reddit.com/r/adchainregistry'} target='_blank' rel='noopener noreferrer'>
                  <Button basic className='RedditButton'>
                    {redditIconSvg}
                  </Button>
                </a>
              </div>
            </div>
            <div className='RedditPostsContainer'>
              {appliedData}
            </div>
            <div className='RedditInputContainer'>
              <form>
                {loadingMessage}
                <TextArea
                  id={!_.isEmpty(appliedObj) ? appliedObj.id : ''}
                  name='appliedComment'
                  placeholder='Comment (press enter to submit)'
                  value={this.state.comment}
                  onChange={this.handleInputChange}
                  onKeyDown={this.onEnterPress}
                />
              </form>
            </div>
          </Tab.Pane>
      }
    ]

    if (!_.isEmpty(challengedObj)) {
      panes.push(
        {
          menuItem: 'CHALLENGE',
          render: () =>
            <Tab.Pane className='RedditTab' attached={false}>
              <div className='RedditActionButtons'>
                <span className='RedditStageLabel'>
                  Challenge Reasoning:
                </span>
                <div className='RedditButtonsContainer'>
                  <RedditReasonModal domain={domain} data={challengedObj} view={'challenge'} />
                  <a href={!_.isEmpty(challengedObj) ? challengedObj.url : 'https://reddit.com/r/adchainregistry'} target='_blank' rel='noopener noreferrer'>
                    <Button basic className='RedditButton'>
                      {redditIconSvg}
                    </Button>
                  </a>
                </div>
              </div>
              <div className='RedditPostsContainer'>
                {challengedData}
              </div>
              <div className='RedditInputContainer'>
                <form>
                  {loadingMessage}
                  <TextArea
                    id={!_.isEmpty(challengedObj) ? challengedObj.id : ''}
                    name='challengedComment'
                    placeholder='Message (press enter to submit)'
                    value={this.state.comment}
                    onChange={this.handleInputChange}
                    onKeyDown={this.onEnterPress}
                  />
                </form>
              </div>
            </Tab.Pane>
        }
      )
    }

    return (
      <div className='DomainRedditBox DomainRedditBox'>
        <div className='HeaderRow'>
          <span className='RedditRefresh'>
            <Button
              basic
              onClick={this.redditRefresh}
            > {
                redditRefreshInProgress ? <Loader active inline='centered' size='mini' /> : <i className='icon small refresh' />
              }
            </Button>
          </span>

        </div>
        <div className='ui grid stackable'>
          <div className='column sixteen wide RedditTabs' style={{ padding: '13px 4px', height: '100%', marginTop: '13px' }}>
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} onTabChange={this.handleTabChange} activeIndex={redditTabIndex} className='TabDiv' />
          </div>
        </div>
      </div>
    )
  }

  async setDomainState (domainData) {
    if (domainData) {
      if (this._isMounted) {
        await this.fetchRedditData()
        switch (domainData.stage) {
          case 'in_registry_in_commit':
          case 'in_registry_in_reveal':
          case 'in_registry_update_status':
          case 'voting_commit':
          case 'voting_reveal':
          case 'reveal_pending':
          case 'apply':
            if (!_.isEmpty(this.state.challengedObj)) {
              this.setState({ redditTabIndex: 1 })
            }
            break
          default:
            break
        }
      }
    }
  }

  handleInputChange (event) {
    if (this._isMounted) {
      this.setState({
        comment: event.target.value
      })
    }
  }

  handleTabChange (event, data) {
    // const { appliedObj, challengedObj } = this.state

    if (this._isMounted) {
      this.setState({
        // redditId: data.activeIndex === 0 ? appliedObj.id : challengedObj.id,
        comment: '',
        redditTabIndex: data.activeIndex,
        inProgress: ''
      })
    }
  }

  async redditRefresh () {
    if (this._isMounted) {
      try {
        this.setState({
          redditRefreshInProgress: true
        })
        await this.fetchRedditData()
        setTimeout(() => {
          this.setState({
            redditRefreshInProgress: false
          })
        }, 3e3)
      } catch (error) {
        console.log(error)
        this.setState({
          redditRefreshInProgress: false
        })
        toastr.error('There was an error fetching the Reddit data')
      }
    }
  }

  async fetchRedditData () {
    try {
      let redditData = await getPosts(this.state.domain)
      if (this._isMounted) {
        this.setState({
          appliedObj: _.isEmpty(redditData.data.applied) ? {} : redditData.data.applied,
          challengedObj: _.isEmpty(redditData.data.challenged) ? {} : redditData.data.challenged,
          redditIdApplied: _.isEmpty(redditData.data.applied) ? null : redditData.data.applied.id,
          redditIdChallenged: _.isEmpty(redditData.data.challenged) ? null : redditData.data.challenged.id

        })
        redditData.data.timeAdded = moment()
      }
      // window.localStorage.setItem(`${this.state.domain}RedditData`, JSON.stringify(redditData.data))
    } catch (error) {
      console.error(error)
      toastr.error('There was an error fetching the reddit data.')
    }
  }

  onEnterPress (e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault()
      this.onCommentSubmit()
    }
  }

  async onCommentSubmit () {
    const { comment, redditTabIndex, domain } = this.state

    let redditId = redditTabIndex === 0 ? this.state.redditIdApplied : this.state.redditIdChallenged
    let redditCommentsObj = redditTabIndex === 0 ? { ...this.state.appliedObj } : { ...this.state.challengedObj }

    if (!comment) {
      if (this._isMounted) {
        this.setState({
          inProgress: 'blank'
        })
        return
      }
    }

    try {
      if (this._isMounted) {
        this.setState({
          inProgress: 'loading'
        })
      }
      if (!redditId) {
        const response = await createPostApplication(domain, 'No reason has been submitted.')
        redditId = response.data.post.post_id
        redditCommentsObj.id = redditId
        redditCommentsObj.url = `https://reddit.com/r/adchainregistry/${redditId.split('_')[1]}`
      }
      let {account} = this.state

      if (!account) {
        account = 'anonymous'
      }
      const result = await createComment(redditId, comment, account)
      const idx = redditCommentsObj.comments ? redditCommentsObj.comments.length : 0

      if (!redditCommentsObj.comments) {
        redditCommentsObj.comments = []
      }
      // console.log(result)
      redditCommentsObj.comments.push({
        [idx]: {
          author: result.data.user,
          body: result.data.comment,
          created: moment().unix() + 28800,
          score: 1
        }
      })

      if (this._isMounted) {
        if (redditTabIndex === 0) {
          this.setState({
            appliedObj: redditCommentsObj,
            inProgress: 'success',
            comment: ''
          })
        } else {
          this.setState({
            challengedObj: redditCommentsObj,
            inProgress: 'success',
            comment: ''
          })
        }
        setTimeout(() => {
          this.setState({
            inProgress: ''
          })
        }, 5e3)
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          comment: '',
          inProgress: 'error'
        })
        console.error(error)
        setTimeout(() => {
          this.setState({
            inProgress: ''
          })
        }, 5e3)
      }
    }
  }
}

DomainRedditBox.propTypes = {
  domain: PropTypes.string,
  description: PropTypes.string
}

export default DomainRedditBox
