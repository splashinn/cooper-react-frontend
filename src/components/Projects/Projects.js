import React from 'react';
import PropTypes from 'prop-types';
import ProjectForm from './ProjectForm';
import { ProjectsList } from './ProjectsList';
import update from 'immutability-helper';
import Header from './Header';
import $ from 'jquery';

export default class Projects extends React.Component {
  static propTypes = {
    projects: PropTypes.array
  }

  static defaultProps = {
    projects: []
  }

  constructor (props, railsContext) {
    super(props)
    this.state = {
      projects: this.props.projects,
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
        url: `http://localhost:3001/projects`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({projects: data});
      })
    }
  }

  addNewProject = (project) => {
    const projects = update(this.state.projects, { $push: [project]});
    this.setState({
      projects: projects.sort(function(a,b){
        return new Date(a.created_at) - new Date(b.created_at);
      })
    });
  }

  render () {
    return (
      <div>
        <Header />
        <button onClick={this.toggleHidden.bind(this)} className="new-button" >
          {this.state.isHidden ?
            'Create Project' :
            'Hide Form'}
        </button>
        <p />
        {!this.state.isHidden && <ProjectForm handleNewProject={this.addNewProject} />}
        <div className="col-md-4">
          <ProjectsList projects={this.state.projects} />
        </div>
      </div>
    )
  }
}
