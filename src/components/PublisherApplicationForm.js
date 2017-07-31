import React, { Component } from 'react'

import './PublisherApplicationForm.css'

class PublisherApplicationForm extends Component {
  render () {
    return (
      <div className='PublisherApplicationForm BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide left aligned'>
            <div className="ui large header">
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
            <form className='ui form'>
              <div className='field required'>
                <label>Domain</label>
                <div className='ui input'>
                  <input type='text' placeholder='example.com' />
                </div>
              </div>
              <div className='field'>
                <label>Site Name</label>
                <div className='ui input'>
                  <input type='text' placeholder='Site Name' />
                </div>
              </div>
              <div className='field'>
                <label>Country Based In</label>
                <div className='ui input'>
                  <input type='text' placeholder='United States' />
                </div>
              </div>
              <div className='two fields'>
                <div className='field'>
                  <label>First Name</label>
                  <div className='ui input'>
                    <input type='text' placeholder='John' />
                  </div>
                </div>
                <div className='field'>
                  <label>Last Name</label>
                  <div className='ui input'>
                    <input type='text' placeholder='Doe' />
                  </div>
                </div>
              </div>
              <div className='field'>
                <label>Email Address</label>
                <div className='ui input'>
                  <input type='text' placeholder='john@example.com' />
                </div>
              </div>
              <div className='field required'>
                <label>Total ADT to Stake</label>
                <div className='ui input'>
                  <input type='text' placeholder='100' />
                </div>
              </div>
              <div className='field'>
                <button className='ui blue submit button'>APPLY</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default PublisherApplicationForm
