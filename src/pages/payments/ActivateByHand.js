import React, { useEffect, useRef, useState } from 'react';
import { findAccounts, activateAccount } from '../../api/payments.api';

const PLANS = [
    { id: 'monthly', label: '1 month', price: 200 },
    { id: 'yearly', label: '1 year', price: 1000 },
];
const METHODS = { instapay: 'InstaPay', vodafone_cash: 'Vodafone Cash' };
const day = (d) => d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const statusOf = (a) => {
    if (a.subscription?.isSubscribed) {
        return a.subscription.expiresAt ? `Paid, active until ${day(a.subscription.expiresAt)}` : 'Paid (no end date)';
    }
    if (a.trialExpiresAt && new Date(a.trialExpiresAt) > new Date()) return `Free trial until ${day(a.trialExpiresAt)}`;
    return 'Not active';
};

// The money arrived on InstaPay / Vodafone Cash but the student never uploaded a screenshot:
// find the account and activate it. Opening /payments?find=<name> searches straight away.
const ActivateByHand = ({ initialQuery = '', onActivated }) => {
    const [q, setQ] = useState(initialQuery);
    const [accounts, setAccounts] = useState(null);
    const [searching, setSearching] = useState(false);
    const [method, setMethod] = useState('instapay');
    const [sender, setSender] = useState('');
    const [busyId, setBusyId] = useState('');
    const [status, setStatus] = useState(null);
    const started = useRef(false);

    const search = async (text) => {
        const query = text.trim();
        if (query.length < 2) { setStatus({ error: true, text: 'Write at least 2 letters of the name, email or phone.' }); return; }
        setStatus(null); setSearching(true);
        try { setAccounts(await findAccounts(query)); }
        catch (e) { setStatus({ error: true, text: e.message }); }
        finally { setSearching(false); }
    };
    useEffect(() => {
        if (!started.current && initialQuery.trim().length >= 2) { started.current = true; search(initialQuery); }
    }, [initialQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    const activate = async (a, plan) => {
        const name = a.fullName || a.userName;
        if (!window.confirm(`Activate ${name}'s account for ${plan.label} (${plan.price} EGP)? Any time they still have is kept and the ${plan.label} is added after it.`)) return;
        setStatus(null); setBusyId(a._id);
        try {
            const r = await activateAccount({ userId: a._id, plan: plan.id, method, senderNumber: sender.trim() });
            setStatus({ text: `Done. ${name}'s account is active until ${day(r.payment.activatedUntil)}, and they got a notification.` });
            setAccounts(await findAccounts(q.trim()));
            if (onActivated) onActivated();
        } catch (e) { setStatus({ error: true, text: e.message }); }
        finally { setBusyId(''); }
    };

    return (
        <section className="pay-hand" aria-labelledby="pay-hand-title">
            <h2 id="pay-hand-title"><i className="fa fa-bolt" aria-hidden="true"></i> Activate an account by hand</h2>
            <p className="pay-intro">The money arrived but the student did not upload a screenshot? Find their account and activate it.</p>
            <form className="pay-hand-search" onSubmit={(e) => { e.preventDefault(); search(q); }}>
                <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Name, email or phone, e.g. ashraf ata" dir="auto" aria-label="Find an account" />
                <button type="submit" disabled={searching}><i className="fa fa-search" aria-hidden="true"></i> {searching ? 'Searching…' : 'Find'}</button>
            </form>
            <div className="pay-hand-extra">
                <label>Paid by
                    <select value={method} onChange={e => setMethod(e.target.value)}>
                        {Object.entries(METHODS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                    </select>
                </label>
                <label>Sent from (optional)
                    <input type="text" value={sender} maxLength={60} onChange={e => setSender(e.target.value)} placeholder="The number on the transfer" dir="ltr" />
                </label>
            </div>

            {status && <p className={status.error ? 'pay-error' : 'pay-ok'} role="status">{status.text}</p>}

            {accounts && (accounts.length === 0 ? (
                <p className="pay-intro">No account matches “{q.trim()}”. Try only the first name, the email or the phone number.</p>
            ) : (
                <ul className="pay-hand-list">
                    {accounts.map(a => (
                        <li key={a._id}>
                            <div className="pay-hand-who">
                                <strong>{a.fullName || a.userName}</strong>
                                <span>{a.userName}{a.role ? ` · ${a.role}` : ''}</span>
                                {a.email && <span>{a.email}</span>}
                                {a.phone && <span dir="ltr">{a.phone}</span>}
                                <span className={a.subscription?.isSubscribed ? 'pay-hand-on' : 'pay-hand-off'}>{statusOf(a)}</span>
                            </div>
                            <div className="pay-actions">
                                {PLANS.map(plan => (
                                    <button key={plan.id} type="button" className={plan.id === 'monthly' ? 'pay-approve' : ''} disabled={!!busyId} onClick={() => activate(a, plan)}>
                                        <i className="fa fa-check" aria-hidden="true"></i> {busyId === a._id ? 'Activating…' : `Activate ${plan.label}`}
                                    </button>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            ))}
        </section>
    );
};

export default ActivateByHand;
