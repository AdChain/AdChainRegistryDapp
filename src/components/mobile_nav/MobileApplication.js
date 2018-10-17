import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import PubSub from 'pubsub-js'
import toastr from 'toastr'
import token from "../../services/token"
import isValidDomain from 'is-valid-domain'
import registry from '../../services/registry'
import './MobileApplication.css'
import { createPostApplication } from '../../services/redditActions'

class MobileApplication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            active: false,
            domainDeposit: null,
            minDeposit: '-',
            domain: '',
            reason: ''
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        this.getMinDeposit()
        this.toggleMobileApplication = PubSub.subscribe('MobileApplication.show', this.show.bind(this))
    }

    render() {
        const { show, minDeposit, domain, reason } = this.state
        return (
            <Form onSubmit={this.onFormSubmit}>
                <div className={show ? 'MobileApplication' : 'hide'}>
                    <span className='fw-600'>Enter Domain</span><br />
                    <input name='domain' value={domain} onChange={this.handleChange} type='text' placeholder='domain.com' />
                    <br />
                    <span className='fw-600'>Enter Application Reasoning</span>
                    <br />
                    <input name="reason" value={reason} onChange={this.handleChange} type='text' placeholder='15 character minimum' />
                    <br />
                    <span>
                        The {minDeposit} ADT staked will remain with the domain applied until it is ether rejected or withdrawn.
                </span>
                    <button type='submit' className='big-green'>APPLY DOMAIN</button>
                    {/*<a onClick={() => { this.show() }} className='big-white'>CANCEL</a>*/}
                </div>
            </Form>
        )
    }

    show() {
        this.setState({
            show: !this.state.show
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async onFormSubmit(event) {
        event.preventDefault()
        
        const { domain, reason } = this.state
        const minDeposit = (this.state.minDeposit | 0) // coerce

        if (domain.startsWith('www.') || domain.startsWith('http') || domain.startsWith('ww.')) {
            toastr.error('Please enter a domain with the following format: domain.com')
            return
        }

        if (!isValidDomain(domain)) {
            toastr.error('Please enter a valid domain')
            return false
        }

        try {
            const adtBalance = await token.getBalance()
            if (adtBalance < minDeposit) {
                toastr.error('You do not have enough ADT to apply this domain')
                return
            }

            const appExists = await registry.applicationExists(domain)
            if (appExists) {
                toastr.error('This domain cannot be applied because it already exists within the registry')
                return
            }
        } catch (error) {
            toastr.error('Error')
        }

    
        if (this.state.reason.length < 15) {
            toastr.error('Application reason must be 15 characters')
          return
        }
        
        try {
            await registry.apply(domain, minDeposit)

            let redditApply = await createPostApplication(domain, reason)

            if (redditApply.data.status === 200) {
              PubSub.publish('DomainProfile.fetchSiteData')
            }
            PubSub.publish('MobileApplication.show')

        } catch (error) {
          console.error(error)
          toastr.error('There was an error with your request')
        }
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

export default MobileApplication
