const URL = 'https://sat-backend-production.up.railway.app/question/deleteQuestion/'

const deleteQuestion = (questionID, chapterID, setserverOperationError, setServerOperationLoading, setChapterDetails) => {
    const Token = localStorage.getItem('O_authDB')
    setServerOperationLoading(true)
    fetch(`${URL}${questionID}/${chapterID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                document.querySelector('.delete-question-popup')?.classList.replace('d-flex', 'd-none');
                setServerOperationLoading(false)
                setserverOperationError(null)
                setChapterDetails(responseJson.chapter)
            } else {
                setserverOperationError(responseJson.message)
                setServerOperationLoading(false)
            }
        })
        .catch((error) => {
            setserverOperationError(error.message)
            setServerOperationLoading(false)
        });
}

export default deleteQuestion;
