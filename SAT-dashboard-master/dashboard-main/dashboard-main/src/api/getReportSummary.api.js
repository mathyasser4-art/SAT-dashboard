const URL = '/api/report/summary';

const getReportSummary = (setPendingCount) => {
    fetch(URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success' && setPendingCount) {
                setPendingCount(responseJson.pendingCount || 0);
            }
        })
        .catch((error) => {
            console.warn('Error fetching report summary:', error);
        });
};

export default getReportSummary;
