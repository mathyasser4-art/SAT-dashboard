const URL = 'https://sat-backend-production.up.railway.app/chapter/deleteChapter';

const getHeaders = (hasJson) => {
    const Token = localStorage.getItem('O_authDB');
    const headers = {};
    if (hasJson) headers['Content-Type'] = 'application/json';
    if (Token && Token !== 'null' && Token !== 'undefined' && Token !== '') {
        headers['authorization'] = `pracYas09${Token}`;
    }
    return headers;
};

const deleteChapter = (chapterID, setserverOperationError, setServerOperationLoading, navigate, questionTypeID, unitID, questionTypeName, subjectID) => {
    setServerOperationLoading(true);
    fetch(`${URL}/${chapterID}/${unitID}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    })
        .then(async (response) => {
            const text = await response.text();
            let responseJson;
            try {
                responseJson = JSON.parse(text);
            } catch (err) {
                throw new Error(`Server returned status ${response.status}. Please check connection or backend routes.`);
            }

            if (response.ok && responseJson.message === 'success') {
                navigate(`/unit/${questionTypeName}/${questionTypeID}/${subjectID}`);
                setServerOperationLoading(false);
                setserverOperationError(null);
            } else {
                setserverOperationError(responseJson.message || 'Failed to delete the chapter.');
                setServerOperationLoading(false);
            }
        })
        .catch((error) => {
            setserverOperationError(error.message);
            setServerOperationLoading(false);
        });
};

export default deleteChapter;
