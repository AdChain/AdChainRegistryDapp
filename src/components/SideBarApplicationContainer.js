import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import './SideBarApplicationContainer.css'
import toastr from 'toastr'
import isValidDomain from 'is-valid-domain'
import registry from '../services/registry'
import PublisherApplicationFormInProgress from './PublisherApplicationFormInProgress'
import commafy from 'commafy'
import isMobile from 'is-mobile'
import PubSub from 'pubsub-js'

const windowWidth = window.innerWidth

class SideBarApplicationContainer extends Component {
  constructor (props) {
    super()
    this.state = {
      active: false,
      domainDeposit: null,
      inProgress: false,
      minDeposit: '-',
      domain: ''
    }

    this.addClass = this.addClass.bind(this)
    this.removeClass = this.removeClass.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  async componentWillMount () {
    await this.getMinDeposit()
    this.subEvent = PubSub.subscribe('SideBarApplicationContainer.populateApplicationForm', this.populateApplicationForm.bind(this))
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
    PubSub.unsubscribe(this.subEvent)
  }

  addClass () {
    const currentState = this.state.active
    if (!currentState) {
      this.setState({ active: !currentState })
    }
  }

  removeClass () {
    const currentState = this.state.active
    if (currentState) {
      this.setState({ active: !currentState })
    }
  }

  handleChange (event) {
    this.setState({
      domain: event.target.value
    })
  }

  async onFormSubmit (event) {
    event.preventDefault()

    const {target} = event
    const {domain} = this.state

    const stake = parseInt(target.stake.value.replace(/[^\d]/, ''), 10)
    const minDeposit = (this.state.minDeposit | 0) // coerce

    if (!isValidDomain(domain)) {
      toastr.error('Invalid domain')
      return false
    }

    if (!(stake && stake >= minDeposit)) {
      toastr.error('Deposit must be equal or greater than the minimum required')
      return false
    }

    if (this._isMounted) {
      this.setState({
        inProgress: true
      })
    }

    try {
      await registry.apply(domain, stake)
    } catch (error) {
      console.log(error)
      toastr.error('There was an error with your request')
      if (this._isMounted) {
        this.setState({
          inProgress: false
        })
      }
      return false
    }

    if (this._isMounted) {
      this.setState({
        inProgress: false
      })
    }
  }

  populateApplicationForm (topic, domain) {
    this.applicationFormInput.focus()
    this.setState({
      active: true,
      domain: domain
    })
  }

  render () {
    if (windowWidth < 768 || isMobile()) return null

    const {
      inProgress,
      active
    } = this.state

    return (
      <div className='ApplicationContainer'>
        <Form
          className={active ? 'ActiveForm' : 'JoyrideForm'}
          onBlur={this.removeClass}
          onSubmit={this.onFormSubmit}
          id='ApplicationForm'>
          <Form.Field>
            <label className='ApplicationLabel DomainUrlLabel'>Domain URL</label>
            <input
              onFocus={this.addClass}
              className='ApplicationInput'
              id='ApplicationDomain'
              name='domain'
              ref={(input) => { this.applicationFormInput = input }}
              value={this.state.domain}
              onChange={this.handleChange}
              placeholder='domain.com' />
          </Form.Field>
          <Form.Field>
            <label className='ApplicationLabel'>ADT to Stake (min. {commafy(this.state.minDeposit)})</label>
            <input
              onFocus={this.addClass}
              className='ApplicationInput'
              name='stake'
              placeholder={commafy(this.state.minDeposit)}
            />
          </Form.Field>
          <Button basic className='ApplicationButton' type='submit'>Apply Domain</Button>
        </Form>
        {inProgress ? <PublisherApplicationFormInProgress /> : null}
      </div>
    )
  }

  async getMinDeposit () {
    try {
      const minDeposit = await registry.getMinDeposit()
      this.setState({
        minDeposit: minDeposit.toNumber()
      })
    } catch (error) {
      console.log('error getting min deposit')
    }
  }
}

export default SideBarApplicationContainer
