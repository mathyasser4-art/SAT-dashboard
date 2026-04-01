const URL = 'https://sat-backend-production.up.railway.app/question/addGraphQuestion';

const addGraphQuestion = (data, setserverOperationError, setServerOperationLoading, setQuestionAdded, setQuestionID) => {
    const Token = localStorage.getItem('O_authDB')
    setServerOperationLoading(true);
    fetch(`${URL}`, {
        method: 'POST',
        headers: {
            'authorization': `pracYas09${Token}`
        },
        body: data
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if (responseJson.message === 'success') {
            setQuestionAdded(true);
            setQuestionID(responseJson.questionData._id);
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
