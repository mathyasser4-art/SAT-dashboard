import React, { useEffect, useState } from 'react';
import { getNotices, sendNotice, deleteNotice } from '../../api/notices.api';
import '../../reusable.css'
import './Notices.css'

const AUDIENCES = [
    { value: 'all', label: 'Everyone' },
    { value: 'students', label: 'Students' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'parents', label: 'Parents' },
    { value: 'schools', label: 'Schools (school, IT and supervisor accounts)' },
];
const audienceLabel = (value) => (AUDIENCES.find(a => a.value === value) || { label: value || '' }).label;

// Send a notice to the website's users, and see the notices sent and how many read them
const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [audience, setAudience] = useState('all');
    const [link, setLink] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(null);

    const load = () => {
        setLoading(true);
        getNotices()
            .then(d => setNotices(d.notices || []))
            .catch(e => setStatus({ error: true, text: e.message }))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const submit = async (e) => {
        e.preventDefault();
        setStatus(null);
        if (!title.trim() || !message.trim()) return setStatus({ error: true, text: 'Write a title and the notice.' });
        if (!window.confirm(`Send "${title.trim()}" to ${audienceLabel(audience).toLowerCase()}?`)) return;
        setSending(true);
        try {
            const r = await sendNotice({ title, message, audience, link });
            setStatus({ text: `Sent to ${r.sent} ${r.sent === 1 ? 'person' : 'people'}.` });
            setTitle(''); setMessage(''); setLink('');
            load();
        } catch (err) {
            setStatus({ error: true, text: err.message });
        } finally {
            setSending(false);
        }
    };

    const remove = async (n) => {
        if (!window.confirm(`Remove "${n.title}" from everyone's notifications?`)) return;
        try {
            await deleteNotice(n.batch);
            setNotices(list => list.filter(x => x.batch !== n.batch));
        } catch (err) {
            setStatus({ error: true, text: err.message });
        }
    };

    return (
        <div className="notices-container">
            <h1 className="notices-heading"><i className="fa fa-bullhorn" aria-hidden="true"></i> Notices</h1>
            <p className="notices-intro">A notice appears in the notification bell of everyone you choose, on the website and on phones.</p>

            <form className="notices-form" onSubmit={submit}>
                <label>
                    <span>Send to</span>
                    <select value={audience} onChange={e => setAudience(e.target.value)}>
                        {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                </label>
                <label>
                    <span>Title</span>
                    <input type="text" value={title} maxLength={120} onChange={e => setTitle(e.target.value)} placeholder="e.g. Mid-term holiday" dir="auto" />
                </label>
                <label>
                    <span>Notice</span>
                    <textarea value={message} maxLength={2000} rows={5} onChange={e => setMessage(e.target.value)} placeholder="School is closed from 10 to 14 November." dir="auto" />
                    <small>{message.length}/2000</small>
                </label>
                <label>
                    <span>Page it opens <em>(optional)</em></span>
                    <input type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="/system" />
                    <small>A page of the website, starting with /. Leave empty to only show the text.</small>
                </label>
                {status && <p className={status.error ? 'notices-error' : 'notices-ok'} role="status">{status.text}</p>}
                <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send notice'}</button>
            </form>

            <h2 className="notices-subheading">Sent notices</h2>
            {loading ? (
                <div className='d-flex justify-content-center'><span className="page-loader"></span></div>
            ) : notices.length === 0 ? (
                <p className="notices-intro">No notices yet.</p>
            ) : (
                <div className="notices-table">
                    <table>
                        <thead>
                            <tr><th>Sent</th><th>To</th><th>Notice</th><th>Read</th><th></th></tr>
                        </thead>
                        <tbody>
                            {notices.map(n => (
                                <tr key={n.batch}>
                                    <td className="nowrap">{new Date(n.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{audienceLabel(n.audience)}</td>
                                    <td>
                                        <strong dir="auto">{n.title}</strong>
                                        <div className="notices-message" dir="auto">{n.message}</div>
                                        {n.link && <div className="notices-link">Opens {n.link}</div>}
                                    </td>
                                    <td className="nowrap">{n.read} / {n.sent}</td>
                                    <td><button type="button" className="notices-remove" onClick={() => remove(n)} title="Remove from everyone's notifications"><i className="fa fa-trash" aria-hidden="true"></i></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Notices;
