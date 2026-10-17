const URL = 'https://sat-backend-production.up.railway.app/report/resolveQuestion/';

const resolveQuestionReports = (questionID, resolutionNote, onSuccess, onError) => {
    const token = localStorage.getItem('O_authDB') || localStorage.getItem('O_authWEB') || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['authrization'] = `pracYas09${token}`;
        headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`${URL}${questionID}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ resolutionNote })
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
            if (responseJson.message === 'success' && onSuccess) {
                onSuccess(responseJson);
            } else if (onError) {
                onError(responseJson.message);
            }
        })
        .catch((error) => {
            if (onError) onError(error.message);
        });
};

export default resolveQuestionReports;
