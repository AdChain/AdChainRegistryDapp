import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import './SideBarApplicationContainer.css'

class SideBarApplicationContainer extends Component {
  constructor (props) {
    super()
    this.state = {
      active: false
    }
    this.addClass = this.addClass.bind(this)
    this.removeClass = this.removeClass.bind(this)
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

  render () {
    return (
      <div className='ApplicationContainer'>
        <Form
          className={this.state.active ? 'ActiveForm' : null}
          onBlur={this.removeClass}
        >
          <Form.Field>
            <label className='ApplicationLabel'>Domain URL</label>
            <input
              onFocus={this.addClass}
              className='ApplicationInput'
              placeholder='domain.com' />
          </Form.Field>
          <Form.Field>
            <label className='ApplicationLabel'>ADT to Stake (min. 10,000)</label>
            <input
              onFocus={this.addClass}
              className='ApplicationInput'
              placeholder='10,000' />
          </Form.Field>
          <Button basic className='ApplicationButton' type='submit'>Apply Domain</Button>
        </Form>
      </div>
    )
  }
}

export default SideBarApplicationContainer
