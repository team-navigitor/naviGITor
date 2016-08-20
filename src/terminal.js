import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Term extends Component {
	componentDidMount() {
		this.loadTerminal(ReactDOM.findDOMNode(this))
	}

	loadTerminal(node) { 
		const DOMelm = document.getElementById('terminal');
		const termHeight = DOMelm.offsetHeight;
		const termWidth =  DOMelm.offsetWidth;
		const term = new Terminal({
		});

		term.cursorBlink = true;
		term.width = termWidth;
		term.height = termHeight;
		//term.rows = termHeight / 10;
		//term.cols = Math.floor(termWidth / 5)
		term.open(node);
		ipcRenderer.once('terminal-start', (event, arg) => {
			term.write(arg)
		})

		term.prompt =  () => {
    		term.write('\r\n' + '$ ');
  		};
		  
		term.prompt();

		ipcRenderer.on('reply', (event, stdout) => {
			term.write(stdout);
			term.prompt();
		})

		let str = '';

		term.on('key', function(key, ev) {
			var printable = (
			!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
			);

			if (ev.keyCode === 13) {
				term.prompt();			
				ipcRenderer.send('term-input', str)
				str = '';	
			} else if (ev.keyCode === 8) {
	  		if (str.length) {
			  	str = str.substring(0, str.length - 1);
					if (term.x > 2) {
						term.write('\b \b');
					}
				}
			} else if (printable) {
				str += key;
				term.write(key);
			}
		});

		term.on('paste', function (data, ev) {
    	term.write(data);
  	});
	}

	render() {
		return (
			<div id="terminal" className="terminal-container" style={{backgroundColor: "#000", color: '#fff'}} >
			</div>
		);
	}
}