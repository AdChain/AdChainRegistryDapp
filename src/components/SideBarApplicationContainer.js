import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import './SideBarApplicationContainer.css'
import toastr from 'toastr'
import isValidDomain from 'is-valid-domain'
import registry from '../services/registry'
import PublisherApplicationFormInProgress from './PublisherApplicationFormInProgress'
import postJson from '../utils/postJson'

class SideBarApplicationContainer extends Component {
  constructor (props) {
    super()
    this.state = {
      active: false,
      domainDeposit: null,
      inProgress: false,
      minDeposit: '-'
    }

    this.addClass = this.addClass.bind(this)
    this.removeClass = this.removeClass.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  componentWillMount () {
    this.getMinDeposit()
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
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

  async getMinDeposit () {
    const minDeposit = await registry.getMinDeposit()

    if (this._isMounted) {
      this.setState({
        minDeposit: minDeposit
      })
    }
  }

  async onFormSubmit (event) {
    event.preventDefault()

    const {target} = event

    const domain = target.domain.value
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
      toastr.error(error.message)
      if (this._isMounted) {
        this.setState({
          inProgress: false
        })
      }
      return false
    }

    await this.save({
      domain,
      stake
    })

    if (this._isMounted) {
      this.setState({
        inProgress: false
      })
    }
  }

  async save (data) {
    const url = 'https://adchain-registry-api.metax.io/applications'

    const payload = {
      domain: data.domain,
      account: registry.getAccount()
    }

    try {
      await postJson(url, payload)
    } catch (error) {
      toastr.error(error.message)
      console.error(error)
    }
  }

  render () {
    const {
      inProgress,
      active
    } = this.state

    return (
      <div className='ApplicationContainer'>
        <Form
          className={active ? 'ActiveForm' : null}
          onBlur={this.removeClass}
          onSubmit={this.onFormSubmit}>
          <Form.Field>
            <label className='ApplicationLabel DomainUrlLabel'>Domain URL</label>
            <input
              onFocus={this.addClass}
              className='ApplicationInput'
              name='domain'
              placeholder='domain.com' />
          </Form.Field>
          <Form.Field>
            <label className='ApplicationLabel'>ADT to Stake (min. 10,000)</label>
            <input
              onFocus={this.addClass}
              className='ApplicationInput'
              name='stake'
              placeholder='10,000'
              />
          </Form.Field>
          <Button basic className='ApplicationButton' type='submit'>Apply Domain</Button>
        </Form>
        {inProgress ? <PublisherApplicationFormInProgress /> : null}
      </div>
    )
  }
}

export default SideBarApplicationContainer
