import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

export default class Project extends React.Component {
  constructor (props) {
    super(props)
    console.log(`props: ${JSON.stringify(props)}`);
    this.state = {
      project: props.project
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
      <div className="project">
        <Link to={`/projects/${this.state.project.id}`} >
          <h4>{this.state.project.job_name}</h4>
        </Link>
        <p>Job #:<br />{this.state.project.job_number}</p>
        <p>Client Info:<br />{this.state.project.client_name}, {this.state.project.client_number},
          {this.state.project.client_contact}</p>
        <p>Project Manager:<br />{this.state.project.project_manager}</p>
      </div>
    )
  }
}
