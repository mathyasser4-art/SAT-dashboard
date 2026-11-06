import React, { useCallback, useEffect, useState } from 'react';
import { getFeedback, moderateFeedback, setSuggestion, deleteFeedback, getWall } from '../../api/feedback.api';
import '../../reusable.css'
import './Feedback.css'

const TABS = [
    { view: 'pending', label: 'Waiting for approval' },
    { view: 'approved', label: 'Approved' },
    { view: 'hidden', label: 'Hidden' },
    { view: 'suggestions', label: 'Suggestions' },
];
const LOVE_LABELS = {
    past_papers: 'Past papers', practice_exams: 'Practice tests', instant_marking: 'Instant marking', ai_copilot: 'AI Copilot',
    live_class: 'LiveClass', mistakes_bank: 'Mistakes bank', progress_charts: 'Progress charts', homework: 'Homework', courses: 'Courses',
};
const stars = (n) => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
const when = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

// How the quote appears on the website
const publicName = (f) => {
    if (f.showName && f.displayName) return f.displayName;
    if (f.role === 'Student' && f.classLabel) return `A ${f.classLabel} student`;
    return `A ${String(f.role || 'user').toLowerCase()}`;
};

const QuoteRow = ({ f, onChange, onRemove }) => (
    <li className="fbk-item">
        <div className="fbk-item-head">
            <span className="fbk-stars" title={`${f.rating} / 5`}>{stars(f.rating)}</span>
            <span className="fbk-meta">{f.author?.userName || 'deleted account'} · {f.role} · {when(f.updatedAt)}</span>
            {f.featured && <span className="fbk-badge">Highlighted</span>}
        </div>
        <p className="fbk-quote" dir="auto">“{f.quote}”</p>
        <div className="fbk-public">
            {f.publish
                ? <>On the website as <strong>{publicName(f)}</strong></>
                : <span className="fbk-private">The author did not allow it on the website (private)</span>}
        </div>
        {f.loves?.length > 0 && <div className="fbk-loves">{f.loves.map(k => <span key={k}>{LOVE_LABELS[k] || k}</span>)}</div>}
        <div className="fbk-actions">
            {f.status !== 'approved' && <button type="button" className="fbk-approve" onClick={() => onChange(f, { status: 'approved' })}><i className="fa fa-check" aria-hidden="true"></i> Approve</button>}
            {f.status === 'approved' && <button type="button" onClick={() => onChange(f, { featured: !f.featured })}><i className="fa fa-star" aria-hidden="true"></i> {f.featured ? 'Remove highlight' : 'Highlight'}</button>}
            {f.status !== 'hidden' && <button type="button" onClick={() => onChange(f, { status: 'hidden' })}><i className="fa fa-eye-slash" aria-hidden="true"></i> Hide</button>}
            {f.status === 'hidden' && <button type="button" onClick={() => onChange(f, { status: 'pending' })}><i className="fa fa-undo" aria-hidden="true"></i> Back to waiting</button>}
            <button type="button" className="fbk-danger" onClick={() => onRemove(f)}><i className="fa fa-trash" aria-hidden="true"></i> Delete</button>
        </div>
    </li>
);

const SuggestionRow = ({ f, onSave }) => {
    const [reply, setReply] = useState(f.adminReply || '');
    return (
        <li className={`fbk-item ${f.suggestionStatus === 'done' ? 'fbk-done' : ''}`}>
            <div className="fbk-item-head">
                <span className={`fbk-status fbk-status-${f.suggestionStatus}`}>{f.suggestionStatus === 'new' ? 'New' : f.suggestionStatus === 'planned' ? 'Planned' : 'Done'}</span>
                <span className="fbk-meta">{f.author?.userName || 'deleted account'} · {f.role} · {when(f.updatedAt)} · {stars(f.rating)}</span>
            </div>
            <p className="fbk-quote" dir="auto">{f.suggestion}</p>
            <label className="fbk-reply">
                <span>Message to the author when you mark it done <em>(optional)</em></span>
                <input type="text" value={reply} maxLength={500} onChange={e => setReply(e.target.value)} placeholder="e.g. Flashcards are now in the Practice menu." dir="auto" />
            </label>
            <div className="fbk-actions">
                {f.suggestionStatus !== 'planned' && <button type="button" onClick={() => onSave(f, { suggestionStatus: 'planned', reply })}><i className="fa fa-calendar" aria-hidden="true"></i> Planned</button>}
                {f.suggestionStatus !== 'done' && <button type="button" className="fbk-approve" onClick={() => onSave(f, { suggestionStatus: 'done', reply })}><i className="fa fa-check" aria-hidden="true"></i> Done, thank them</button>}
                {f.suggestionStatus !== 'new' && <button type="button" onClick={() => onSave(f, { suggestionStatus: 'new', reply })}><i className="fa fa-undo" aria-hidden="true"></i> Back to new</button>}
            </div>
        </li>
    );
};

