import React, { Component } from 'react';
import RouteFinderFormContainer from "../containers/RouteFinderFormContainer";
import RouteResultsContainer from "../containers/RouteResultsContainer";
import styles from './RouteFinder.less'

export default class RouteFinder extends Component {
  componentDidMount() {
    this.props.setupData();
  }

  render() {
    return (
      <div className={styles.container}>
        <RouteFinderFormContainer/>
        <RouteResultsContainer/>
      </div>
    );
  }
};