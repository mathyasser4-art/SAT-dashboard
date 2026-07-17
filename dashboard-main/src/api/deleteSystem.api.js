const URL = 'https://sat-backend-production.up.railway.app/system/deleteSystem';
const Token = localStorage.getItem('O_authDB');
const getHeaders = (hasJson) => {
    const headers = {};
    if (hasJson) headers['Content-Type'] = 'application/json';
    if (Token && Token !== 'null' && Token !== 'undefined' && Token !== '') {
        headers['authorization'] = `pracYas09${Token}`;
    }
    return headers;
};

const deleteSystem = (systemID, setserverOperationError, setServerOperationLoading, setAllSystem) => {
    setServerOperationLoading(true);
    fetch(`${URL}/${systemID}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if (responseJson.message === 'success') {
            document.querySelector('.delete-system-popup').classList.replace('d-flex', 'd-none');
            setServerOperationLoading(false);
            setserverOperationError(null);
            setAllSystem(responseJson.allSystem);
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

export default deleteSystem;
