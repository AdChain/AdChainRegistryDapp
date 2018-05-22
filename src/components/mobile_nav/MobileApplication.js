import React, {Component} from 'react'
import PubSub from 'pubsub-js'
import registry from '../../services/registry'
import './MobileApplication.css'

let minDeposit = '-'

class MobileApplication extends Component{
    constructor(props){
        super(props)
        this.state = {
            show: false
        }
    }

    componentWillMount(){
        this.toggleMobileApplication = PubSub.subscribe('MobileApplication.show', this.show.bind(this))
    }

    render(){
        return(
            <div className={this.state.show ? 'MobileApplication' : 'hide'}>
                <span className='fw-600'>Enter Domain</span><br/>
                <input type='text' placeholder='domain.com'/>
                <br/>
                <span className='fw-600'>Enter Application Reasoning</span>
                <br/>
                <input type='text' placeholder='15 character minimum'/>
                <br/>
                <span>
                    The {minDeposit} ADT staked will remain with the domain applied until it is ether rejected or withdrawn.
                </span>
                <button className='big-blue'>APPLY DOMAIN</button><button className='big-white'>CANCEL</button>
            </div>
        )
    }
    show(){
        this.setState({
            show : !this.state.show
        })
    }
}

export default MobileApplication
