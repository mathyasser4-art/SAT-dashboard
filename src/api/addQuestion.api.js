const URL = '/api/question/addQuestion';

const addQuestion = (data, setserverOperationError, setServerOperationLoading, setQuestionAdded, setQuestionID, questionType, setQuestionGraphAdded) => {

    setServerOperationLoading(true);
    fetch(`${URL}`, {
        method: 'POST',
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
