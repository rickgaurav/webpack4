import React, { Component } from 'react';
import RouteFinderFormContainer from "../containers/RouteFinderFormContainer";
import RouteResultsContainer from "../containers/RouteResultsContainer";
import styles from './RouteFinder.less'
import Loading from "../../common/components/Loading";

export default class RouteFinder extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setupData();
  }

  render() {
    return (
      <div className={styles.container}>
        {this.props.loading && <Loading /> }
        <RouteFinderFormContainer/>
        {this.props.searchFlag && <RouteResultsContainer/>}
      </div>
    );
  }
};