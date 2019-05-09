import React, { Component } from 'react';
import Styled from 'styled-components';

const Page = Styled.div`
	padding: 12px 18px;	
`;

export default (props) => (
	<Page>
		{props.children}
	</Page>
);
