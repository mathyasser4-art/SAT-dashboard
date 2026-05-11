const URL = '/api/system/deleteSystem';

const deleteSystem = (systemID, setserverOperationError, setServerOperationLoading, setAllSystem) => {


    setServerOperationLoading(true);
    fetch(`${URL}/${systemID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
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
