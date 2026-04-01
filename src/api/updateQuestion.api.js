const URL = 'https://sat-backend-production.up.railway.app/question/updateQuestion/'

const updateQuestion = (data, questionID, setserverOperationError, setServerOperationLoading, setQuesionAdded) => {
    const Token = localStorage.getItem('O_authDB')
    setServerOperationLoading(true)
    fetch(`${URL}${questionID}`, {
        method: 'PUT',
        headers: {
            'authorization': `pracYas09${Token}`
        }, 
        body: data
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setQuesionAdded(true)
                setServerOperationLoading(false)
                setserverOperationError(null)
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

export default updateQuestion;
