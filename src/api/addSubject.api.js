const URL = 'https://sat-backend-production.up.railway.app/subject/addSubject'

const addSubject = (data, setserverOperationError, setServerOperationLoading, setAllSystem) => {
    const Token = localStorage.getItem('O_authDB')
    setServerOperationLoading(true)
    fetch(URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                document.querySelector('.add-subject-popup').classList.replace('d-flex', 'd-none');
                setServerOperationLoading(false)
                setserverOperationError(null)
                setAllSystem(responseJson.allSystem)
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

export default addSubject;
