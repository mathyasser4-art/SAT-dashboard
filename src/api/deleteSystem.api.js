const URL = '/api/system/deleteSystem';

const deleteSystem = (systemID, setserverOperationError, setServerOperationLoading, setAllSystem) => {
    setServerOperationLoading(true);
    setserverOperationError(null);

    const Token = localStorage.getItem('O_authDB');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (Token && Token !== 'null' && Token !== 'undefined' && Token !== '') {
        headers['authorization'] = `pracYas09${Token}`;
    }

    fetch(`${URL}/${systemID}`, {
        method: 'DELETE',
        headers
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
                setAllSystem(responseJson.allSystem || []);
                setServerOperationLoading(false);
                setserverOperationError(null);
                document.querySelector('.delete-system-popup')?.classList.replace('d-flex', 'd-none');
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