// Feedback from the website's users: approve quotes for the homepage, read suggestions
const Feedback = () => {
    const [view, setView] = useState('pending');
    const [items, setItems] = useState([]);
    const [counts, setCounts] = useState({});
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    const load = useCallback((v) => {
        setLoading(true);
        getFeedback(v)
            .then(d => { setItems(d.items || []); setCounts(d.counts || {}); })
            .catch(e => setStatus({ error: true, text: e.message }))
            .finally(() => setLoading(false));
        getWall().then(d => setStats(d.stats)).catch(() => {});
    }, []);
    useEffect(() => { load(view); }, [view, load]);

    const change = async (f, changes) => {
        setStatus(null);
        try {
            await moderateFeedback(f._id, changes);
            load(view);
        } catch (e) { setStatus({ error: true, text: e.message }); }
    };
    const remove = async (f) => {
        if (!window.confirm('Delete this feedback for good?')) return;
        try { await deleteFeedback(f._id); load(view); } catch (e) { setStatus({ error: true, text: e.message }); }
    };
    const saveSuggestion = async (f, changes) => {
        setStatus(null);
        try {
            await setSuggestion(f._id, changes);
            if (changes.suggestionStatus === 'done') setStatus({ text: `Marked done. ${f.author?.userName || 'The author'} got a thank-you notification.` });
            load(view);
        } catch (e) { setStatus({ error: true, text: e.message }); }
    };

    return (
        <div className="fbk-container">
            <h1 className="fbk-heading"><i className="fa fa-heart" aria-hidden="true"></i> Feedback</h1>
            <p className="fbk-intro">Students, parents and teachers rate the website and tell you what they love. Quotes appear on the homepage’s Wall of Love only after you approve them, and only if the author allowed it.</p>

            {stats && (
                <div className="fbk-stats">
                    <div><strong>{stats.count ? stats.average.toFixed(1) : '–'}</strong><span>average rating</span></div>
                    <div><strong>{stats.count}</strong><span>ratings</span></div>
                    <div className="fbk-stats-loved"><span>Most loved</span>{stats.mostLoved.length ? stats.mostLoved.map(l => <em key={l.key}>{LOVE_LABELS[l.key] || l.key} {l.percent}%</em>) : <em>–</em>}</div>
                </div>
            )}

            <div className="fbk-tabs" role="tablist">
                {TABS.map(tab => (
                    <button key={tab.view} type="button" role="tab" aria-selected={view === tab.view} className={view === tab.view ? 'active' : ''} onClick={() => setView(tab.view)}>
                        {tab.label}{counts[tab.view] ? <span className="fbk-count">{counts[tab.view]}</span> : null}
                    </button>
                ))}
            </div>

            {status && <p className={status.error ? 'fbk-error' : 'fbk-ok'} role="status">{status.text}</p>}

            {loading ? (
                <div className='d-flex justify-content-center'><span className="page-loader"></span></div>
            ) : items.length === 0 ? (
                <p className="fbk-intro">Nothing here yet.</p>
            ) : (
                <ul className="fbk-list">
                    {items.map(f => view === 'suggestions'
                        ? <SuggestionRow key={f._id} f={f} onSave={saveSuggestion} />
                        : <QuoteRow key={f._id} f={f} onChange={change} onRemove={remove} />)}
                </ul>
            )}
        </div>
    );
};

export default Feedback;
