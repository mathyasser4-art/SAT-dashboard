const URL = '/api/answer/uploadPic'

const addAnswerPic = (data, setserverOperationError, setServerOperationLoading, setPicSaved) => {

    setServerOperationLoading(true)
    fetch(`${URL}`, {
        method: 'POST',
        body: data
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setPicSaved(true)
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

export default addAnswerPic;
