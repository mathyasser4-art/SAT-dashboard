const URL = 'https://sat-backend-production.up.railway.app/unit/deleteUnit/'
const Token = localStorage.getItem('O_authDB')

const deleteUnit = (questionTypeID, unitID, subjectID, setserverOperationError, setServerOperationLoading, setAllUnit) => {
    setServerOperationLoading(true)
    fetch(`${URL}${questionTypeID}/${unitID}/${subjectID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
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
