import React from 'react';
import PropTypes from 'prop-types';
import Project from './Project'

export const ProjectsList = ({projects}) =>
  <div>
    {projects.map(function(project) {
      return (
        <Project project={project} key={project.id} />
      )
    })}
  </div>

ProjectsList.propTypes = {
  projects: PropTypes.array
}

ProjectsList.defaultProps = {
  projects: []
}
