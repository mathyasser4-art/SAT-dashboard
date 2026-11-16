import React, { useState, useEffect } from 'react';
import getUsers from '../../api/getUsers.api';
import '../../reusable.css'
import './Users.css'

// "16 Nov 2026, 14:05", and "Today, 14:05" / "Yesterday, 14:05" for the last two days
const when = (value) => {
    if (!value) return '—'
    const d = new Date(value)
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    const day = new Date(d); day.setHours(0, 0, 0, 0)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const daysAgo = Math.round((today - day) / 86400000)
    if (daysAgo === 0) return `Today, ${time}`
    if (daysAgo === 1) return `Yesterday, ${time}`
    return `${d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}, ${time}`
}

const Users = () => {
    const [pageLoading, setPageLoading] = useState(false)
    const [allClients, setAllClients] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [signups, setSignups] = useState(null)

    useEffect(() => {
        handleGetMessages()
    }, [])

    const handleGetMessages = () => {
        getUsers(pageNumber, setPageLoading, setAllClients, setPageNumber, setTotalPage, setSignups)
    }

    // Pagination func
    const next = () => {
        let page = 0;
        if (pageNumber == totalPage) {
            return;
        }

        page = pageNumber + 1
        setPageNumber(page)
        getUsers(page, setPageLoading, setAllClients, setPageNumber, setTotalPage, setSignups)
    }

    const previous = () => {
        let page = 0;
        if (pageNumber == 1) {
            return;
        }

        page = pageNumber - 1
        setPageNumber(page)
        getUsers(page, setPageLoading, setAllClients, setPageNumber, setTotalPage, setSignups)
    }
    // Pagination func

    if (pageLoading) return (<div className='loading-container'><div className='d-flex justify-content-center'><span className="page-loader"></span></div></div>)

    return (
        <div className="client-container">
            {signups && (
                <div className="signup-stats">
                    <div className="signup-stat"><strong>{signups.today}</strong><span>Signed up today</span></div>
                    <div className="signup-stat"><strong>{signups.last7Days}</strong><span>Last 7 days</span></div>
                    <div className="signup-stat"><strong>{signups.last30Days}</strong><span>Last 30 days</span></div>
                    <div className="signup-stat"><strong>{signups.total}</strong><span>All sign-ups</span></div>
                </div>
            )}
            {allClients.length == 0 ? '' : <>
                <div className='client-table'>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>email</th>
                            <th>role</th>
                            <th>verify</th>
                            <th>Joined</th>
                            <th>Last active</th>
                        </tr>
                        {allClients.map(client => {
                            return (
                                <tr key={client?._id}>
                                    <td>{client?.userName}</td>
                                    <td>{client?.email}</td>
                                    <td>{client?.role}</td> 
                                    <td>{client.verify ? "true": "false"}</td>
                                    <td className="nowrap">{when(client?.createdAt)}</td>
                                    <td className="nowrap">{client?.lastSeenAt ? when(client.lastSeenAt) : 'Never signed in'}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
                <div className="client-pagination">
                    <button onClick={previous}>Previous</button>
                    <button onClick={next}>Next</button>
                </div>
            </>}
        </div>
    );
}

export default Users;