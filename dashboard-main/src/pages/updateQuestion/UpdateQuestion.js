import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import getQuestionDetails from '../../api/getQuestionDetails.api'
import updateQuestion from '../../api/updateQuestion.api'
import addAnswerPic from '../../api/addAnswerPic.api'
import updateAutoCorrect from '../../api/updateAutoCorrect.api'
import correctIcon from '../../correct-icon.png'
import '../../reusable.css'
import './UpdateQuestion.css'

const UpdateQuestion = () => {
    const [serverOperationError, setserverOperationError] = useState(null)
    const [serverOperationLoading, setServerOperationLoading] = useState(false)
    const [autoCorrectLoading, setAutoCorrectLoading] = useState(false)
    const [questionDetails, setQuestionDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [serverLoadingPic, setServerLoadingPic] = useState(false)
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [questionPoint, setQuestionPoint] = useState('')
    const [allAnswer, setAllAnswer] = useState([])
    const [questionPic, setQuestionPic] = useState()
    const [answerPic, setAnswerPic] = useState()
    const [previewQuestionPic, setPreviewQuestionPic] = useState()
    const [previewAnswerPic, setPreviewAnswerPic] = useState()
    const [quesionAdded, setQuesionAdded] = useState(false)
    const [quesionFullAdded, setQuesionFullAdded] = useState(false)
    const [questionType, setQuestionType] = useState('')
    const [mcqAnswerFs, setMcqAnswerFs] = useState('')
    const [mcqAnswerSe, setMcqAnswerSe] = useState('')
    const [mcqAnswerTh, setMcqAnswerTh] = useState('')
    const [mcqAnswerFr, setMcqAnswerFr] = useState('')
    const [correctAnswer, setCorrectAnswer] = useState('')

    const { questionID, questionTypeID, unitID, questionTypeName, subjectID } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getQuestion()
    }, [])

    const getQuestion = async () => {
        await getQuestionDetails(questionID, setQuestionDetails, setLoading, setQuestion, setAllAnswer, setQuestionPoint, setQuestionType, setMcqAnswerFs, setMcqAnswerSe, setMcqAnswerTh, setMcqAnswerFr)
    }

    // Strips HTML tags to check if editor content is effectively empty
    const isQuestionEmpty = (html) => !html || html.replace(/<(.|\n)*?>/g, '').trim() === ''

    const selectQuestionPic = (e) => {
        setQuestionPic(e.target.files[0])
        const picUrl = URL.createObjectURL(e.target.files[0])
        setPreviewQuestionPic(picUrl)
    }

    const selectAnswerPic = (e) => {
        setAnswerPic(e.target.files[0])
        const picUrl = URL.createObjectURL(e.target.files[0])
        setPreviewAnswerPic(picUrl)
    }

    const addAnswer = () => {
        if (isQuestionEmpty(answer)) return;
        setAllAnswer(current => [...current, answer]);
        setAnswer(''); // ReactQuill is controlled – clears automatically
    }

    const removeAnswer = (item) => {
        setAllAnswer(current => current.filter(e => e !== item))
    }

    const handleUpadteQuestion = () => {
        if (isQuestionEmpty(question) || questionPoint === ''
            || (allAnswer.length === 0 && questionType === 'Essay')
            || (isQuestionEmpty(mcqAnswerFr) && questionType === 'MCQ')
            || (isQuestionEmpty(mcqAnswerFs) && questionType === 'MCQ')
            || (isQuestionEmpty(mcqAnswerSe) && questionType === 'MCQ')
            || (isQuestionEmpty(mcqAnswerTh) && questionType === 'MCQ')) {
            setserverOperationError('Enter the question data first!')
        } else {
            const data = new FormData()
            if (questionPic) {
                data.append('image', questionPic)
                data.append('questionPic', questionPic)
            }
            data.append('question', question)
            if (questionType == 'Essay') {
                allAnswer.map(item => {
                    data.append('answer', item)
                })
            }
            if (questionType == 'MCQ') {
                if (correctAnswer == '') {
                    data.append('correctAnswer', mcqAnswerFs)
                } else {
                    data.append('correctAnswer', correctAnswer)
                }
                data.append('wrongAnswer', mcqAnswerFs)
                data.append('wrongAnswer', mcqAnswerSe)
                data.append('wrongAnswer', mcqAnswerTh)
                data.append('wrongAnswer', mcqAnswerFr)
            }
            data.append('questionPoints', questionPoint)
            updateQuestion(data, questionID, setserverOperationError, setServerOperationLoading, setQuesionAdded)
        }
    }

    const uploadAnswerPic = () => {
        if (answerPic) {
            const data = new FormData()
            data.append('image', answerPic)
            addAnswerPic(data, questionDetails._id, setserverOperationError, setServerLoadingPic, setQuesionFullAdded, 'update', navigate, questionDetails.chapter, questionTypeID, unitID, questionTypeName, subjectID)
        } else {
            setserverOperationError('Upload the answer picture first!')
        }
    }

    const checkedCorrecrAnswer = (value) => {
        setCorrectAnswer(value)
    }

    const handleUpadteAutoCorrect = () => {
        updateAutoCorrect(questionID, setserverOperationError, setAutoCorrectLoading, setQuestionDetails)
    }

    if (loading) return (<div className='loading-container'><div className='d-flex justify-content-center'><span className="page-loader"></span></div></div>)

    return (
        <div className="update-question">
            <div>
                <p className='text-color head-title'>Update the question</p>
                {(serverOperationError) ? <p className='text-error'>{serverOperationError}</p> : ''}
                {(previewQuestionPic) ? <img className='preview-img' src={previewQuestionPic} alt="" /> : (questionDetails.questionPic) ? <div className='question-pic'>
                    <img src={questionDetails.questionPic} alt="" />
                    <label>
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                        <input className='select-input' type="file" name='images' onChange={selectQuestionPic} accept='.png, .jpg, .jpeg, .webp' />
                    </label>
                </div> : <label>
                    <div>
                        <i className="fa fa-camera" aria-hidden="true"></i>
                        <p>Choose the question picture</p>
                    </div>
                    <input className='select-input' type="file" name='images' onChange={selectQuestionPic} accept='.png, .jpg, .jpeg, .webp' />
                </label>}
                <div className="auto-correct-update d-flex align-items-center">
                    <p>This question is {questionDetails.autoCorrect ? 'Auto Correct' : 'Not Auto Correct'}</p>
                    {autoCorrectLoading ? <p>Waiting...</p> : <p onClick={handleUpadteAutoCorrect}>(Chanage it to {questionDetails.autoCorrect ? 'Not Auto Correct' : 'Auto Correct'})</p>}
                </div>
                <div className="question-editor-wrapper">
                    <RichTextEditor
                        value={question}
                        onChange={setQuestion}
                        placeholder="Type your question here. Click Σ to insert a math formula visually."
                    />
                </div>
                {(questionType == 'Essay') ? <div className="keyboard essay-answer">
                    <div className="essay-math-input">
                        <RichTextEditor
                            value={answer}
                            onChange={setAnswer}
                            placeholder="Type the answer. Click Σ to insert a math formula visually."
                        />
                    </div>
                    <li onClick={addAnswer}>+</li>
                </div> : (questionType == 'MCQ') ? <div className="keyboard mcq-answer d-flex">
                        <div className='mcq-input'>
                            <div className='d-flex align-items-center answer-toggel'>
                                <input type="radio" id="correct_1" defaultChecked value={mcqAnswerFs} name="correct-answer" onChange={e => checkedCorrecrAnswer(e.target.value)} />
                                <p>Answer 1 (Correct answer)</p>
                            </div>
                            <RichTextEditor
                                value={mcqAnswerFs}
                                onChange={setMcqAnswerFs}
                                placeholder="Type answer 1"
                            />
                        </div>
                        <div className='mcq-input'>
                            <div className='d-flex align-items-center answer-toggel'>
                                <input type="radio" id="correct_2" value={mcqAnswerSe} name="correct-answer" onChange={e => checkedCorrecrAnswer(e.target.value)} />
                                <p>Answer 2 (Correct answer)</p>
                            </div>
                            <RichTextEditor
                                value={mcqAnswerSe}
                                onChange={setMcqAnswerSe}
                                placeholder="Type answer 2"
                            />
                        </div>
                        <div className='mcq-input'>
                            <div className='d-flex align-items-center answer-toggel'>
                                <input type="radio" id="correct_3" value={mcqAnswerTh} name="correct-answer" onChange={e => checkedCorrecrAnswer(e.target.value)} />
                                <p>Answer 3 (Correct answer)</p>
                            </div>
                            <RichTextEditor
                                value={mcqAnswerTh}
                                onChange={setMcqAnswerTh}
                                placeholder="Type answer 3"
                            />
                        </div>
                        <div className='mcq-input'>
                            <div className='d-flex align-items-center answer-toggel'>
                                <input type="radio" id="correct_4" value={mcqAnswerFr} name="correct-answer" onChange={e => checkedCorrecrAnswer(e.target.value)} />
                                <p>Answer 4 (Correct answer)</p>
                            </div>
                            <RichTextEditor
                                value={mcqAnswerFr}
                                onChange={setMcqAnswerFr}
                                placeholder="Type answer 4"
                            />
                        </div>
                    </div> : ''}
                <div className='d-flex flex-wrap'>
                    {(allAnswer.length != 0) ? allAnswer.map((item, index) => {
                        return (
                            <div className='answer-item' key={index}>
                                <p dangerouslySetInnerHTML={{ __html: item }} />
                                <span onClick={() => removeAnswer(item)}>x</span>
                            </div>
                        )
                    }) : ''}
                </div>
                <input type="text" placeholder='Enter the question points' value={questionPoint} onChange={e => setQuestionPoint(e.target.value)} />
                {(questionType == 'Graph') ? <div className="d-flex">
                    <img className='graph-preview graph-preview-fs' src={questionDetails.correctPicAnswer} alt="" />
                    <img className='graph-preview' src={questionDetails.wrongPicAnswer[0]} alt="" />
                    <img className='graph-preview' src={questionDetails.wrongPicAnswer[1]} alt="" />
                    <img className='graph-preview' src={questionDetails.wrongPicAnswer[2]} alt="" />
                </div> : ""}
                <div className="d-flex">
                    <button className='button' onClick={handleUpadteQuestion}>{(serverOperationLoading) ? <span className="button-loader"></span> : 'Update'}</button>
                    <Link to={`/chapter/${questionTypeName}/${questionDetails.chapter}/${questionTypeID}/${unitID}/${subjectID}`}><button className='button cancel-button'>Cancel</button></Link>
                </div>
                {(quesionAdded) ? <div className='correct d-flex align-items-center'>
                    <img src={correctIcon} alt="" />
                    <p>Question updated success.</p>
                </div> : ''}
                {(previewAnswerPic) ? <img className='preview-img' src={previewAnswerPic} alt="" /> : (questionDetails.answerPic) ? <div className='question-pic'>
                    <img src={questionDetails.answerPic} alt="" />
                    <label>
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                        <input className='select-input' type="file" name='images' onChange={selectAnswerPic} accept='.png, .jpg, .jpeg, .webp' />
                    </label>
                </div> : <label>
                    <div>
                        <i className="fa fa-camera" aria-hidden="true"></i>
                        <p>Choose the answer picture</p>
                    </div>
                    <input className='select-input' type="file" name='images' onChange={selectAnswerPic} accept='.png, .jpg, .jpeg, .webp' />
                </label>}
                <div className="d-flex">
                    <button className='button answer-button' onClick={uploadAnswerPic}>{(serverLoadingPic) ? <span className="button-loader"></span> : 'Update'}</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateQuestion;
