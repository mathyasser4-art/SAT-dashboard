const URL = '/api/question/updateQuestion/'

const updateQuestion = (data, questionID, setserverOperationError, setServerOperationLoading, setQuesionAdded) => {

    setServerOperationLoading(true)
    fetch(`${URL}${questionID}`, {
        method: 'PUT',
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
