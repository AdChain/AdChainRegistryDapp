import React, { Component } from 'react'
import moment from 'moment'
import { getDomainHistory } from '../../utils/getDomainHistory'


class DomainHistory extends Component {
    constructor(props) {
        super()
        this.state = {
            domainHistory: []
        }
    }

    async componentWillMount() {
        if (this.props.domainData && this.props.domainData.hasOwnProperty('listingHash') && this.props.domainData.listingHash) {
            const domainHistory = await getDomainHistory(this.props.domainData.listingHash)
            this.setState({ domainHistory })
        }
    }

    render() {
        const { domainHistory } = this.state
        if (domainHistory.length < 1) {
            return <div className="ui active inline loader t-center mt-25"></div>
        }
        return (
            <div className="DomainHistoryTableContainer">
                <table className='DomainHistoryTable f-os w-100'>
                    <tbody>
                        <tr>
                            <th>Event</th>
                            <th className="t-center">Date</th>
                            <th className="t-center">View</th>
                        </tr>
                    </tbody>
                    {
                        domainHistory.slice(0).reverse().map((x, i) => {
                            const { style, eventName } = mapEventsToEventNameAndStyle(x.event)
                            const dateString = moment.unix(x.data.block_timestamp).format("MM-DD-YYYY");
                            const truncTX = `${x.data.sender.substring(0, 15)}...`
                            return (
                                <tbody key={x.data.transaction_hash + Math.random()}>
                                    <tr>
                                        <td >{i + 1}. <span className={style}>{eventName}</span><span className="f-12"> by {truncTX}</span> </td>
                                        <td className="t-center">{dateString}</td>
                                        <td className="t-center">
                                            <a className="f-blue fw-200" rel="noopener noreferrer" target='_blank' href={`https://etherscan.io/tx/${x.data.transaction_hash}`}>View TX</a>
                                        </td>
                                    </tr>
                                </tbody>
                            )
                        })
                    }
                </table>
            </div>

        )
    }
}

const mapEventsToEventNameAndStyle = (event) => {
    let style = ''
    let eventName = ''

    switch (event) {
        case 'application_whitelisted':
            style = 'f-green'
            eventName = 'Accepted'
            break;
        case 'challenge_failed':
            style = 'f-green'
            eventName = 'Challenge Failed'
            break;
        case 'application':
            style = 'f-blue'
            eventName = 'Applied'
            break;
        case 'rejected':
            style = 'f-red'
            eventName = 'Rejected'
            break;
        case 'challenge':
            style = 'f-red'
            eventName = 'Challenged'
            break;
        case 'challenge_succeeded':
            style = 'f-red'
            eventName = 'Challenge Succeeded'
            break;
        case 'applications_removed':
        case 'listings_removed':
            style = 'f-red'
            eventName = 'Rejected'
            break;
        default:
            break;
    }
    return { style, eventName }
}

export default DomainHistory