import React, { Component } from 'react'
import toastr from 'toastr'
import isValidDomain from 'is-valid-domain'
import isValidEmail from 'is-valid-email'

import './PublisherApplicationForm.css'

class PublisherApplicationForm extends Component {
  render () {
    return (
      <div className='PublisherApplicationForm BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide left aligned'>
            <div className='ui large header'>
              PUBLISHER APPLICATION
            </div>
          </div>
          <div className='column sixteen wide left aligned'>
            <p>Please complete the information below in order to apply to the adChain Registry.
          Remember, the total ADT staked on your behalf will be the exact amount needed
          for adToken holders to challenge your application.
            </p>
          </div>
          <div className='column sixteen wide left aligned'>
            <form
              onSubmit={this.onFormSubmit.bind(this)}
              className='ui form'>
              <div className='field required'>
                <label>Domain</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='example.com'
                    name='domain'
                    required
                  />
                </div>
              </div>
              <div className='field'>
                <label>Site Name</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='Site Name'
                    name='siteName'
                  />
                </div>
              </div>
              <div className='field'>
                <label>Country Based In</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='United States'
                    name='country'
                  />
                </div>
              </div>
              <div className='two fields'>
                <div className='field'>
                  <label>First Name</label>
                  <div className='ui input'>
                    <input
                      type='text'
                      placeholder='John'
                      name='firstName'
                    />
                  </div>
                </div>
                <div className='field'>
                  <label>Last Name</label>
                  <div className='ui input'>
                    <input
                      type='text'
                      placeholder='Doe'
                      name='lastName'
                    />
                  </div>
                </div>
              </div>
              <div className='field'>
                <label>Email Address</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='john@example.com'
                    name='email'
                  />
                </div>
              </div>
              <div className='field required'>
                <label>Total ADT to Stake</label>
                <div className='ui input'>
                  <input
                    type='text'
                    placeholder='100'
                    name='stake'
                    required
                  />
                </div>
              </div>
              <div className='field'>
                <button
                  type='submit'
                  className='ui blue submit button'>
                  APPLY
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  onFormSubmit (event) {
    event.preventDefault()
    const {target} = event

    const domain = target.domain.value
    const siteName = target.siteName.value
    const country = target.country.value
    const firstName = target.firstName.value
    const lastName = target.lastName.value
    const email = target.email.value
    const stake = parseInt(target.stake.value, 10)

    if (!isValidDomain(domain)) {
      toastr.error('Invalid domain')
      return false
    }

    if (!isValidEmail(email)) {
      toastr.error('Invalid email')
      return false
    }

    if (!stake || stake <= 0) {
      toastr.error('ADT Stake must be greater than 0')
      return false
    }

    this.save({
      domain,
      siteName,
      country,
      firstName,
      lastName,
      email,
      stake
    })
  }

  save (data) {
    toastr.success('Submitted')
  }
}

export default PublisherApplicationForm
