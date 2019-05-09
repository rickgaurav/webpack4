import React, { Component } from 'react';
import paytmLogo from '../../images/svgs/paytm_logo.svg';
import Styled from 'styled-components';

const TopBar = Styled.div`
	padding: 12px 18px;
	border-bottom: 1px solid #ebebeb;
	font-size: 20px;
	font-weight: 300;
`;

export default class TopBarComp extends Component {
	render() {
		return (
			<TopBar>
				<div>
					<img src={paytmLogo} alt="Paytm Logo"/>
					<div>
						Travel
					</div>
				</div>
			</TopBar>
		);
	}
}
