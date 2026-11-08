import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/navbar/Navbar'
import QuestionType from './pages/questionType/QuestionType'
import Unit from './pages/unit/Unit'
import Chapter from './pages/chapter/Chapter'
import AddQuestion from './pages/addQuestion/AddQuestion'
import UpdateQuestion from './pages/updateQuestion/UpdateQuestion'
import Subject from './pages/subject/Subject'
import School from './pages/school/School'
import Users from './pages/users/Users'
import Notices from './pages/notices/Notices'
import Feedback from './pages/feedback/Feedback'
import Payments from './pages/payments/Payments'
import ReportedQuestions from './pages/reportedQuestions/ReportedQuestions'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to='/questionType' />} />
        <Route path='/login' element={<Navigate to='/questionType' />} />
        <Route path='/questionType' element={<QuestionType />} />
        <Route path='/subject/:questionTypeName/:questionTypeID' element={<Subject />} />
        <Route path='/unit/:questionTypeName/:questionTypeID/:subjectID' element={<Unit />} />
        <Route path='/chapter/:questionTypeName/:chapterID/:questionTypeID/:unitID/:subjectID' element={<Chapter />} />
        <Route path='/addQuestion/:questionTypeName/:chapterName/:chapterID/:questionTypeID/:unitID/:subjectID/:questionNum' element={<AddQuestion />} />
        <Route path='/updateQuestion/:questionTypeName/:questionID/:questionTypeID/:unitID/:subjectID' element={<UpdateQuestion />} />
        <Route path='/updateQuestion/:questionID' element={<UpdateQuestion />} />
        <Route path='/reportedQuestions' element={<ReportedQuestions />} />
        <Route path='/school' element={<School />} />
        <Route path='/users' element={<Users />} />
        <Route path='/notices' element={<Notices />} />
        <Route path='/feedback' element={<Feedback />} />
        <Route path='/payments' element={<Payments />} />
      </Routes>
    </>
  );
}

export default App;
