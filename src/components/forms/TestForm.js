import React, {Component, PropTypes} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form/immutable';
import {connect} from 'react-redux';
import {RadioButton} from 'material-ui/RadioButton';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import {AutoComplete as MUIAutoComplete} from 'material-ui';
import {
    AutoComplete,
    Checkbox,
    DatePicker,
    TimePicker,
    RadioButtonGroup,
    SelectField,
    Slider,
    TextField,
    Toggle
} from 'redux-form-material-ui'

const validate = (values) => {
    return {};
};

const tooMany = value => value > 15 ? 'Are you mad?' : undefined;

export class TestForm extends Component {
    render() {
        const {
            limitValue, redeemedValue, handleSubmit, pristine, reset, submitting
        } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <Field name="name" component={TextField} hintText="Name" floatingLabelText="Name"
                           ref="name" withRef/>
                </div>
                <div>
                    <Field name="website" component={TextField} hintText="Website" floatingLabelText="Website"/>
                </div>
                <div>
                    <Field
                        name="status"
                        component={AutoComplete}
                        floatingLabelText="Status"
                        openOnFocus={true}
                        filter={MUIAutoComplete.fuzzyFilter}
                        onNewRequest={value => {
              console.log('AutoComplete ', value) // eslint-disable-line no-console
            }}
                        dataSource={[ 'Active', 'Suspended', 'Bankrupt' ]}
                    />
                </div>
                <div>
                    <Field name="address" component={TextField} hintText="Address" floatingLabelText="Address"/>
                </div>
                <div style={{margin: 40}}>
                    <p>
                        <span>{'Issue Limit: '}</span>
                        <span>{limitValue}</span>
                    </p>
                    <Field
                        name="limit"
                        component={Slider}
                        defaultValue={0}
                        format={null}
                        min={0}
                        max={20}
                        step={1}
                    />
                </div>
                <div style={{margin: 40}}>
                    <p>
                        <span>{'Redeemed: '}</span>
                        <span>{redeemedValue}</span>
                    </p>
                    <Field
                        name="redeemed"
                        component={Slider}
                        defaultValue={0}
                        format={null}
                        min={0}
                        max={20}
                        step={1}
                    />
                </div>
                <div>
                    <Field name="contract" component={TextField} hintText="Contract" floatingLabelText="Contract"/>
                </div>
                <div>
                    <Field
                        name="notes"
                        component={TextField}
                        hintText="Notes"
                        floatingLabelText="Notes"
                        multiLine={true}
                        rows={2}/>
                </div>
                <div>
                    <FlatButton label="Save" primary={true} disabled={pristine || submitting} />
                </div>
            </form>
        );
    }
}

TestForm = reduxForm({
    form: 'TestForm',
    validate
})(TestForm);

// Decorate with connect to read form values
const selector = formValueSelector('TestForm') // <-- same as form name
TestForm = connect(
    state => {
        // can select values individually
        const limitValue = selector(state, 'limit')
        const redeemedValue = selector(state, 'redeemed')
        return {
            limitValue,
            redeemedValue
        }
    }
)(TestForm);

export default TestForm;
