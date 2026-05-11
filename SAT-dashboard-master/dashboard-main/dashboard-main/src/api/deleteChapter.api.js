const URL = 'https://sat-backend-production.up.railway.app/chapter/deleteChapter';
const Token = localStorage.getItem('O_authDB');

const deleteChapter = (chapterID, setserverOperationError, setServerOperationLoading, navigate, questionTypeID, unitID, questionTypeName, subjectID) => {
    setServerOperationLoading(true);
    fetch(`${URL}/${chapterID}/${unitID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if (responseJson.message === 'success') {
            navigate(`/unit/${questionTypeName}/${questionTypeID}/${subjectID}`);
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

export default deleteChapter;
