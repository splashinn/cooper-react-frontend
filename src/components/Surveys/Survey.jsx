import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

export default class Survey extends React.Component {
  constructor (props) {
    super(props)
    console.log(`props: ${JSON.stringify(props)}`);
    this.state = {
      survey: props.survey,
      project: props.project
    }
  }

  static propTypes = {
    survey: PropTypes.object
  }

  static defaultProps = {
    survey: {}
  }

  componentDidMount() {
    if(this.props.match) {
      $.ajax({
        type: "GET",
        url: `http://localhost:3001/surveys/${this.props.match.params.id}`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({survey: data});
      })
    }
  }

  render() {
    return (
      <div className="survey">
        <Link to={`/surveys/${this.state.survey.id}`} >
          <h4>Survey for {this.state.survey.project.job_name}</h4>
        </Link>
        <p>Survey Staff: {this.state.survey.survey_staff}</p>
      </div>
    )
  }
}
