const URL = '/api/chapter/getChapterQuestion/'

const getChapter = (chapterID, setChapterDetails, setLoading) => {
    setLoading(true)
    fetch(`${URL}${chapterID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setChapterDetails(responseJson.chapter)
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

export default getChapter;
