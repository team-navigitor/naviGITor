import React, { Component } from 'react';
import ReactDOM from 'react-dom';


export default class Term extends Component {
	//on mount, load terminal onto DOM
	componentDidMount() {
		this.loadTerminal(ReactDOM.findDOMNode(this))
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
		console.log('height: ' + termHeight + 'width: ' + termWidth)
		term.width = termWidth;
		term.height = termHeight;
		//term.rows = termHeight / 20;
		// term.cols = 60;

		//open terminal
		term.open(node);
		
		//define initial term prompt
		term.prompt = () => {
    		term.write('\r\n' + '$ ');
  		};
		//call prompt
		term.prompt();

		//when renderer gets reply back from main, 
		//write reply to terminal
		ipcRenderer.on('reply', (event, stdout) => {
			let replyArr = stdout.split('\n');
			console.log(replyArr)
			replyArr.forEach(function(el) {
				term.write('\r\n' + el);
			})
			term.prompt();
		})
		//initialize variable for string to be sent to main
		let str = '';

		//function to be run on every key stroke
		term.on('key', function(key, ev) {
			//initialize printable variable to check if
			//key is valid
			var printable = (
			!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey && ev.keyCode !== 40 && ev.keyCode !==38
			);

			//if enter key is hit, send string to main process,
			//then reset string to empty and call prompt function
			if (ev.keyCode === 13) {
				// if (str === '') term.prompt();
				// else {
				term.write('\r\n')
				ipcRenderer.send('term-input', str)
				str = '';	
				
				//term.prompt();	
			}
			//if backspace key is hit, delete string by one
			//and if 
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
		term.on('paste', function (data, ev) {
    	term.write(data);
			str += data
 		});
	}

	render() {
		return (
			<div id="terminal" className="terminal-container" style={{backgroundColor: "#000", color: '#fff'}} >
			</div>
		);
	}
}