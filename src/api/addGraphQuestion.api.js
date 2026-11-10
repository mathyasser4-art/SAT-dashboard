import { API_BASE } from '../config/api.config';
const URL = `${API_BASE}/question/addGraphQuestion`;

const addGraphQuestion = (data, questionID, setserverOperationError, setServerOperationLoading, setQuestionAdded) => {
    setServerOperationLoading(true);
    fetch(`${URL}/${questionID}`, {
        method: 'PUT',
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
