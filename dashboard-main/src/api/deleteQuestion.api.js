const URL = 'https://sat-backend-production.up.railway.app/question/deleteQuestion/'

const getHeaders = (hasJson) => {
    const Token = localStorage.getItem('O_authDB');
    const headers = {};
    if (hasJson) headers['Content-Type'] = 'application/json';
    if (Token && Token !== 'null' && Token !== 'undefined' && Token !== '') {
        headers['authorization'] = `pracYas09${Token}`;
    }
    return headers;
};

const deleteQuestion = (questionID, chapterID, setserverOperationError, setServerOperationLoading, setChapterDetails) => {
    setServerOperationLoading(true)
    fetch(`${URL}${questionID}/${chapterID}`, {
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
                document.querySelector('.delete-question-popup')?.classList.replace('d-flex', 'd-none');
                setServerOperationLoading(false)
                setserverOperationError(null)
                setChapterDetails(responseJson.chapter)
            } else {
                setserverOperationError(responseJson.message || 'Failed to delete the question.')
                setServerOperationLoading(false)
            }
        })
        .catch((error) => {
            setserverOperationError(error.message)
            setServerOperationLoading(false)
        });
}

export default deleteQuestion;
