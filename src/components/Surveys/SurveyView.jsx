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
        url: `/surveys/${this.props.match.params.id}`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({survey: data});
      })
    }
  }

  render() {
    return (
      <div className="jumbotron">
      <Link to={`/surveys`} >
        Back to Survey Index
      </Link>
      <p />
        <h4>Survey for Project</h4>
        <form>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Project ID</label>
            <div className="col-sm-10">
              <input type="text" readOnly className="form-control-plaintext"
                value={this.state.survey.project_id} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Survey Staff</label>
            <div className="col-sm-10">
              <input type="text" readOnly className="form-control-plaintext"
                value={this.state.survey.survey_staff} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">ABGPS</label>
            <div className="col-sm-10">
              <input type="text" readOnly className="form-control-plaintext"
                value={this.state.survey.abgps} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Control Status</label>
            <div className="col-sm-10">
              <input type="text" readOnly className="form-control-plaintext"
                value={this.state.survey.control_status} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Control</label>
            <div className="col-sm-10">
              <input type="text" readOnly className="form-control-plaintext"
                value={this.state.survey.control} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Results</label>
            <div className="col-sm-10">
              <input type="text" readOnly className="form-control-plaintext"
                value={this.state.survey.results} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Coordinate System</label>
            <div className="col-sm-10">
              <input type="text" readOnly className="form-control-plaintext"
                value={this.state.survey.coordinate_system} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Notes</label>
            <div className="col-sm-10">
              <input type="text" readOnly className="form-control-plaintext"
                value={this.state.survey.notes} />
            </div>
          </div>
        </form>
        <Link to={`/surveys/${this.state.survey.id}/edit`} >
          <button className="edit-button">Edit Survey</button>
        </Link>
        <p />
      </div>
    )
  }
}
