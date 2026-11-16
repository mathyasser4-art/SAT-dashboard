const URL = '/api/user/get'

const getUsers = (pageNumber, setLoading, setAllClients, setPageNumber, setTotalPage, setSignups) => {

    setLoading(true)
    fetch(`${URL}?page=${pageNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setAllClients(responseJson.users)
                setPageNumber(responseJson.page)
                setTotalPage(responseJson.totalPages)
                if (setSignups && responseJson.signups) setSignups(responseJson.signups)
                setLoading(false)
            } else {
                setLoading(false)
            }
        })
        .catch((error) => {
            console.log(error.message)
            setLoading(false)
        });
}

export default getUsers;
