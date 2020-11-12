import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Splitter.less';
import SplitterZone from '~c/splitter/SplitterZone';
import Portal from '~c/portal';

import ReactDOM from 'react-dom';

class Splitter extends Component {
	static propTypes = {
	
	};
	
	static defaultProps = {
	};
	
	state = {
	
	};

	splitterRef = React.createRef();
	firstRef = React.createRef();
	secondRef = React.createRef();
	handlerRef = React.createRef();
	ghostRef = React.createRef();
//--------------------------------------------------------------------------------
	onmousedown = (event) => {
		event.persist();
		const { horizontal=null, vertical=null  } = this.props;
		const { current: splitter } = this.splitterRef;
		const { current: handler } = this.handlerRef;
		const { current: ghost } = this.ghostRef;
		// const { current: first } = this.firstRef;
		// const { current: second } = this.secondRef;
		const first = ReactDOM.findDOMNode(this.firstRef.current);
		const second = ReactDOM.findDOMNode(this.secondRef.current);

		if(event.button == 0){
			//для вертикального положения сплиттера
			if(horizontal) {
				ghost.style.top = handler.getBoundingClientRect().top + 'px';
				ghost.style.left = handler.getBoundingClientRect().left + 'px';
				ghost.style.width = handler.getBoundingClientRect().width + 'px';
				ghost.style.display = "block";

				function moveAt(x, y) {
					ghost.style.top = y + 'px';	
				}

				function onMouseMove(event) {
					moveAt(event.clientX, event.clientY);
					splitter.style.userSelect = "none";
				}

				splitter.addEventListener('mousemove', onMouseMove);
				splitter.onmouseup = function() {
					first.style.height = ghost.getBoundingClientRect().top - splitter.getBoundingClientRect().top - 3 + 'px';
					//second.style.height = splitter.getBoundingClientRect().height - ghost.getBoundingClientRect().top - 3 + 'px';
					//handler.style.top = 0;
					ghost.style.display = "none";

					splitter.removeEventListener('mousemove', onMouseMove); 
					splitter.style.userSelect = "auto";
					splitter.onmouseup = null;
					handler.onmouseup = null;
				};

			}//для горизонтального положения сплиттера
			else if(vertical){
				ghost.style.top = handler.getBoundingClientRect().top + 'px';
				ghost.style.left = handler.getBoundingClientRect().left + 'px';
				ghost.style.height = handler.getBoundingClientRect().height + 'px';
				ghost.style.display = "block";

				function moveAt(x, y) {
					ghost.style.left = x + 'px';	
				}

				function onMouseMove(event) {
					moveAt(event.clientX, event.clientY);
					splitter.style.userSelect = "none";
				}

				splitter.addEventListener('mousemove', onMouseMove);
				splitter.onmouseup = function() {
					first.style.width = ghost.getBoundingClientRect().left - splitter.getBoundingClientRect().left - 3 + 'px';
					//second.style.height = splitter.getBoundingClientRect().height - ghost.getBoundingClientRect().top - 3 + 'px';
					//handler.style.top = 0;
					ghost.style.display = "none";

					splitter.removeEventListener('mousemove', onMouseMove); 
					splitter.style.userSelect = "auto";
					splitter.onmouseup = null;
					handler.onmouseup = null;
				};
			}
		}
	};
		
	ondragstart = () => {
		return false;
	};

	firstZone = () => {
		const { children } = this.props;
		return (<SplitterZone ref={this.firstRef} className="splitter-zone_fixed" style={{}} {...children[0].props}>
			{children[0].props.children}
		</SplitterZone>)

	}

	lastZone = () => {
	const { children } = this.props;
		return (<SplitterZone ref={this.secondRef} className="splitter-zone_flexible" style={{}} {...children[1].props}>
			{children[1].props.children}
		</SplitterZone>)
	}


//--------------------------------------------------------------------------------
	render() {
		const { children, horizontal=null, vertical=null  } = this.props;
		const classes = classNames(
			"splitter",
			horizontal?'splitter-horizontal':null,
			vertical?'splitter-vertical':null,
		);
		const ghostClasses = classNames(
			"split-handler-ghost",
			vertical?'vertical':null,
		);
		return (
			<React.Fragment>
				<div className="splitter-container">
					<div className={classes} ref={this.splitterRef}>
						{this.firstZone()}
						<div className="split-handler" onMouseDown={this.onmousedown} ref={this.handlerRef} style={{top: '0'}}></div>
						{this.lastZone()}
					</div>
				</div>
				{<Portal>
					<div ref={this.ghostRef} className={ghostClasses}></div>
				</Portal>}
			  </React.Fragment>
		)
	}
}
export default Splitter;