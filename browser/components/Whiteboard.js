import React, { Component } from 'react'
import { Stage, Layer, Image } from 'react-konva'

export default class Whiteboard extends Component {
	constructor(props){
		super(props)
		this.state = {
			isDrawing: false,
			strokePool: []
		}
		this.image = React.createRef()
	}

	componentDidMount() {
		const canvas = document.createElement('canvas')
		canvas.width = 500
		canvas.height = 500
		const context = canvas.getContext('2d')
		this.setState({ canvas, context })
	}

	handleMouseDown = () => {
		console.log('mousedown')
		this.setState({ isDrawing: true })
		const stage = this.image.current.parent.parent
		this.lastPointerPosition = stage.getPointerPosition()
	}

	handleMouseUp = () => {
		console.log('mouseup')
		this.setState({ isDrawing: false, strokePool: [] })
	}

	handleMouseMove = () => {
		console.log(this.state.strokePool)
		const { context, isDrawing } = this.state

		if (isDrawing) {
			context.strokeStyle = '#000000'
			context.lineJoin = 'round'
			context.lineWidth = 5
			context.globalCompositeOperation = 'source-over'
			context.beginPath()
			let sample = []
			let localPos = {
				x: this.lastPointerPosition.x - this.image.current.x(),
				y: this.lastPointerPosition.y - this.image.current.y()
			}
			sample.push([ localPos.x, localPos.y ])
			context.moveTo(localPos.x, localPos.y)
			const stage = this.image.current.parent.parent
			let pos = stage.getPointerPosition()
			localPos = {
				x: pos.x - this.image.current.x(),
				y: pos.y - this.image.current.y()
			}
			context.lineTo(localPos.x, localPos.y)
			sample.push([ localPos.x, localPos.y ])
			this.setState({ strokePool: [ ...this.state.strokePool, ...sample ] })
			context.closePath()
			context.stroke()
			this.lastPointerPosition = pos
			this.image.current.getLayer().draw()
		}
	}

	render() {
		const { canvas } = this.state

		return (
			<Stage width={700} height={700}>
				<Layer>
					<Image
						image={canvas}
						ref={this.image}
						width={500}
						height={500}
						stroke='black'
						onMouseDown={this.handleMouseDown}
						onMouseUp={this.handleMouseUp}
						onMouseMove={this.handleMouseMove}
					/>
				</Layer>
			</Stage>
		)
	}
}
