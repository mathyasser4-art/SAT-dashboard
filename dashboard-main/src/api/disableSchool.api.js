const URL = 'https://sat-backend-production.up.railway.app/school/disableSchool'
const Token = localStorage.getItem('O_authDB');
const getHeaders = (hasJson) => {
    const headers = {};
    if (hasJson) headers['Content-Type'] = 'application/json';
    if (Token && Token !== 'null' && Token !== 'undefined' && Token !== '') {
        headers['authorization'] = `pracYas09${Token}`;
    }
    return headers;
};

const disableSchool = (schoolID, setAllSchools) => {
    fetch(`${URL}/${schoolID}`, {
        method: 'PUT',
        headers: getHeaders(true),
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
