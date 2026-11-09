import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCodes, createCode, updateCode, deleteCode } from '../../api/payments.api';
import '../../reusable.css'
import './DiscountCodes.css'

// The website the partners send their students to. A link with ?code= applies the code by itself.
const SITE = 'https://satarea.tech';
const linkOf = (code) => `${SITE}/?code=${encodeURIComponent(code)}`;
const egp = (n) => `${Number(n || 0).toLocaleString('en-US')} EGP`;
const day = (d) => d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const dateInput = (d) => d ? new Date(d).toISOString().slice(0, 10) : '';
const EMPTY = { code: '', company: '', percent: '20', commissionPercent: '', expiresAt: '', maxUses: '', note: '' };

// Why a code does not work right now, or '' when it does
const stateOf = (c) => {
    if (!c.active) return 'Off';
    if (c.expiresAt && new Date(c.expiresAt) < new Date()) return 'Expired';
    if (c.maxUses && c.stats.approvedPayments >= c.maxUses) return 'Used up';
    return '';
};

const CodeForm = ({ initial, editing, busy, onSave, onCancel }) => {
    const [f, setF] = useState(initial);
    const set = (k) => (e) => setF({ ...f, [k]: k === 'code' ? e.target.value.toUpperCase().replace(/\s+/g, '') : e.target.value });
    return (
        <form className="dc-form" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
            {!editing && (
                <label>
                    <span>Code</span>
                    <input value={f.code} onChange={set('code')} maxLength={30} placeholder="e.g. NOUR20" required dir="ltr" />
                </label>
            )}
            <label className="dc-wide">
                <span>Company / partner</span>
                <input value={f.company} onChange={set('company')} maxLength={120} placeholder="Who you gave this code to" required dir="auto" />
            </label>
            <label>
                <span>Discount %</span>
                <input type="number" min="1" max="90" value={f.percent} onChange={set('percent')} required />
            </label>
            <label>
                <span>Their commission % <em>(optional)</em></span>
                <input type="number" min="0" max="100" step="0.5" value={f.commissionPercent} onChange={set('commissionPercent')} placeholder="0" />
            </label>
            <label>
                <span>Ends on <em>(optional)</em></span>
                <input type="date" value={f.expiresAt} onChange={set('expiresAt')} />
            </label>
            <label>
                <span>Max payments <em>(optional)</em></span>
                <input type="number" min="1" step="1" value={f.maxUses} onChange={set('maxUses')} placeholder="No limit" />
            </label>
            <label className="dc-wide">
                <span>Note <em>(only you see it)</em></span>
                <input value={f.note} onChange={set('note')} maxLength={500} placeholder="e.g. Facebook ads, deal until June" dir="auto" />
            </label>
            <div className="dc-form-actions">
                <button type="submit" className="dc-primary" disabled={busy}>{editing ? 'Save changes' : 'Create code'}</button>
                {onCancel && <button type="button" onClick={onCancel} disabled={busy}>Cancel</button>}
            </div>
        </form>
    );
};

const CodeRow = ({ c, busy, onSave, onToggle, onDelete, onCopy, copied }) => {
    const [editing, setEditing] = useState(false);
    const s = c.stats;
    const state = stateOf(c);
    const limits = [c.expiresAt && `until ${day(c.expiresAt)}`, c.maxUses && `max ${c.maxUses} payments`].filter(Boolean).join(', ');
    return (
        <li className={`dc-item ${state ? 'dc-off' : ''}`}>
            <div className="dc-item-head">
                <strong className="dc-code" dir="ltr">{c.code}</strong>
                <span className="dc-chip">{c.percent}% off</span>
                {state ? <span className="dc-chip dc-chip-off">{state}</span> : <span className="dc-chip dc-chip-on">Working</span>}
                <span className="dc-company">{c.company}</span>
            </div>

            <div className="dc-stats">
                <div><b>{s.signups}</b><span>students came</span></div>
                <div><b>{s.paidStudents}</b><span>paid</span></div>
                <div><b>{egp(s.revenue)}</b><span>received ({s.approvedPayments} payment{s.approvedPayments === 1 ? '' : 's'})</span></div>
                <div><b>{s.pendingPayments}</b><span>waiting for review</span></div>
                <div><b>{egp(s.discountGiven)}</b><span>discount given</span></div>
                <div><b>{egp(s.commission)}</b><span>their commission{c.commissionPercent ? ` (${c.commissionPercent}%)` : ''}</span></div>
            </div>

            <div className="dc-link">
                <code dir="ltr">{linkOf(c.code)}</code>
                <button type="button" onClick={() => onCopy(c.code)}>
                    <i className={`fa ${copied ? 'fa-check' : 'fa-copy'}`} aria-hidden="true"></i> {copied ? 'Copied' : 'Copy link'}
                </button>
            </div>
            {(limits || c.note) && <p className="dc-meta">{[limits, c.note].filter(Boolean).join(' · ')}</p>}

            {editing ? (
                <CodeForm
                    editing busy={busy}
                    initial={{
                        company: c.company, percent: String(c.percent), commissionPercent: c.commissionPercent ? String(c.commissionPercent) : '',
                        expiresAt: dateInput(c.expiresAt), maxUses: c.maxUses ? String(c.maxUses) : '', note: c.note || '',
                    }}
                    onSave={async (f) => { if (await onSave(c, f)) setEditing(false); }}
                    onCancel={() => setEditing(false)}
                />
            ) : (
                <div className="dc-actions">
                    <button type="button" onClick={() => setEditing(true)} disabled={busy}><i className="fa fa-pencil" aria-hidden="true"></i> Edit</button>
                    <button type="button" onClick={() => onToggle(c)} disabled={busy}>
                        <i className={`fa ${c.active ? 'fa-pause' : 'fa-play'}`} aria-hidden="true"></i> {c.active ? 'Turn off' : 'Turn on'}
                    </button>
                    {s.signups === 0 && s.approvedPayments === 0 && s.pendingPayments === 0 && (
                        <button type="button" className="dc-danger" onClick={() => onDelete(c)} disabled={busy}><i className="fa fa-trash" aria-hidden="true"></i> Delete</button>
                    )}
                </div>
            )}
        </li>
    );
};

