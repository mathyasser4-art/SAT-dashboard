const URL = '/api/report/question/';

const getQuestionReports = (questionID, setReports, setPendingCount) => {
    fetch(`${URL}${questionID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                if (setReports) setReports(responseJson.reports || []);
                if (setPendingCount) setPendingCount(responseJson.pendingCount || 0);
            }
        })
        .catch((error) => {
            console.warn('Error fetching question reports:', error);
        });
};

export default getQuestionReports;
