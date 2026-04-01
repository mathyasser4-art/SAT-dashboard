const URL = 'https://sat-backend-production.up.railway.app/school/getSchool'

const getAllSchool = (setAllSchools, setLoading) => {
    const Token = localStorage.getItem('O_authDB')
    setLoading(true)
    fetch(`${URL}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setAllSchools(responseJson.allSchools)
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

export default getAllSchool;
