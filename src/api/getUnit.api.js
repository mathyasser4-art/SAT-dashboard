import { API_BASE } from '../config/api.config';
const URL = `${API_BASE}/unit/getUnit`

const getUnit = (questionTypeID, subjectID, setAllUnit, setLoading) => {
    setLoading(true)
    fetch(`${URL}/${questionTypeID}/${subjectID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setAllUnit(responseJson.allUnit)
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

export default getUnit;
