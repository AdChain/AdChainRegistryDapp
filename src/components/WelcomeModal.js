import React, { Component } from 'react'
import isMobile from 'is-mobile'
import Button from 'antd/lib/button'
import Steps from 'antd/lib/steps'
import 'antd/lib/button/style/css'
import 'antd/lib/steps/style/css'
import { Modal, Checkbox } from 'semantic-ui-react'
import './WelcomeModal.css'
import PubSub from 'pubsub-js'
import DomainEmailNotifications from './domains/DomainEmailNotifications'
import GovernXLogo from './assets/governx_logo.svg'

const Step = Steps.Step

const steps = [
  {
    title: 'Goal',
    content: <div><b>The Goal</b><br /><p>The goal of the adChain Registry is to provide advertisers with a list of websites that offer high - quality inventory for serving digital ads.</p><br />
      <b>General Overview</b> <p>The adChain Registry is known as a token curated registry (TCR) because it relies on a community of token holders to curate it. The token for the adChain Registry is called adToken (ADT), and curation takes place through various stages of applying, challenging and voting. To sweeten the pot, we built a rewards system to incentivize participants to curate judiciously.</p></div>
  }, {
    title: 'Applying',
    content: <div><b>Applying a Domain</b><p>Anyone can apply a domain into the adChain Registry. All that it requires is a minimum deposit paid in adToken and the URL of the domain being applied.</p><p>For this example, let’s say the minimum is 100 ADT. To apply the website <b><i>example.com</i></b> into the registry, you would simply enter the domain URL and pay 100 adToken. Voila! That’s it. If you make it through the application stage length period without being challenged, then your domain will be admitted into the adChain Registry.</p></div>
  }, {
    title: 'Challenging',
    content: <div><b>Challenging a Domain</b><p>Since applications are open to anyone, there needs to be a method in place to ensure illegitimate or fraudulent websites can’t squeak in. This is where challenging comes into play. Websites in the application phase are eligible to be challenged by anyone at anytime. To issue a challenge, you match the same minimum deposit amount the website made to apply. So if you wanted to challenge <b><i>example.com</i></b>, you would pay 100 adToken to do so.</p></div>
  }, {
    title: 'Voting',
    content: <div><b>Voting on a Domain</b><p>If a website gets challenged, then it kicks-off a voting phase. During the voting phase, all community members can vote to either <i>support</i> or <i>oppose</i> the website being challenged. 1 adToken = 1 vote. So the more tokens that you use, the more votes you can commit.</p><p>If the majority of the community votes to support a website, then it will get added to the registry. If the majority of the community votes to oppose a website, then it will be rejected from the registry.</p><p>It’s as simple as that.</p></div>
  }, {
    title: 'Rewards',
    content:
  <div>
    <b>adToken Rewards</b>
    <p>Applicants, Challengers, and Voters can all earn adToken rewards as a result of winning by majority vote. These are called <a className='WelcomeHyperlinks' href='https://metax.zendesk.com/hc/en-us/articles/115003191314-Special-Dispensation-Rewards' target='_blank' rel='noopener noreferrer'><u>special dispensation rewards</u></a>. If the applicant wins the vote, then the special dispensation is paid out of the challengers minimum deposit, and if the challenger wins the vote, then the special dispensation is paid out of the applicants minimum deposit.</p>
    <p>Voters that voted on the winning side also receive a portion of the special dispensation reward distributed according to their token weight, i.e., the more token used to vote with the bigger the share of the reward. See <a className='WelcomeHyperlinks' href='https://metax.zendesk.com/hc/en-us/articles/115003191294-Claiming-Voter-Rewards' target='_blank' rel='noopener noreferrer'><u>voter rewards</u></a> for more.</p>
  </div>
  }, {
    title: 'Email',
    content:
  <div>
    <b>Sign Up For Email Notifications</b>
    <p>Do you have FOMO? Powered by GovernX, the adChain Registry Daily Digest email notifications are the best way to make sure you don't miss out on everything that happens in the adChain Registry.</p>
    <br />
    <p>Sign up below to receive the adChain Registry Daily Digest:</p>
    <div className='WelcomeEmailFooter'>
      <DomainEmailNotifications />
      <div className='GovernXLogoContainer'>
        <span>Powered By</span><img src={GovernXLogo} alt='GovernX' className='GovernXLogo' />
      </div>
    </div>
  </div>
  }
]

class WelcomeModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      open: true,
      size: 'small',
      returningUser: false,
      displaySettingChanged: false,
      finalButtonText: 'Finish'
    }

    this.open = this.open.bind(this)
    this.updateButtonText = this.updateButtonText.bind(this)
    this.close = this.close.bind(this)
  }
  next () {
    const current = this.state.current + 1
    this.setState({ current })
  }
  prev () {
    const current = this.state.current - 1
    this.setState({ current })
  }
  close () {
    if (this.state.finalButtonText === 'Subscribe') {
      PubSub.publish('DomainEmailNotifications.subscribe')
    }
    if (this.state.displaySettingChanged) {
      window.localStorage.setItem('returningUser', 'true')
    }

    if (this.state.returningUser) {
      window.localStorage.setItem('returningUser', this.state.returningUser ? 'true' : 'false')
    } else {
      window.localStorage.setItem('returningUser', 'false')
    }
    this.setState({
      open: false,
      current: 0,
      finalButtonText: 'Finish'
    })
  }

  updateButtonText (topic, title) {
    this.setState({
      finalButtonText: title
    })
  }

  setReturningUser () {
    this.setState({
      returningUser: true
    })
  }

  open () {
    const displayBox = window.localStorage.getItem('returningUser')
    let displaySettingChanged = false
    let returningUser = false

    if (displayBox === 'true') {
      window.localStorage.setItem('returningUser', 'false')
      displaySettingChanged = true
      returningUser = true
    }
    this.setState({
      open: true,
      displaySettingChanged: displaySettingChanged,
      returningUser: returningUser,
      finalButtonText: 'Finish'
    })
  }

  componentWillMount () {
    this.subEvent = PubSub.subscribe('WelcomeModal.open', this.open)
    this.updateEvent = PubSub.subscribe('WelcomeModal.updateButtonText', this.updateButtonText)
    this.closeEvent = PubSub.subscribe('WelcomeModal.close', this.close)
  }

  render () {
    if (isMobile()) return null
    const { current, open, size, finalButtonText } = this.state
    const returningUser = window.localStorage.getItem('returningUser')

    return (
      !returningUser || returningUser === 'false'
        ? <Modal size={size} open={open} onClose={() => this.close()} closeIcon className='WelcomeModalContainer mobile-hide'>
          <Modal.Header className='WelcomeHeader'><span className='WelcomeHeaderUnderline'>WELCOME TO THE ADCHAIN REGISTRY</span></Modal.Header>
          <Modal.Content>
            <div>
              <Steps progressDot current={current}>
                {steps.map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
              <div className='steps-content'>{steps[this.state.current].content}</div>
              <div className='steps-action'>
                {
                  this.state.current > 0 &&
                  <Button className='WelcomeBackButton' onClick={() => this.prev()}>&lsaquo; Back</Button>
                }
                {
                  this.state.current < steps.length - 1 &&
                  <Button className='WelcomeNextButton' onClick={() => this.next()}>Next &rsaquo;</Button>
                }
                {
                  this.state.current === (steps.length - 1) &&
                  <Button className='WelcomeCloseButton' onClick={() => this.close()}>{finalButtonText}</Button>
                }
              </div>
              <div className='WelcomeCheckBox'>
                <span className='Disclaimer'><a href='https://metax.zendesk.com/hc/en-us/articles/360003427494' target='_blank' rel='noopener noreferrer'>Disclaimer</a></span>
                <Checkbox label="I don't want to see this again" onClick={() => this.setReturningUser()} />
              </div>
            </div>
          </Modal.Content>
        </Modal> : null
    )
  }
}

export default WelcomeModal
