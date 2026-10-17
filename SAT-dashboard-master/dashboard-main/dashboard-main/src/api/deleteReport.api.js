const URL = 'https://sat-backend-production.up.railway.app/report/deleteReport/';

const deleteReport = (reportID, onSuccess, onError, setLoading) => {
    if (setLoading) setLoading(true);

    const token = localStorage.getItem('O_authDB') || localStorage.getItem('O_authWEB') || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['authrization'] = `pracYas09${token}`;
        headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`${URL}${reportID}`, {
        method: 'DELETE',
        headers
    })
        .then(async (response) => {
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                throw new Error(`Server returned status ${response.status}`);
            }
        })
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                if (onSuccess) onSuccess();
            } else {
                if (onError) onError(responseJson.message);
            }
            if (setLoading) setLoading(false);
        })
        .catch((error) => {
            if (onError) onError(error.message);
            if (setLoading) setLoading(false);
        });
};

export default deleteReport;
