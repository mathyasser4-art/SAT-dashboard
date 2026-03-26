const URL = 'https://sat-backend-production.up.railway.app/school/deleteSchool';
const Token = localStorage.getItem('O_authDB');

const deleteSchool = (schoolID, setserverOperationError, setServerOperationLoading, setAllSchools) => {
    setServerOperationLoading(true);
    fetch(`${URL}/${schoolID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
        if (responseJson.message === 'success') {
            setAllSchools(responseJson.allSchools);
            setServerOperationLoading(false);
            setserverOperationError(null);
            document.querySelector('.delete-school-popup')?.classList.replace('d-flex', 'd-none');
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

export default deleteSchool;
