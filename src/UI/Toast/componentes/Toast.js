import React, { useState, useEffect } from 'react';
import {
	string, number, bool, func, shape, node, oneOfType,
} from 'prop-types';

import Icons from './Icons';

const colors = {
	success: '#6EC05F',
	info: '#1271EC',
	warn: '#FED953',
	error: '#D60A2E',
	loading: '#0088ff',
};

const Toast = (props) => {
	
	const place = (props.position || 'top-center').includes('bottom') ? 'Bottom' : 'Top';
	const marginType = `margin${place}`;

	const className = ['ct-toast', props.onClick ? ' ct-cursor-pointer' : ''].join(' ');
	const borderLeft = `${props.bar.size || '3px'} ${props.bar.style || 'solid'} ${props.bar.color
		|| colors[props.type]}`;

	const CurrentIcon = Icons[props.type];
	//const CurrentIcon = props.type;

	const [animStyles, setAnimStyles] = useState({ opacity: 0, [marginType]: -15 });

	const style = {
		paddingLeft: props.heading ? 25 : undefined,
		minHeight: props.heading ? 50 : undefined,
		borderLeft,
		...animStyles,
	};

	const handleHide = () => {
		setAnimStyles({ opacity: 0, [marginType]: '-15px' });

		setTimeout(() => {
			props.onHide(props.id, props.position);
		}, 300);
	};

	useEffect(() => {
		setTimeout(() => {
			setAnimStyles({ opacity: 1, [marginType]: '15px' });
		}, 50);

		if (props.hideAfter !== 0) {
			setTimeout(() => {
				handleHide();
			}, props.hideAfter * 1000);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!props.show) {
			handleHide();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.show]);

	const clickProps = {
		tabIndex: 0,
		onClick: () => props.onClick(handleHide),
		role: 'button',
		onKeyPress: (event) => {
			if (event.keyCode === 13) {
				props.onClick();
			}
		},
	};

	return (
		<div className={className} style={style} {...(props.onClick ? clickProps : {})}>
			{props.renderIcon ? props.renderIcon() : <CurrentIcon />}
			<div className={props.heading ? 'ct-text-group-heading' : 'ct-text-group'}>
				{props.heading && <h4 className="ct-heading">{props.heading}</h4>}
				<div className="ct-text">{props.text}</div>
			</div>
		</div>
	);
};

Toast.propTypes = {
	type: string.isRequired,
	text: oneOfType([string, node]).isRequired,
	show: bool,
	onHide: func,
	id: oneOfType([string, number]),
	hideAfter: number,
	heading: string,
	position: string,
	renderIcon: func,
	bar: shape({}),
	onClick: func,
};

Toast.defaultProps = {
	id: null,
	show: true,
	onHide: null,
	hideAfter: 3,
	heading: null,
	position: 'top-center',
	renderIcon: null,
	bar: {},
	onClick: null,
};

export default Toast;