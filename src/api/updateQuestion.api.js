const URL = 'https://sat-backend-production.up.railway.app/question/updateQuestion/'

const updateQuestion = (data, questionID, setserverOperationError, setServerOperationLoading, setQuesionAdded) => {

    const headers = {
        'Content-Type': 'application/json'
    }

    setServerOperationLoading(true)
    fetch(`${URL}${questionID}`, {
        method: 'PUT',
        headers,
        body: data
    })
        .then(async (response) => {
            const responseJson = await response.json()

            if (response.ok && (responseJson.message === 'success' || responseJson.updatedQuestion || responseJson.question)) {
                setQuesionAdded(true)
                setServerOperationLoading(false)
                setserverOperationError(null)
            } else {
                setserverOperationError(responseJson.message || 'Failed to update the question.')
                setServerOperationLoading(false)
            }
        })
        .catch((error) => {
            setserverOperationError(error.message)
            setServerOperationLoading(false)
        });
}

export default updateQuestion;
