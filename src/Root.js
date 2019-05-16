import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import MainBar from './common/components/MainBar';
import TopBar from './common/components/TopBar';
import Footer from "./common/components/Footer";

import Store from './Store';

const Root = () => {
	return (
		<Provider store={Store}>
			<Router>
					<TopBar/>
					<MainBar/>
					<Footer/>
			</Router>
		</Provider>
	);	
};

export default Root;


