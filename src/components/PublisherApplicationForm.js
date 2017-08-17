import React, { Component } from 'react'
import toastr from 'toastr'
import isValidDomain from 'is-valid-domain'
import isValidEmail from 'is-valid-email'

import token from '../services/token'
import registry from '../services/registry'

import './PublisherApplicationForm.css'

class PublisherApplicationForm extends Component {
  render () {
    return (
      <div className='PublisherApplicationForm BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide left aligned'>
            <div className='ui large header'>
              Publisher Application
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

  async onFormSubmit (event) {
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

    if (email && !isValidEmail(email)) {
      toastr.error('Invalid email')
      return false
    }

    if (!stake || stake <= 0) {
      toastr.error('ADT Stake must be greater than 0')
      return false
    }


    var sender = '0x0d54cf095baa55f847e4ff4dc23f5a419268ff74'

    var result = null

    try {
      await token.approve(sender, stake)
      /// need timeout here
    result = await registry.apply(domain, stake)
    console.log("RESUL", result)
    } catch (error) {
      console.error(error)
    }

    var prevhash = '0x902ca77bd7c2021be6552351cb18bbf3539c9d08f169185759ae6d58fdc96310'
    var otherhash = '0x04a1c146a003919be251e0485f3aae97366fa4ee13a4103d4d37d3cc05c55da7'

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
