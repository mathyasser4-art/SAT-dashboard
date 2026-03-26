const URL = 'https://sat-backend-production.up.railway.app/school/addSchool'
const Token = localStorage.getItem('O_authDB')

const addSchool = (data, setserverOperationError, setServerOperationLoading, setAllSchool) => {
    setServerOperationLoading(true)
    fetch(`${URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                document.querySelector('.add-school-popup').classList.replace('d-flex', 'd-none');
                setServerOperationLoading(false)
                setserverOperationError(null)
                setAllSchool(responseJson.allSchool)
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

export default addSchool;
