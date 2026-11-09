import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPayments, approvePayment, rejectPayment } from '../../api/payments.api';
import '../../reusable.css'
import './Payments.css'

const TABS = [
    { status: 'pending', label: 'Waiting for review' },
    { status: 'approved', label: 'Approved' },
    { status: 'rejected', label: 'Rejected' },
];
const METHODS = { instapay: 'InstaPay', vodafone_cash: 'Vodafone Cash' };
const PLAN_NAMES = { monthly: 'Monthly', yearly: 'Yearly' };
const when = (d) => d ? new Date(d).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–';
const day = (d) => d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const PaymentRow = ({ p, onApprove, onReject, busy }) => {
    const [reason, setReason] = useState('');
    const u = p.user || {};
    const activeUntil = u.isSubscribed && u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt) > new Date() ? day(u.subscriptionExpiresAt) : '';
    return (
        <li className={`pay-item pay-${p.status}`}>
            <a className="pay-receipt" href={p.receiptUrl} target="_blank" rel="noreferrer" title="Open the screenshot in full size"
                onClick={(e) => {
                    // Screenshots kept in the database (data: links) cannot be opened as a new tab in most browsers
                    if (p.receiptUrl?.startsWith('data:')) {
                        e.preventDefault();
                        const w = window.open('');
                        if (w) {
                            w.document.title = 'Transfer screenshot';
                            const img = w.document.createElement('img');
                            img.src = p.receiptUrl;
                            img.style.maxWidth = '100%';
                            w.document.body.appendChild(img);
                        }
                    }
                }}>
                <img src={p.receiptUrl} alt={`Transfer screenshot from ${u.userName || 'user'}`} loading="lazy" />
            </a>
            <div className="pay-body">
                <div className="pay-head">
                    <strong className="pay-amount">{Number(p.amount).toLocaleString('en-US')} {p.currency || 'EGP'}</strong>
                    <span className="pay-chip">{PLAN_NAMES[p.plan] || p.plan}</span>
                    <span className="pay-chip pay-chip-method">{METHODS[p.method] || p.method}</span>
                    {p.code && <span className="pay-chip pay-chip-code" title={`${p.discountPercent}% off with a partner's code`}>{p.code} −{p.discountPercent}%</span>}
                    <span className="pay-date">{when(p.createdAt)}</span>
                </div>
                <dl className="pay-details">
                    <dt>Account</dt><dd>{u.userName || 'deleted account'}{u.fullName ? ` (${u.fullName})` : ''} · {u.role || ''}</dd>
                    {u.email && <><dt>Email</dt><dd>{u.email}</dd></>}
                    {u.phone && <><dt>Phone</dt><dd dir="ltr">{u.phone}</dd></>}
                    <dt>Sent from</dt><dd dir="ltr"><strong>{p.senderNumber || '–'}</strong></dd>
                    {p.code && <><dt>Discount code</dt><dd><strong>{p.code}</strong>{p.codeCompany ? ` from ${p.codeCompany}` : ''}: {p.discountPercent}% off {Number(p.originalAmount || p.amount).toLocaleString('en-US')} EGP, so the amount to receive is <strong>{Number(p.amount).toLocaleString('en-US')} EGP</strong></dd></>}
                    {!p.code && u.referralCode && <><dt>Came with code</dt><dd>{u.referralCode} (not used on this payment)</dd></>}
                    {p.note && <><dt>Note</dt><dd dir="auto">{p.note}</dd></>}
                    {activeUntil && <><dt>Now active until</dt><dd>{activeUntil}</dd></>}
                    {p.status === 'approved' && p.activatedUntil && <><dt>Activated until</dt><dd>{day(p.activatedUntil)} (approved {when(p.reviewedAt)})</dd></>}
                    {p.status === 'rejected' && <><dt>Rejected</dt><dd>{p.adminNote} ({when(p.reviewedAt)})</dd></>}
                </dl>
                {p.status !== 'approved' && (
                    <div className="pay-actions">
                        <button type="button" className="pay-approve" disabled={busy} onClick={() => onApprove(p)}>
                            <i className="fa fa-check" aria-hidden="true"></i> Approve and activate {PLAN_NAMES[p.plan]?.toLowerCase()} plan
                        </button>
                        {p.status === 'pending' && (
                            <>
                                <input type="text" value={reason} maxLength={500} onChange={e => setReason(e.target.value)} placeholder="Reason, e.g. The amount is 100 EGP, not 200" dir="auto" />
                                <button type="button" className="pay-reject" disabled={busy || !reason.trim()} onClick={() => onReject(p, reason)}>
                                    <i className="fa fa-times" aria-hidden="true"></i> Reject
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </li>
    );
};

// Users who paid by InstaPay or Vodafone Cash: check the screenshot against the money received,
// then approve (activates the account) or reject (the user sees the reason and can try again)
const Payments = () => {
    const [view, setView] = useState('pending');
    const [items, setItems] = useState([]);
    const [counts, setCounts] = useState({});
    const [payTo, setPayTo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState(null);

    const load = useCallback((v) => {
        setLoading(true);
        getPayments(v)
            .then(d => { setItems(d.items || []); setCounts(d.counts || {}); setPayTo(d.payTo || null); })
            .catch(e => setStatus({ error: true, text: e.message }))
            .finally(() => setLoading(false));
    }, []);
    useEffect(() => { load(view); }, [view, load]);

    const approve = async (p) => {
        const name = p.user?.userName || 'this user';
        if (!window.confirm(`Did you receive ${p.amount} EGP from ${p.senderNumber}? Approving activates the ${PLAN_NAMES[p.plan]?.toLowerCase()} plan for ${name}.`)) return;
        setStatus(null); setBusy(true);
        try {
            const r = await approvePayment(p._id);
            setStatus({ text: `Approved. ${name}'s account is active until ${day(r.payment.activatedUntil)}, and they got a notification.` });
            load(view);
        } catch (e) { setStatus({ error: true, text: e.message }); }
        finally { setBusy(false); }
    };
    const reject = async (p, reason) => {
        setStatus(null); setBusy(true);
        try {
            await rejectPayment(p._id, reason.trim());
            setStatus({ text: `Rejected. ${p.user?.userName || 'The user'} was told why and can upload another screenshot.` });
            load(view);
        } catch (e) { setStatus({ error: true, text: e.message }); }
        finally { setBusy(false); }
    };

    return (
        <div className="pay-container">
            <h1 className="pay-heading"><i className="fa fa-money" aria-hidden="true"></i> Payments</h1>
            <p className="pay-intro">
                Users send 200 EGP (monthly) or 1000 EGP (yearly) by InstaPay or Vodafone Cash
                {payTo ? <> to <strong dir="ltr">{payTo.number}</strong> ({payTo.name})</> : null}, then upload a screenshot of the transfer.
                Check that the money arrived, then approve to activate their account.
                A payment made with a partner's discount code shows the code and the lower amount to receive.
                Make the codes and see what each partner brought on the <Link to="/codes">Discount codes</Link> page.
            </p>

            <div className="pay-tabs" role="tablist">
                {TABS.map(tab => (
                    <button key={tab.status} type="button" role="tab" aria-selected={view === tab.status} className={view === tab.status ? 'active' : ''} onClick={() => setView(tab.status)}>
                        {tab.label}{counts[tab.status] ? <span className={`pay-count ${tab.status === 'pending' ? 'pay-count-alert' : ''}`}>{counts[tab.status]}</span> : null}
                    </button>
                ))}
            </div>

            {status && <p className={status.error ? 'pay-error' : 'pay-ok'} role="status">{status.text}</p>}

            {loading ? (
                <div className='d-flex justify-content-center'><span className="page-loader"></span></div>
            ) : items.length === 0 ? (
                <p className="pay-intro">{view === 'pending' ? 'No payments waiting for review.' : 'Nothing here yet.'}</p>
            ) : (
                <ul className="pay-list">
                    {items.map(p => <PaymentRow key={p._id} p={p} onApprove={approve} onReject={reject} busy={busy} />)}
                </ul>
            )}
        </div>
    );
};

export default Payments;
