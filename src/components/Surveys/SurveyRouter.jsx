import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Surveys from './Surveys';
import Survey from './Survey';
import SurveyForm from './SurveyForm';
import SurveyView from './SurveyView';

export default (props) => {
  return (
    <Router>
      <div>
        <Route exact path="/surveys" component={Surveys} />
        <Route exact path="/surveys/:id" component={SurveyView} />
        <Route path="/surveys/:id/edit" component={SurveyForm} />
      </div>
    </Router>
  )
}
