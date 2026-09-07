const URL = 'https://sat-backend-production.up.railway.app/system/deleteSystem';

const getHeaders = (hasJson) => {
    const Token = localStorage.getItem('O_authDB');
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
        .then(async (response) => {
            const text = await response.text();
            let responseJson;
            try {
                responseJson = JSON.parse(text);
            } catch (err) {
                throw new Error(`Server returned status ${response.status}. Please check connection or backend routes.`);
            }

            if (response.ok && responseJson.message === 'success') {
                document.querySelector('.delete-system-popup')?.classList.replace('d-flex', 'd-none');
                setServerOperationLoading(false);
                setserverOperationError(null);
                setAllSystem(responseJson.allSystem || []);
            } else {
                setserverOperationError(responseJson.message || 'Failed to delete the system.');
                setServerOperationLoading(false);
            }
        })
        .catch((error) => {
            setserverOperationError(error.message);
            setServerOperationLoading(false);
        });
};

export default deleteSystem;
