import React, { Component } from 'react';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import { uniqBy, isNumber } from 'lodash';
import styles from './RouteFinderForm.less';

const { Option } = Select;

const getValueFromEvent = e => {
  const value = parseInt(e.target.value);
  return value || e.target.value;
};

class RouteFinderForm extends Component {
  constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.toggleLoading();
        this.props.getRoutes(values.from, values.to, values.maxStationsOnRoute, values.maxTravelTime);
      }
    });
  }

  getFieldValidationStatus(fieldName, isFieldTouched, getFieldError) {
    return isFieldTouched(fieldName) && getFieldError(fieldName) ? 'error': '';
  }

  renderFromAndTo(label, getFieldDecorator, isFieldTouched, getFieldError) {
    const { stationIdToStationMap } = this.props;
    const stations = uniqBy(Object.values(stationIdToStationMap), station => station.name);
    const fieldError = this.getFieldValidationStatus(label, isFieldTouched, getFieldError);
    return (
      <Form.Item label={label} validateStatus={fieldError}>
        {getFieldDecorator(label.toLowerCase(), {
          rules: [{ required: true, message: 'Please select a station' }],
        })(
          <Select>
            {
              stations.map(station => (
                <Option value={station.id} key={station.id}>
                  {station.name}
                </Option>
              ))
            }
          </Select>,
        )}
      </Form.Item>
    );
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  render() {
    const { getFieldDecorator, isFieldTouched, getFieldError, getFieldsError } = this.props.form;
    return (
        <Form onSubmit={this.handleSubmit} className={styles.container}>
          <Row gutter={16} type='flex' justify='space-around'>
            <Col span={8}>
              {this.renderFromAndTo('From', getFieldDecorator, isFieldTouched, getFieldError)}
            </Col>
            <Col span={8}>
              {this.renderFromAndTo('To', getFieldDecorator, isFieldTouched, getFieldError)}
            </Col>
          </Row>
          <Row gutter={16} type='flex' justify='space-around'>
            <Col span={8}>
              <Form.Item label='Maximum Travel Time(Minutes)' validateStatus={this.getFieldValidationStatus('maxTravelTime',isFieldTouched, getFieldError)}>
                {getFieldDecorator(`maxTravelTime`, {
                  getValueFromEvent,
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: 'This is a required field.',
                    },
                    {
                      pattern: /^[0-9][0-9]*$/,
                      message: 'Please enter a valid number'
                    },
                    {
                      type: 'number',
                      min: 1,
                      max: 100,
                      message: 'Please enter only numeric values between 1 and 180'
                    }
                  ],
                })(<Input placeholder="Travel time not to exceed minutes" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='Max Stations On Route'
                         validateStatus={this.getFieldValidationStatus('maxStationsOnRoute',isFieldTouched, getFieldError)}>
                {getFieldDecorator(`maxStationsOnRoute`, {
                  getValueFromEvent,
                  validateFirst: true,
                  rules: [
                    {
                      required: true,
                      message: 'This is a required field.',
                    },
                    {
                      pattern: /^[0-9][0-9]*$/,
                      message: 'Please enter a valid number'
                    },
                    {
                      type: 'number',
                      min: 1,
                      max: 50,
                      message: 'Please enter only numeric values between 1 and 50'
                    }
                  ],
                })(<Input placeholder="Max number of stations on route" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row type='flex' justify='center'>
            <Button type="primary" htmlType="submit" className='form-button' disabled={this.hasErrors(getFieldsError())}>
              Search
            </Button>
            <Button onClick={() =>  this.props.form.resetFields()} className='form-button'>
              Clear
            </Button>

          </Row>
        </Form>
    );
  }
}

export default Form.create({ name: 'RouteFinder Form'} )(RouteFinderForm);
