import React from 'react';
import PropTypes from 'prop-types';
import SurveyForm from './SurveyForm';
import { SurveysList } from './SurveysList';
import update from 'immutability-helper';
import SurveyHeader from './SurveyHeader';
import $ from 'jquery';

export default class Surveys extends React.Component {
  static propTypes = {
    surveys: PropTypes.array
  }

  static defaultProps = {
    surveys: []
  }

  constructor (props, railsContext) {
    super(props)
    this.state = {
      surveys: this.props.surveys,
      isHidden: true
    }
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  componentDidMount() {
    if(this.props.match) {
      $.ajax({
        type: "GET",
        url: `http://localhost:3001/surveys`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({surveys: data});
      })
    }
  }

  addNewSurvey(survey) {
    const surveys = update(this.state.surveys, { $push: [survey]});
    this.setState({
      surveys: surveys.sort(function(a,b){
        return new Date(a.created_at) - new Date(b.created_at);
      })
    });
  }

  render () {
    return (
      <div>
        <SurveyHeader />
        <button onClick={this.toggleHidden.bind(this)} className="new-button" >
          {this.state.isHidden ?
            'Create Survey' :
            'Hide Form'}
        </button>
        <p />
        {!this.state.isHidden && <SurveyForm handleNewSurvey={this.addNewSurvey} />}
        <div className="col-md-4">
          <SurveysList surveys={this.state.surveys} />
        </div>
      </div>
    )
  }
}
