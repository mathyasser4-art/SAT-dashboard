const URL = 'https://sat-backend-production.up.railway.app/school/disableSchool'
const Token = localStorage.getItem('O_authDB')

const disableSchool = (schoolID, setAllSchools) => {
    fetch(`${URL}/${schoolID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setAllSchools(responseJson.allSchools)
            } else {
                console.log(responseJson.message)
            }
        })
        .catch((error) => {
            console.log(error.message)
        });
}

export default disableSchool;
