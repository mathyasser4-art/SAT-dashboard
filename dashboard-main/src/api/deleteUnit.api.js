const URL = 'https://sat-backend-production.up.railway.app/unit/deleteUnit/'
const Token = localStorage.getItem('O_authDB');
const getHeaders = (hasJson) => {
    const headers = {};
    if (hasJson) headers['Content-Type'] = 'application/json';
    if (Token && Token !== 'null' && Token !== 'undefined' && Token !== '') {
        headers['authorization'] = `pracYas09${Token}`;
    }
    return headers;
};

const deleteUnit = (questionTypeID, unitID, subjectID, setserverOperationError, setServerOperationLoading, setAllUnit) => {
    setServerOperationLoading(true)
    fetch(`${URL}${questionTypeID}/${unitID}/${subjectID}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                document.querySelector('.delete-unit-popup').classList.replace('d-flex', 'd-none');
                setServerOperationLoading(false)
                setserverOperationError(null)
                setAllUnit(responseJson.allUnit)
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

export default deleteUnit;
