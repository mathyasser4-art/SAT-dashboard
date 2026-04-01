const URL = 'https://sat-backend-production.up.railway.app/question/updateAutoCorrect/'

const updateAutoCorrect = (questionID, setserverOperationError, setAutoCorrectLoading, setQuestionDetails) => {
    const Token = localStorage.getItem('O_authDB')
    setAutoCorrectLoading(true)
    fetch(`${URL}${questionID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        }
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setQuestionDetails(responseJson.question)
                setAutoCorrectLoading(false)
                setserverOperationError(null)
            } else {
                setserverOperationError(responseJson.message)
                setAutoCorrectLoading(false)
            }
        })
        .catch((error) => {
            setserverOperationError(error.message)
            setAutoCorrectLoading(false)
        });
}

export default updateAutoCorrect;
