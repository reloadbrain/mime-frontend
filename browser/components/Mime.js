import React, { Component } from 'react'
import { Stage, Layer, Circle, Line, Rect, RegularPolygon } from 'react-konva'
import socket from '../socket'
import { connect } from 'react-redux'
import Whiteboard from './Whiteboard';
import { updateShapePosition } from '../store/reducers/mimeReducer';

// These dimensions control the size of the canvas and Image component that forms the drawing surface
const drawingHeight = window.innerHeight - 25
const drawingWidth = window.innerWidth - 25

class Mime extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.stage = React.createRef()
		this.renderShapes = this.renderShapes.bind(this)
	}

	renderShapes(){
		if (this.props.mimeObjects.length) {
			return this.props.mimeObjects.map(shape => {
				return (<Circle key={shape.key} x={shape.x} y={shape.y} radius={shape.radius} stroke='black' strokeWidth='4' draggable='true' onDragEnd={this.handleDragEnd(shape)} />)
			})
		} else {
			return null
		}
	}

	handleDragEnd(shape){
		return (event) => {
			shape.x = event.target.x()
			shape.y = event.target.y()
			this.props.dispatch(updateShapePosition(shape))
		}
	}

	render() {
		return (
			<section>
				<Stage
					width={window.innerWidth}
					height={window.innerHeight}
					ref={this.stage}
				>
					<Layer>
						<Whiteboard
							width={drawingWidth}
							height={drawingHeight}
						/>
					</Layer>
					{/* All wireframe shapes will be rendered in this new layer */}
					<Layer>
						{this.renderShapes()}
					</Layer>
				</Stage>
			</section>
		)
	}
}

const mapStateToProps = state => {
	const { mimeObjects } = state
	return { mimeObjects }
}

const mapDispatchToProps = {
	updateShapePosition
}

export default connect(mapStateToProps)(Mime)
