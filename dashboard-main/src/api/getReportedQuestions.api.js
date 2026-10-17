const URL = 'https://sat-backend-production.up.railway.app/report/all';

const getReportedQuestions = (status = 'pending', setReports, setLoading, setCounts, setError) => {
    if (setLoading) setLoading(true);
    if (setError) setError(null);

    const token = localStorage.getItem('O_authDB') || localStorage.getItem('O_authWEB') || '';
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['authrization'] = `pracYas09${token}`;
        headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`${URL}?status=${status}`, {
        method: 'GET',
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
                if (setReports) setReports(responseJson.reports || []);
                if (setCounts) {
                    setCounts({
                        totalPending: responseJson.totalPending || 0,
                        totalResolved: responseJson.totalResolved || 0,
                        totalCount: responseJson.totalCount || 0
                    });
                }
            } else {
                if (setError) setError(responseJson.message);
            }
            if (setLoading) setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching reported questions:', error);
            if (setError) setError(error.message);
            if (setLoading) setLoading(false);
        });
};

export default getReportedQuestions;
