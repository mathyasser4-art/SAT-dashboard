const URL = 'https://sat-backend-production.up.railway.app/question/addQuestion';
const Token = localStorage.getItem('O_authDB');
const getHeaders = (hasJson) => {
    const headers = {};
    if (hasJson) headers['Content-Type'] = 'application/json';
    if (Token && Token !== 'null' && Token !== 'undefined' && Token !== '') {
        headers['authorization'] = `pracYas09${Token}`;
    }
    return headers;
};

const addQuestion = (data, setserverOperationError, setServerOperationLoading, setQuestionAdded, setQuestionID, questionType, setQuestionGraphAdded) => {
    setServerOperationLoading(true);
    fetch(`${URL}`, {
        method: 'POST',
        headers: getHeaders(false),
        body: data
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                if (questionType === 'Graph Question') {
                    setQuestionGraphAdded(true);
                } else {
                    setQuestionAdded(true);
                }
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

export default addQuestion;
