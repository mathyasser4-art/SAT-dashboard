const URL = '/api/question/addGraphQuestion';

const addGraphQuestion = (data, questionID, setserverOperationError, setServerOperationLoading, setQuestionAdded) => {
    setServerOperationLoading(true);
    const Token = localStorage.getItem('O_authDB')
    fetch(`${URL}/${questionID}`, {
        method: 'PUT',
        headers: {
            'authorization': `pracYas09${Token}`
        },
        body: data
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if (responseJson.message === 'success') {
            setQuestionAdded(true);
            setServerOperationLoading(false);
            setserverOperationError(null);
        } else {
            setserverOperationError(responseJson.message);
            setServerOperationLoading(false);
        }
    })
    .catch((error) => {
        setserverOperationError(error.message);
        setServerOperationLoading(false);
    });
};

export default addGraphQuestion;
