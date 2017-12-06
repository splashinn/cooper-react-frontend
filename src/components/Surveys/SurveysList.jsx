import React from 'react';
import PropTypes from 'prop-types';
import Survey from './Survey';

export const SurveysList = ({surveys}) =>
  <div>
    {surveys.map(function(survey) {
      return (
        <Survey survey={survey} key={survey.id} />
      )
    })}
  </div>

SurveysList.propTypes = {
  surveys: PropTypes.array
}

SurveysList.defaultProps = {
  surveys: []
}
