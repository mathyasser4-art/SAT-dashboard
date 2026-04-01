const URL = 'https://sat-backend-production.up.railway.app/chapter/addChapter'

const addChapter = (data, questionTypeID, subjectID, setserverOperationError, setServerOperationLoading, setAllUnit) => {
    const Token = localStorage.getItem('O_authDB')
    setServerOperationLoading(true)
    fetch(`${URL}/${questionTypeID}/${subjectID}`, {
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
                document.querySelector('.add-chapter-popup').classList.replace('d-flex', 'd-none');
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

export default addChapter;
