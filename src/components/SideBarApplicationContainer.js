import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import './SideBarApplicationContainer.css'
import toastr from 'toastr'
import isValidDomain from 'is-valid-domain'
import registry from '../services/registry'

class SideBarApplicationContainer extends Component {
  constructor (props) {
    super()
    this.state = {
      active: false,
      domainDeposit: null
    }
    this.addClass = this.addClass.bind(this)
    this.removeClass = this.removeClass.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
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

  async onFormSubmit (event) {
    event.preventDefault()

    const {target} = event

    console.log(target)
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

    // if (this._isMounted) {
    //   this.setState({
    //     inProgress: true
    //   })
    // }

    try {
      await registry.apply(domain, stake)
    } catch (error) {
      toastr.error(error.message)
      // if (this._isMounted) {
      //   this.setState({
      //     inProgress: false
      //   })
      // }
      return false
    }
    //
    // await this.save({
    //   domain,
    //   stake
    // })

    // if (this._isMounted) {
    //   this.setState({
    //     inProgress: false
    //   })
    // }

    // this.history.push(`/domains?domain=${domain}`)
  }

  render () {
    return (
      <div className='ApplicationContainer'>
        <Form
          className={this.state.active ? 'ActiveForm' : null}
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
      </div>
    )
  }
}

export default SideBarApplicationContainer
