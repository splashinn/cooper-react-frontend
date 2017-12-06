import React from 'react';
import PropTypes from 'prop-types';
import { FormErrors } from './FormErrors';
import update from 'immutability-helper';
import { validations } from '../utils/validations';
import $ from 'jquery';

export default class SurveyForm extends React.Component {
  static propTypes = {
    handleNewSurvey: PropTypes.func
  }

  constructor(props, railsContext) {
    super(props)
    this.state = {
      project_id: {value: '', valid: false},
      survey_staff: {value: '', valid: false},
      abgps: {value: '', valid: true},
      control_status: {value: '', valid: true},
      control: {value: '', valid: true},
      results: {value: '', valid: true},
      coordinate_system: {value: '', valid: true},
      notes: {value: '', valid: true},
      formErrors: {},
      formValid: false,
      editing: false
    }
  }

  static formValidations = {
    project_id: [
      (s) => { return(validations.checkMinLength(s, 1)) }
    ],
    survey_staff: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    abgps: [
      (s) => { return(validations.checkMinLength(s, 1)) }
    ],
    control_status: [
      (s) => { return(validations.checkMinLength(s, 2)) }
    ],
    control: [
      (s) => { return(validations.checkMinLength(s, 1)) }
    ],
    results: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    coordinate_system: [
      (s) => { return(validations.checkMinLength(s, 3)) }
    ],
    notes: [
      (s) => { return(validations.checkMinLength(s, 0)) }
    ]
  }

  componentDidMount() {
    if(this.props.match) {
    $.ajax({
      type: "GET",
      url: `/surveys/${this.props.match.params.id}`,
      dataType: "JSON"
    }).done((data) => {
      this.setState({
        project_id: {value: data.project_id, valid: true},
        survey_staff: {value: data.survey_staff, valid: true},
        abgps: {value: data.abgps, valid: true},
        control_status: {value: data.control_status, valid: true},
        control: {value: data.control, valid: true},
        results: {value: data.results, valid: true},
        coordinate_system: {value: data.coordinate_system, valid: true},
        notes: {value: data.notes, valid: true},
        editing: this.props.match.path === '/surveys/:id/edit'
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
    this.setState({formValid: this.state.project_id.valid &&
                              this.state.survey_staff.valid &&
                              this.state.abgps.valid &&
                              this.state.control_status.valid &&
                              this.state.control.valid &&
                              this.state.results.valid &&
                              this.state.coordinate_system.valid &&
                              this.state.notes.valid
                            });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.state.editing ?
      this.updateSurvey() :
      this.addSurvey();
  }

  updateSurvey() {
    const survey = {project_id: this.state.project_id.value, survey_staff:
      this.state.survey_staff.value, abgps: this.state.abgps.value, control_status: this.state.control_status.value,
      control: this.state.control.value, results: this.state.results.value,
      coordinate_system: this.state.coordinate_system.value, notes: this.state.notes.value};
    $.ajax({
      type: "PATCH",
      url: `/surveys/${this.props.match.params.id}`,
      data: {survey: survey}
    })
    .done((data) => {
      console.log('survey updated!');
      this.resetFormErrors();
    })
    .fail((response) => {
      this.setState({formErrors: response.responseJSON,
        formValid: false})
      });
  }

  addSurvey() {
    const survey = {project_id: this.state.project_id.value, survey_staff:
      this.state.survey_staff.value, abgps: this.state.abgps.value, control_status: this.state.control_status.value,
      control: this.state.control.value, results: this.state.results.value,
      coordinate_system: this.state.coordinate_system.value, notes: this.state.notes.value};
    $.post('/surveys', {survey: survey})
    .done((data) => {
      this.props.handleNewSurvey(data);
      this.resetFormErrors();
    })
    .fail((response) => {
      this.setState({formErrors: response.responseJSON, formValid: false})
    });
  }

  deleteSurvey = () => {
    if(confirm("Are you sure you want to delete this survey?")) {
      $.ajax({
        type: "DELETE",
        url: `/surveys/${this.props.match.params.id}`,
      })
      .done((data) => {
        this.props.history.push('/surveys');
        this.resetFormErrors();
      })
      .fail((response) => {
        console.log("Survey deletion failed!");
      });
    }
  }

  resetFormErrors() {
    this.setState({formErrors: {}})
  }

  handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    console.log(`SurveyForm.formValidations[${fieldName}]`)
    console.log(JSON.stringify(SurveyForm.formValidations[fieldName]))
    this.handleUserInput(fieldName, fieldValue,
                            SurveyForm.formValidations[fieldName]);
  }

  render () {
    return (
      <div className="card" id="form-card">
        <h2>
        {this.state.editing ?
          'Update Survey' :
          'Create Survey'}
        </h2>
        <FormErrors formErrors = {this.state.formErrors} />
        <form onSubmit={this.handleFormSubmit} className="jumbotron">
          <div className="form-row">
            <div className="col">
              <input type="text" name="project_id" placeholder="Project ID"
                value={this.state.project_id.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input type="text" name="survey_staff" placeholder="Survey Staff"
                value={this.state.survey_staff.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input type="text" name="abgps" placeholder="ABGPS"
                value={this.state.abgps.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input type="text" name="control_status" placeholder="Control Status"
                value={this.state.control_status.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
          </div>
          <p />
          <div className="form-row">
            <div className="col">
              <input type="text" name="control" placeholder="Control"
                value={this.state.control.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input type="text" name="results" placeholder="Results"
                value={this.state.results.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="col">
              <input type="text" name="coordinate_system" placeholder="Coordinate System"
                value={this.state.coordinate_system.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
          </div>
          <p />
          <div className="form-row">
            <div className="col">
              <input type="text" name="notes" placeholder="Notes"
                value={this.state.notes.value}
                onChange={this.handleChange}
                className="form-control" />
            </div>
          </div>
          <p />
          <input type="submit"
            value={this.state.editing ? 'Update Survey' : 'Create Survey'} className="new-button"
            disabled={!this.state.formValid} />
        </form>
        <p>
          {this.state.editing && (
            <button onClick={this.deleteSurvey} className="delete-button">
              Delete Survey
            </button>
            )
          }
        </p>
      </div>
    )
  }
}
