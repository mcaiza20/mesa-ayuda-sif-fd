import React from 'react';
import ReactDOM from 'react-dom';
import ToastContenedor from './componentes/ToastContenedor';
import Toast from './componentes/Toast';
import './componentes/styles.css';

/**
 * @params tipos 'success', 'info', 'warn', 'error', 'loading'
 * @example Alerta.info('Mensaje')
 */

let ctToastCount = 0;

const Alerta = (text, options) => {
	
	let rootContainer = document.getElementById('ct-container');

	if (!rootContainer) {
		rootContainer = document.createElement('div');
		rootContainer.id = 'ct-container';
		document.body.append(rootContainer);
	}

	ctToastCount += 1;

	const hideTime = (options.hideAfter === undefined ? 3 : options.hideAfter) * 1000;
	const toast = { id: ctToastCount, text, ...options };

	ReactDOM.render(<ToastContenedor toast={toast} />, rootContainer);

	const hide = () => {
		ReactDOM.render(<ToastContenedor hiddenID={toast.id} />, rootContainer);
	};

	const completePromise = new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, hideTime);
	});

	return hideTime <= 0 ? hide : completePromise;
};

const types = ['success', 'info', 'warn', 'error', 'loading'];

types.forEach((type) => {
	Alerta[type] = (text, options) => Alerta(text, { ...options, type });
});

export { Toast };

export default Alerta;