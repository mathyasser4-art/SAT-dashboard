const URL = 'https://sat-backend-production.up.railway.app/report/question/';

const getQuestionReports = (questionID, setReports, setPendingCount) => {
    fetch(`${URL}${questionID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(async (response) => {
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                return null;
            }
        })
        .then((responseJson) => {
            if (responseJson && responseJson.message === 'success') {
                if (setReports) setReports(responseJson.reports || []);
                if (setPendingCount) setPendingCount(responseJson.pendingCount || 0);
            }
        })
        .catch((error) => {
            console.warn('Error fetching question reports:', error);
        });
};

export default getQuestionReports;
