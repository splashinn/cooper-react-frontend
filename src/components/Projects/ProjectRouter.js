import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Projects from './Projects';
import Project from './Project'
import ProjectForm from './ProjectForm';
import ProjectView from './ProjectView';

export default (props) => {
  return (
    <Router>
      <div>
        <Route exact path="/projects" component={Projects} />
        <Route exact path="/projects/:id" component={ProjectView} />
        <Route path="/projects/:id/edit" component={ProjectForm} />
      </div>
    </Router>
  )
}
