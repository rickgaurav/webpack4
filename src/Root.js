import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, withRouter} from 'react-router-dom';

 
import Page from './common/components/Page'; 
import NavbarContainer from "./common/containers/NavbarContainer";
import MainBar from './common/components/MainBar';
import TopBar from './common/components/TopBar';
import Store from './Store';

const Root = () => {
	return (
		<Provider store={Store}>
			<Router>
				<div className='container-fluid'>
					<TopBar/>
					<div>
						{/*<SidebarContainer/>*/}
						<NavbarContainer/>
					</div>
					<MainBar/>
				</div>
			</Router>
		</Provider>
	);	
}

export default Root;


