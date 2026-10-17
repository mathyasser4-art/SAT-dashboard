import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import getReportedQuestions from '../../api/getReportedQuestions.api';
import updateReportStatus from '../../api/updateReportStatus.api';
import deleteReport from '../../api/deleteReport.api';
import '../../reusable.css';
import './ReportedQuestions.css';

const REASON_LABELS = {
    wrong_answer: { label: 'Wrong Answer Key', color: '#e11d48', bg: '#ffe4e6', icon: 'fa-times-circle' },
    typo: { label: 'Typo / Phrasing Error', color: '#d97706', bg: '#fef3c7', icon: 'fa-font' },
    rendering: { label: 'Formula / Image Bug', color: '#7c3aed', bg: '#ede9fe', icon: 'fa-square-root-variable' },
    confusing: { label: 'Confusing / Incomplete', color: '#2563eb', bg: '#dbeafe', icon: 'fa-question-circle' },
    other: { label: 'Other Issue', color: '#475569', bg: '#f1f5f9', icon: 'fa-info-circle' }
};

const ReportedQuestions = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'resolved' | 'all'
    const [counts, setCounts] = useState({ totalPending: 0, totalResolved: 0, totalCount: 0 });
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        loadReports(activeTab);
    }, [activeTab]);

    const loadReports = (tab) => {
        getReportedQuestions(tab, setReports, setLoading, setCounts, setError);
    };

    const handleStatusUpdate = (reportId, newStatus) => {
        setActionLoading(reportId);
        updateReportStatus(
            reportId,
            newStatus,
            newStatus === 'resolved' ? 'Resolved by admin from Revision Queue' : 'Dismissed by admin',
            () => {
                setActionLoading(null);
                loadReports(activeTab);
            },
            (errMsg) => {
                alert('Error updating report: ' + errMsg);
                setActionLoading(null);
            }
        );
    };

    const handleDelete = (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report record?')) return;
        setActionLoading(reportId);
        deleteReport(
            reportId,
            () => {
                setActionLoading(null);
                loadReports(activeTab);
            },
            (errMsg) => {
                alert('Error deleting report: ' + errMsg);
                setActionLoading(null);
            }
        );
    };

    const getEditUrl = (report) => {
        const qId = report.question?._id || report.question;
        const h = report.hierarchy;

        if (h && h.questionTypeName && h.questionTypeID && h.unitID && h.subjectID) {
            return `/updateQuestion/${encodeURIComponent(h.questionTypeName)}/${qId}/${h.questionTypeID}/${h.unitID}/${h.subjectID}`;
        }
        return `/updateQuestion/${qId}`;
    };

    const filteredReports = reports.filter(r => {
        if (!searchFilter.trim()) return true;
        const term = searchFilter.toLowerCase();
        const qText = (r.question?.question || '').toLowerCase();
        const reason = (r.reason || '').toLowerCase();
        const comment = (r.comment || '').toLowerCase();
        const reporter = (r.reporterName || '').toLowerCase();
        const chap = (r.hierarchy?.chapterName || r.sectionInfo?.chapterName || '').toLowerCase();
        return qText.includes(term) || reason.includes(term) || comment.includes(term) || reporter.includes(term) || chap.includes(term);
    });

    return (
        <div className="reports-page-container">
            {/* Page Header */}
            <div className="reports-page-header">
                <div className="reports-header-text">
                    <div className="reports-title-row">
                        <span className="reports-icon-badge">
                            <i className="fa fa-flag" aria-hidden="true"></i>
                        </span>
                        <h2>Question Revision Queue</h2>
                    </div>
                    <p className="reports-page-subtitle">
                        Student-reported questions requiring review, correction, or LaTeX/answer-key fixes.
                    </p>
                </div>

                <div className="reports-header-actions">
                    <button 
                        className="reports-refresh-btn" 
                        onClick={() => loadReports(activeTab)} 
                        title="Refresh Queue"
                        disabled={loading}
                    >
                        <i className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`} aria-hidden="true"></i>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="reports-controls-bar">
                <div className="reports-tabs-wrap">
                    <button
                        className={`reports-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <span>Pending Revision</span>
                        <span className="reports-pill-count pending">{counts.totalPending}</span>
                    </button>

                    <button
                        className={`reports-tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resolved')}
                    >
                        <span>Resolved</span>
                        <span className="reports-pill-count resolved">{counts.totalResolved}</span>
                    </button>

                    <button
                        className={`reports-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <span>All Reports</span>
                        <span className="reports-pill-count all">{counts.totalCount}</span>
                    </button>
                </div>

                <div className="reports-search-box">
                    <i className="fa fa-search" aria-hidden="true"></i>
                    <input
                        type="text"
                        placeholder="Search by question text, issue, chapter, or student..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                    {searchFilter && (
                        <button className="reports-clear-search" onClick={() => setSearchFilter('')}>×</button>
                    )}
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="reports-loading-box">
                    <div className="reports-spinner"></div>
                    <p>Loading reported questions from database...</p>
                </div>
            ) : error ? (
                <div className="reports-error-box">
                    <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    <p>{error}</p>
                    <button className="button" onClick={() => loadReports(activeTab)}>Retry</button>
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="reports-empty-box">
                    <div className="reports-empty-icon">
                        {activeTab === 'pending' ? '🎉' : '📂'}
                    </div>
                    <h3>
                        {activeTab === 'pending' ? 'No Questions Pending Revision!' : 'No Reports Found'}
                    </h3>
                    <p>
                        {searchFilter
                            ? 'No reported questions match your search query.'
                            : activeTab === 'pending'
                            ? 'All student-reported issues have been reviewed and resolved.'
                            : 'No reports recorded in this view.'}
                    </p>
                </div>
            ) : (
                <div className="reports-list">
                    {filteredReports.map((report) => {
                        const q = report.question;
                        const reasonMeta = REASON_LABELS[report.reason] || REASON_LABELS.other;
                        const dateFormatted = new Date(report.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        });
                        const isPending = report.status === 'pending';
                        const isActionBusy = actionLoading === report._id;

                        return (
                            <div key={report._id} className={`report-card ${report.status}`}>
                                {/* Card Top Row */}
                                <div className="report-card-top">
                                    {/* Hierarchy breadcrumbs */}
                                    <div className="report-breadcrumb">
                                        <i className="fa fa-folder-open-o" aria-hidden="true"></i>
                                        <span>
                                            {report.hierarchy?.questionTypeName || report.sectionInfo?.questionTypeName || 'SAT Practice'}
                                        </span>
                                        {(report.hierarchy?.subjectName || report.sectionInfo?.subjectName) && (
                                            <>
                                                <span className="sep">&rsaquo;</span>
                                                <span>{report.hierarchy?.subjectName || report.sectionInfo?.subjectName}</span>
                                            </>
                                        )}
                                        {(report.hierarchy?.unitName || report.sectionInfo?.unitName) && (
                                            <>
                                                <span className="sep">&rsaquo;</span>
                                                <span>{report.hierarchy?.unitName || report.sectionInfo?.unitName}</span>
                                            </>
                                        )}
                                        {(report.hierarchy?.chapterName || report.sectionInfo?.chapterName) && (
                                            <>
                                                <span className="sep">&rsaquo;</span>
                                                <strong className="chap-highlight">{report.hierarchy?.chapterName || report.sectionInfo?.chapterName}</strong>
                                            </>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <div className="report-status-badges">
                                        <span 
                                            className="report-reason-pill" 
                                            style={{ color: reasonMeta.color, backgroundColor: reasonMeta.bg }}
                                        >
                                            <i className={`fa ${reasonMeta.icon}`} aria-hidden="true"></i>
                                            {reasonMeta.label}
                                        </span>
                                        <span className={`report-state-badge ${report.status}`}>
                                            {report.status === 'pending' ? '⏳ Pending' : report.status === 'resolved' ? '✓ Resolved' : 'Dismissed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Student Comment Box */}
                                {report.comment ? (
                                    <div className="report-comment-banner">
                                        <i className="fa fa-quote-left" aria-hidden="true"></i>
                                        <div className="report-comment-text">
                                            <strong>Student Note:</strong> {report.comment}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="report-no-comment-note">
                                        <em>No additional written comment provided with this report.</em>
                                    </div>
                                )}

                                {/* Question Preview Area */}
                                <div className="report-question-preview">
                                    <div className="report-question-preview-head">
                                        <span className="q-badge">Question Preview</span>
                                        {q?.typeOfAnswer && (
                                            <span className="q-type-badge">Type: {q.typeOfAnswer}</span>
                                        )}
                                        {q?.questionPoints && (
                                            <span className="q-points-badge">{q.questionPoints} pts</span>
                                        )}
                                    </div>

                                    {q ? (
                                        <>
                                            {q.questionPic && (
                                                <div className="report-question-pic">
                                                    <img src={q.questionPic} alt="Question figure" />
                                                </div>
                                            )}
                                            <div 
                                                className="report-question-html"
                                                dangerouslySetInnerHTML={{ __html: q.question }}
                                            />

                                            {/* Answer Key Summary */}
                                            {q.typeOfAnswer === 'MCQ' && (
                                                <div className="report-mcq-meta">
                                                    <span className="meta-label">Correct Answer:</span>
                                                    <span 
                                                        className="meta-correct"
                                                        dangerouslySetInnerHTML={{ __html: q.correctAnswer || 'None set' }}
                                                    />
                                                </div>
                                            )}
                                            {q.typeOfAnswer === 'Essay' && q.answer && q.answer.length > 0 && (
                                                <div className="report-mcq-meta">
                                                    <span className="meta-label">Accepted Answers:</span>
                                                    <span className="meta-correct">{q.answer.join(' | ')}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="report-deleted-q-notice">
                                            ⚠️ This question may have been deleted from the database.
                                        </p>
                                    )}
                                </div>

                                {/* Reporter Metadata & Action Buttons Bar */}
                                <div className="report-card-footer">
                                    <div className="report-meta-info">
                                        <span>
                                            <i className="fa fa-user-circle" aria-hidden="true"></i> {report.reporterName || 'Student'}
                                            {report.reporterEmail && ` (${report.reporterEmail})`}
                                        </span>
                                        <span className="dot">&bull;</span>
                                        <span>
                                            <i className="fa fa-clock-o" aria-hidden="true"></i> {dateFormatted}
                                        </span>
                                    </div>

                                    <div className="report-actions-group">
                                        {/* 1-Click Revise / Edit Question Button */}
                                        {q && (
                                            <Link 
                                                to={getEditUrl(report)}
                                                className="report-action-btn edit-btn"
                                                title="Open question editor to revise this question"
                                            >
                                                <i className="fa fa-pencil" aria-hidden="true"></i>
                                                <span>Revise Question</span>
                                            </Link>
                                        )}

                                        {/* Mark as Resolved Button */}
                                        {isPending ? (
                                            <button
                                                type="button"
                                                className="report-action-btn resolve-btn"
                                                onClick={() => handleStatusUpdate(report._id, 'resolved')}
                                                disabled={isActionBusy}
                                                title="Mark as corrected and resolved"
                                            >
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                <span>Mark Resolved</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="report-action-btn unresolve-btn"
                                                onClick={() => handleStatusUpdate(report._id, 'pending')}
                                                disabled={isActionBusy}
                                                title="Reopen this report as pending"
                                            >
                                                <i className="fa fa-undo" aria-hidden="true"></i>
                                                <span>Reopen</span>
                                            </button>
                                        )}

                                        {/* Dismiss / Delete Report Button */}
                                        <button
                                            type="button"
                                            className="report-action-btn delete-btn"
                                            onClick={() => handleDelete(report._id)}
                                            disabled={isActionBusy}
                                            title="Delete this report log"
                                        >
                                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReportedQuestions;
