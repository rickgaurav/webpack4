import React, { Component } from 'react';
import Styled from 'styled-components';
import {withRouter} from 'react-router-dom';

import NavbarItemContainer from '../containers/NavbarItemContainer';

const NavbarStyled = Styled.div`
	padding: 15px 18px 0;
	border-bottom: 1px solid #ebebeb;
	display: flex;
`;

class Navbar extends Component {
	componentDidMount() {
		const route = this.props.location.pathname; // route is '/bus' ot '/trains' or '/flights'
		this.props.setActiveTab(route.substr(1));
	}

	render() {
		return (
			<NavbarStyled>
				<NavbarItemContainer text="all"/>
				<NavbarItemContainer text="flights"/>
				<NavbarItemContainer text="bus"/>
				<NavbarItemContainer text="trains"/>
			</NavbarStyled>
		);
	}
}

export default withRouter(props => <Navbar {...props}/>)