const URL = 'https://sat-backend-production.up.railway.app/user/get'
const Token = localStorage.getItem('O_authDB')

const getUsers = (pageNumber, setLoading, setAllClients, setPageNumber, setTotalPage) => {
    setLoading(true)
    fetch(`${URL}?page=${pageNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                console.log(responseJson.users);
                setAllClients(responseJson.users)
                setPageNumber(responseJson.page)
                setTotalPage(responseJson.totalPages)
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
