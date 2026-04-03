const URL = 'https://sat-backend-production.up.railway.app/subject/deleteSubject';

const deleteSubject = (subjectID, setserverOperationError, setServerOperationLoading, setAllSystem) => {


    setServerOperationLoading(true);
    fetch(`${URL}/${subjectID}`, {
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
                document.querySelector('.delete-subject-popup')?.classList.replace('d-flex', 'd-none');
            } else {
                setserverOperationError(responseJson.message || 'Failed to delete the subject.');
                setServerOperationLoading(false);
            }
        })
        .catch((error) => {
            setserverOperationError(error.message);
            setServerOperationLoading(false);
        });
};

export default deleteSubject;
