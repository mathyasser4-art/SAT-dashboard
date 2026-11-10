import { API_BASE } from '../config/api.config';
const URL = `${API_BASE}/school/disableSchool`

const disableSchool = (schoolID, setAllSchools) => {

    fetch(`${URL}/${schoolID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
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
