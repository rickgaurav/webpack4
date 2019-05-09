import React, { Component } from 'react';
import Styled from 'styled-components';
import { Link } from 'react-router-dom';

import BusLogo from '../../images/svgs/bus.svg';
import TrainsLogo from '../../images/svgs/trains.svg';
import FlightsLogo from '../../images/svgs/flights.svg';
import AllItemsLogo from '../../images/svgs/all.svg';

const NavbarItemStyled = Styled.div`
	display: flex;
	margin-left: 50px;
	padding-bottom: 12px;
	text-transform: capitalize;
	font-size: 14px;
	font-weight: 600;
	color: #9c9c9c;
	border-bottom: ${props => props.is_active ? '2px solid #00b9f5' : 'none'}
`;

const LogoTextStyled = Styled.div`
	margin-left: 10px;
`;

const Logo = Styled.div`
	height: 18px;
	display: flex;
	flex-direction: column;
	align-self: center;
`;

export default class NavbarItem extends Component {
	render() {
		const path_map = {
			'trains': TrainsLogo,
			'bus': BusLogo,
			'flights': FlightsLogo,
			'all': AllItemsLogo
		};

		return (
			<Link to={`/${this.props.text}`} onClick={() => this.props.setActiveTab(this.props.text)}>
				<NavbarItemStyled is_active={this.props.is_active}> 
					<Logo>
						<img src={path_map[this.props.text]} alt={this.props.text}/>
					</Logo>
					<LogoTextStyled>
						{this.props.text}
					</LogoTextStyled>
				</NavbarItemStyled>
			</Link>
		);
	}
}
