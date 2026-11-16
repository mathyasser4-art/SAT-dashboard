import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import getReportSummary from '../../api/getReportSummary.api';
import '../../reusable.css'
import './QuestionType.css'

const QuestionType = () => {
    const [pendingReportsCount, setPendingReportsCount] = useState(0);

    useEffect(() => {
        getReportSummary(setPendingReportsCount);
    }, []);

    const allQuestionType = [
        {
            _id: "65a4963482dbaac16d820fc6",
            typeOfquestion: "Topic Questions",
        },
        {
            _id: "65a4964b82dbaac16d820fc8",
            typeOfquestion: "Past Papers",
        },
    ]
    return (
        <div className='h-100vh d-flex justify-content-center align-items-center'>
            <div className='question-type-container d-flex justify-content-center align-items-center flex-direction-column'>
                {/* Each exam has the same sections; its systems are kept apart (SAT or EST) */}
                {['SAT', 'EST'].map(exam => (
                    <div key={exam} className='question-type-exam d-flex flex-direction-column align-items-center'>
                        <p className='question-type-exam-name'>{exam}</p>
                        {allQuestionType.map(item => {
                            return (
                                <Link key={item._id} to={`/subject/${item.typeOfquestion}/${item._id}?exam=${exam}`}><button className='button'>{item.typeOfquestion}</button></Link>
                            )
                        })}
                    </div>
                ))}

                <div className='question-type-divider'></div>

                <Link to='/reportedQuestions' className='reported-questions-link' title='View all questions reported by students'>
                    <button className='button reported-questions-home-btn'>
                        <i className="fa fa-flag" aria-hidden="true"></i>
                        <span>Reported Questions</span>
                        {pendingReportsCount > 0 ? (
                            <span className='home-pending-badge'>{pendingReportsCount} Needs Revision</span>
                        ) : (
                            <span className='home-queue-badge'>Queue</span>
                        )}
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default QuestionType;