// Partners' discount codes: one per advertising company, so each student's company is known.
// Students get the discount by typing the code on the Upgrade page or by opening the partner's link.
const DiscountCodes = () => {
    const [items, setItems] = useState([]);
    const [totals, setTotals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState(null);
    const [formKey, setFormKey] = useState(0);
    const [copied, setCopied] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        getCodes()
            .then(d => { setItems(d.items || []); setTotals(d.totals || null); })
            .catch(e => setStatus({ error: true, text: e.message }))
            .finally(() => setLoading(false));
    }, []);
    useEffect(() => { load(); }, [load]);

    const run = async (work, done) => {
        setStatus(null); setBusy(true);
        try {
            const r = await work();
            setStatus({ text: done(r) });
            load();
            return true;
        } catch (e) {
            setStatus({ error: true, text: e.message });
            return false;
        } finally { setBusy(false); }
    };

    const create = (f) => run(() => createCode(f), (r) => {
        setFormKey(k => k + 1);
        return `${r.code.code} is ready for ${r.code.company}. Send them the code or the link below.`;
    });
    const save = (c, f) => run(() => updateCode(c._id, f), () => `${c.code} saved.`);
    const toggle = (c) => run(() => updateCode(c._id, { active: !c.active }), () => c.active
        ? `${c.code} is off: it no longer gives a discount. Its students and payments stay in the report.`
        : `${c.code} is on again.`);
    const remove = (c) => {
        if (!window.confirm(`Delete the code ${c.code}? Nobody has used it yet.`)) return;
        run(() => deleteCode(c._id), () => `${c.code} deleted.`);
    };
    const copy = async (code) => {
        try {
            await navigator.clipboard.writeText(linkOf(code));
            setCopied(code);
            setTimeout(() => setCopied(''), 2000);
        } catch { window.prompt('Copy the link:', linkOf(code)); }
    };

    return (
        <div className="dc-container">
            <h1 className="dc-heading"><i className="fa fa-tag" aria-hidden="true"></i> Discount codes</h1>
            <p className="dc-intro">
                Make one code for each company or partner that advertises SATAREA. Their students type the code on the
                Upgrade page, or open the partner's link, and get the discount (20% unless you change it). The website shows
                no discount until a code is applied. The first code a student uses stays on their account, so you can see
                below how many students each partner brought, how many paid, and how much. Payments with a code show it on
                the <Link to="/payments">Payments</Link> page, with the lower amount to check.
            </p>

            <section className="dc-card">
                <h2>New code</h2>
                <CodeForm key={formKey} initial={EMPTY} busy={busy} onSave={create} />
            </section>

            {status && <p className={status.error ? 'dc-error' : 'dc-ok'} role="status">{status.text}</p>}

            {totals && items.length > 0 && (
                <div className="dc-totals">
                    <span>All codes:</span>
                    <b>{totals.signups}</b> students came · <b>{totals.paidStudents}</b> paid · <b>{egp(totals.revenue)}</b> received ·
                    <b>{egp(totals.commission)}</b> commission
                </div>
            )}

            {loading ? (
                <div className='d-flex justify-content-center'><span className="page-loader"></span></div>
            ) : items.length === 0 ? (
                <p className="dc-intro">No codes yet. Make the first one above.</p>
            ) : (
                <ul className="dc-list">
                    {items.map(c => (
                        <CodeRow key={c._id} c={c} busy={busy} onSave={save} onToggle={toggle} onDelete={remove} onCopy={copy} copied={copied === c.code} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DiscountCodes;
