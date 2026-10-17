const URL = 'https://sat-backend-production.up.railway.app/report/summary';

const getReportSummary = (setPendingCount) => {
    fetch(URL, {
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
            if (responseJson && responseJson.message === 'success' && setPendingCount) {
                setPendingCount(responseJson.pendingCount || 0);
            }
        })
        .catch((error) => {
            console.warn('Error fetching report summary:', error);
        });
};

export default getReportSummary;
