import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';

import asyncComponent from './AsyncComponent';
import styles from "./MainBar.less";

const AsyncRoutesApp = asyncComponent(() => import(/* webpackChunkName: "routes" */ '../../routeFinder/components/RouteFinderApp'));

const MainBar = (props) => {
	return (
		<div className={styles.container}>
			<Switch>
				<Route exact path="/" component={AsyncRoutesApp}/>
			</Switch>
		</div>
	);
};

export default MainBar;












