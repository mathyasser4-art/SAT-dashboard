import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/navbar/Navbar'
import Login from './pages/login/Login'
import QuestionType from './pages/questionType/QuestionType'
import Unit from './pages/unit/Unit'
import Chapter from './pages/chapter/Chapter'
import AddQuestion from './pages/addQuestion/AddQuestion'
import UpdateQuestion from './pages/updateQuestion/UpdateQuestion'
import Subject from './pages/subject/Subject'
import School from './pages/school/School'
import Users from './pages/users/Users'
import AiGenerate from './pages/aiGenerate/AiGenerate'

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('O_authDB');
    setIsAuth(!!token);
    window.addEventListener('error', e => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
  }, []);

  return (
    <>
      <Navbar isAuth={isAuth} />
      <Routes>
        <Route path='/login' element={!isAuth ? <Login /> : <Navigate to='/questionType' />} />
        <Route path='/' element={isAuth ? <Navigate to='/questionType' /> : <Navigate to='/login' />} />
        <Route path='/questionType' element={isAuth ? <QuestionType /> : <Navigate to='/login' />} />
        <Route path='/subject/:questionTypeName/:questionTypeID' element={isAuth ? <Subject /> : <Navigate to='/login' />} />
        <Route path='/unit/:questionTypeName/:questionTypeID/:subjectID' element={isAuth ? <Unit /> : <Navigate to='/login' />} />
        <Route path='/chapter/:questionTypeName/:chapterID/:questionTypeID/:unitID/:subjectID' element={isAuth ? <Chapter /> : <Navigate to='/login' />} />
        <Route path='/addQuestion/:questionTypeName/:chapterName/:chapterID/:questionTypeID/:unitID/:subjectID/:questionNum' element={isAuth ? <AddQuestion /> : <Navigate to='/login' />} />
        <Route path='/updateQuestion/:questionTypeName/:questionID/:questionTypeID/:unitID/:subjectID' element={isAuth ? <UpdateQuestion /> : <Navigate to='/login' />} />
        <Route path='/school' element={isAuth ? <School /> : <Navigate to='/login' />} />
        <Route path='/users' element={isAuth ? <Users /> : <Navigate to='/login' />} />
        <Route path='/aiGenerate/:questionTypeName/:chapterName/:chapterID/:questionTypeID/:unitID/:subjectID' element={isAuth ? <AiGenerate /> : <Navigate to='/login' />} />
      </Routes>
    </>
  );
}

export default App;
