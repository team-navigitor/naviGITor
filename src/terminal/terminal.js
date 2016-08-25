import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Term extends Component {
	//on mount, load terminal onto DOM
	componentDidMount() {
		this.loadTerminal(ReactDOM.findDOMNode(this));
	}



	loadTerminal(node) {
		//get DOM node for testing
		const DOMelem = document.getElementById('terminal');

		//get height and width of DOM node
		const termHeight = DOMelem.offsetHeight;
		const termWidth =  DOMelem.offsetWidth;

		//initialize instance of terminal
		const term = new Terminal();

		//set terminal properties, height and width equal to DOM node's
		term.cursorBlink = true;

		//open terminal
		term.open(node);

		//define initial term prompt
		term.prompt = () => {
    		term.write('\r\n' + '$ ');
  		};
		//call prompt to initialize terminal.
		term.prompt();

		//when renderer gets reply back from main,
		//write reply to terminal
		ipcRenderer.on('reply', (event, stdout) => {
			console.log('reply rec')
			let node = document.getElementById("terminal");
			let counter = 0;
			let replyArr = stdout.split('\n');
			replyArr.forEach(function(el) {
				term.write('\r\n' + el);
				counter++;
			});

			if (counter >= 10) node.scrollTop = node.scrollHeight;
			term.prompt();
			})

		//initialize variable for string to be sent to main
		let str = '';

		//function to be run on every key stroke
		term.on('key', (key, ev) => {
			//initialize printable variable to check if
			//key is valid
			var printable = (
			!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey && ev.keyCode !== 9 &&ev.keyCode !== 40 && ev.keyCode !==38
			);

			// if (ev.keyCode === 45) {
			// 	key = "&#8209;"
			// }

			//if enter key is hit, send string to main process,
			//then reset string to empty and call prompt function
			if (ev.keyCode === 13) {
				if (str === '') term.prompt();
				else if (str === 'clear') {
					for (let i = 0; i < 11; i ++) {
						term.write('\r\n')
					}
					str = '';
					term.prompt();
				}
				else {
				term.write('\r\n')
				ipcRenderer.send('term-input', str)
				str = '';
				//term.prompt();
				}
			}
			//if backspace key is hit, delete string by one

      		else if (ev.keyCode === 8) {
		  		if (str.length) {
			  	str = str.substring(0, str.length - 1);
				//term.write(str);
				if (term.x > 2) {
				term.write('\b \b');
				}
			}
			//if key is printable, concatenate onto string and print key
			//to terminal
			} else if (printable) {
				str += key;
				term.write(key);
			}
		});
		//define action on paste: write data to terminal and
		//concatenate onto string
		term.on('paste', (data, ev) => {
    	term.write(data);
			str += data
 		});
	}
	render() {
		let style = {
		backgroundColor: "#000",
		color: '#ccc',
		//fontFamily: "Courier",
		overflow: "auto"
		}
		return (
			<div id="terminal" className="terminal-container" style={style} >
			</div>
		);
	}
}
