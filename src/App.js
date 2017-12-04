import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      projects: []
    }
  }

  componentDidMount() {
    $.ajax({
      type: "GET",
      url: 'http://localhost:3001/projects'
    }).done(data => {
      this.setState({projects: data});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          {this.state.projects.map(project => {
            return(<p key={project.id}>{project.job_name}</p>);
          })
          }
        </div>
      </div>
    );
  }
}

export default App;
