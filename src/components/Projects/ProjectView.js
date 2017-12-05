import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

export default class ProjectView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      project: props.project,
      survey: props.survey
    }
  }

  static propTypes = {
    project: PropTypes.object
  }

  static defaultProps = {
    project: {}
  }

  componentDidMount() {
    if(this.props.match) {
      $.ajax({
        type: "GET",
        url: `/projects/${this.props.match.params.id}`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({project: data});
      })
    }
  }

  render() {
    return (
      <div className="jumbotron">
      <Link to={`/projects`} >
        Back to Project Index
      </Link>
      <p />
      <h4>{this.state.project.job_name}</h4>
      <table className="table">
        <thead className="table-head">
          <tr>
            <th>Job</th>
            <th>Client</th>
            <th>Client Contact</th>
            <th>Project Manager</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="table-body">
          <tr>
            <td>
              {this.state.project.job_name} <br />
              <small>{this.state.project.job_number}</small>
            </td>
            <td>
              {this.state.project.client_name} <br />
              <small>{this.state.project.client_number}</small>
            </td>
            <td>{this.state.project.client_contact}</td>
            <td>{this.state.project.project_manager}</td>
            <td>
              <Link to={`/projects/${this.state.project.id}/edit`} >
                <button className="edit-button">Edit Project Details</button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="row">
        <div className="col-md-6">
          <h4>Forms</h4>
        </div>
        <div className="col-md-3">
          <h4>Recent Activity</h4>
        </div>
      </div>
        <p />
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header table-head">
                Forms
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Survey</li>
                <li className="list-group-item">Flight</li>
                <li className="list-group-item">Scan</li>
                <li className="list-group-item">Aerotriangulation</li>
                <li className="list-group-item">...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
