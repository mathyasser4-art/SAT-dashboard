const URL = '/api/question/getQuestionDetails/'

const getQuestionDetails = (questionID, setQuestionDetails, setLoading, setQuestion, setAllAnswer, setQuestionPoint, setQuestionType, setMcqAnswerFs, setMcqAnswerSe, setMcqAnswerTh, setMcqAnswerFr) => {
    setLoading(true)
    fetch(`${URL}${questionID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setQuestionDetails(responseJson.question)
                setQuestion(responseJson.question.question)
                setAllAnswer(responseJson.question.answer)
                setQuestionPoint(responseJson.question.questionPoints)
                setQuestionType(responseJson.question.typeOfAnswer)
                if (responseJson.question.typeOfAnswer == 'MCQ') {
                    const allMcqAnswers = [
                        responseJson.question.correctAnswer,
                        ...(responseJson.question.wrongAnswer || [])
                    ].filter(Boolean)

                    setMcqAnswerFs(allMcqAnswers[0] || '')
                    setMcqAnswerSe(allMcqAnswers[1] || '')
                    setMcqAnswerTh(allMcqAnswers[2] || '')
                    setMcqAnswerFr(allMcqAnswers[3] || '')
                }
                setLoading(false)
            } else {
                setLoading(false)
            }
        })
        .catch((error) => {
            console.log(error.message)
            setLoading(false)
        });
}

export default getQuestionDetails;
