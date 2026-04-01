const URL = 'https://sat-backend-production.up.railway.app/school/updateSchool'

const updateSchool = (data, schoolID, setserverOperationError, setServerOperationLoading, setAllSchools) => {
    const Token = localStorage.getItem('O_authDB')
    setServerOperationLoading(true)
    fetch(`${URL}/${schoolID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setAllSchools(responseJson.allSchools)
                setServerOperationLoading(false)
                setserverOperationError(null)
                document.querySelector('.update-school-popup').classList.replace('d-flex', 'd-none');
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

export default updateSchool;
