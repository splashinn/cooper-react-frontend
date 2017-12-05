import React from 'react';
import PropTypes from 'prop-types';
import { FormErrors } from './FormErrors';
import update from 'immutability-helper';
import { validations } from '../utils/validations';

export default class ProjectForm extends React.Component {
  static propTypes = {
    handleNewProject: PropTypes.func
  }

  constructor(props, railsContext) {
    super(props)
    this.state = {
      client_name: {value: '', valid: false},
      client_number: {value: '', valid: false},
      client_contact: {value: '', valid: false},
      project_manager: {value: '', valid: false},
      project_location: {value: '', valid: false},
      job_name: {value: '', valid: false},
      job_number: {value: '', valid: false},
      formErrors: {},
      formValid: false,
      editing: false
    }
  }

  static formValidations = {
    client_name: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    client_number: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    client_contact: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    project_manager: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    project_location: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    job_name: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    job_number: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ]
  }

  componentDidMount() {
    if(this.props.match) {
    $.ajax({
      type: "GET",
      url: `/projects/${this.props.match.params.id}`,
      dataType: "JSON"
    }).done((data) => {
      this.setState({
        client_name: {value: data.client_name, valid: true},
        client_number: {value: data.client_number, valid: true},
        client_contact: {value: data.client_contact, valid: true},
        project_manager: {value: data.project_manager, valid: true},
        project_location: {value: data.project_location, valid: true},
        job_name: {value: data.job_name, valid: true},
        job_number: {value: data.job_number, valid: true},
        editing: this.props.match.path === '/projects/:id/edit'
      });
    });
   }
  }

  handleUserInput = (fieldName, fieldValue, validations) => {
    const newFieldState = update(this.state[fieldName],
                                  {value: {$set: fieldValue}});
    this.setState({[fieldName]: newFieldState},
                  () => { this.validateField(fieldName, fieldValue, validations) });
  }

  validateField (fieldName, fieldValue, validations) {
    let fieldValid;

    let fieldErrors = validations.reduce((errors, v) => {
      let e = v(fieldValue);
      if(e !== '') {
        errors.push(e);
      }
      return(errors);
    }, []);

    fieldValid = fieldErrors.length === 0;

    const newFieldState = update(this.state[fieldName],
                                  {valid: {$set: fieldValid}});

    const newFormErrors = update(this.state.formErrors,
                                  {$merge: {[fieldName]: fieldErrors}});

    this.setState({[fieldName]: newFieldState,
                    formErrors: newFormErrors}, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.client_name.valid &&
                              this.state.client_number.valid &&
                              this.state.client_contact.valid &&
                              this.state.project_manager.valid &&
                              this.state.project_location.valid &&
                              this.state.job_name.valid &&
                              this.state.job_number.valid
                            });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.state.editing ?
      this.updateProject() :
      this.addProject();
    }

    updateProject() {
      const project = {client_name: this.state.client_name.value, client_number:
        this.state.client_number.value, client_contact: this.state.client_contact.value,
        project_manager: this.state.project_manager.value,
        project_location: this.state.project_location.value, job_name: this.state.job_name.value,
        job_number: this.state.job_number.value};
      $.ajax({
        type: "PATCH",
        url: `/projects/${this.props.match.params.id}`,
        data: {project: project}
      })
      .done((data) => {
        console.log('project updated!');
        this.resetFormErrors();
      })
      .fail((response) => {
        this.setState({formErrors: response.responseJSON,
          formValid: false})
      });
    }

    addProject() {
    const project = {client_name: this.state.client_name.value, client_number:
      this.state.client_number.value, client_contact: this.state.client_contact.value,
      project_manager: this.state.project_manager.value,
      project_location: this.state.project_location.value, job_name: this.state.job_name.value,
      job_number: this.state.job_number.value};
    $.post('/projects', {project: project})
    .done((data) => {
      this.props.handleNewProject(data);
      this.resetFormErrors();
    })
    .fail((response) => {
      this.setState({formErrors: response.responseJSON, formValid: false})
    });
  }

  deleteProject = () => {
    if(confirm("Are you sure you want to delete this project?")) {
      $.ajax({
        type: "DELETE",
        url: `/projects/${this.props.match.params.id}`,
      })
      .done((data) => {
        this.props.history.push('/projects');
        this.resetFormErrors();
      })
      .fail((response) => {
        console.log("Project deletion failed!");
      });
    }
  }

  resetFormErrors() {
    this.setState({formErrors: {}})
  }

  handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    this.handleUserInput(fieldName, fieldValue,
                            ProjectForm.formValidations[fieldName]);
  }

  render () {
    return (
      <div className="card" id="form-card">
        <h2>
          {this.state.editing ?
            'Update Project' :
            'Create Project'}
        </h2>
        <FormErrors formErrors = {this.state.formErrors} />
        <form onSubmit={this.handleFormSubmit} className="jumbotron" >
          <div className="form-row">
            <div className="col">
              <input name="opportunity" placeholder="Opportunity"
                className="form-control" />
            </div>
            <div className="col">
              <input name="job_name" placeholder="Job Name"
                value={this.state.job_name.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input name="job_number" placeholder="Job #"
                value={this.state.job_number.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
          </div>
          <p />
          <div className="form-row">
            <div className="col">
              <input name="project_manager" placeholder="Project Manager"
                value={this.state.project_manager.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input name="client_name" placeholder="Client Name"
                value={this.state.client_name.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input name="client_contact" placeholder="Client Contact"
                value={this.state.client_contact.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
          </div>
          <p />
          <div className="form-row">
            <div className="col">
              <input name="client_number" placeholder="Client #"
                value={this.state.client_number.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input name="project_location" placeholder="Project Location"
                value={this.state.project_location.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
          </div>
          <p />
          <input type="submit"
            value={this.state.editing ? 'Update Project' : 'Create Project'} className="new-button"
            disabled={!this.state.formValid} />
        </form>
        <p>
          {this.state.editing && (
            <button onClick={this.deleteProject} className="delete-button">
              Delete Project
            </button>
            )
          }
        </p>
      </div>
    )
  }
}
