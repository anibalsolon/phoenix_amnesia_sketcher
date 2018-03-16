import React, { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'

class DrawingBoard extends Component {

  componentDidMount () {
    this.jqcanvas = $(this.canvas)
    this.context2d = this.canvas.getContext("2d")
    this.drawing = false
    this.jqcanvas.mousedown(this.startDrawing.bind(this))
                 .mousemove(this.moveDrawing.bind(this))
                 .mouseup(this.stopDrawing.bind(this))
                 .mouseleave(this.moveDrawing.bind(this))

    $(window).resize(() => {
      this.canvas.width = this.context2d.width = this.jqcanvas.width()
      this.canvas.height = this.context2d.height = this.jqcanvas.height()
      this.redraw(this.props.paths)
    }).resize()
  }

  componentWillReceiveProps(nextProps) {
    this.redraw(nextProps.paths)
  }

  render () {
    return (
      <canvas ref={(c) => { this.canvas = c }}></canvas>
    )
  }

  redraw(obj) {
    const paths = Object.values(obj)
    paths.sort((a, b) => {
      return a.time - b.time
    })

    this.context2d.clearRect(0, 0, this.context2d.canvas.width, this.context2d.canvas.height)

    const width = this.jqcanvas.width()
    const height = this.jqcanvas.height()

    for (const line of paths) {
      this.context2d.strokeStyle = "#df4b26"
      this.context2d.lineJoin = "round"
      this.context2d.lineWidth = 5
      this.context2d.beginPath()

      const len = line.path.length
      for (let i = 0; i < len; i++) {
        let { x, y } = line.path[i]
        x += width / 2
        y += height / 2
        if (i == 0) {
          this.context2d.moveTo(x, y)
        } else {
          this.context2d.lineTo(x, y)
        }
      }
      this.context2d.stroke()
    }
  }

  startDrawing(e) {
    this.drawing = true
    const off = this.jqcanvas.offset()
    const mouseX = e.pageX - off.left - (this.jqcanvas.width() / 2)
    const mouseY = e.pageY - off.top - (this.jqcanvas.height() / 2)

    this.line = {
      identifier: new Date().getTime().toString(16),
      path: [{
        x: mouseX, y: mouseY
      }]
    }

    this.props.onDraw && this.props.onDraw({ line: this.line })
  }

  moveDrawing(e) {
    if (this.drawing) {
      const off = this.jqcanvas.offset()
      const mouseX = e.pageX - off.left - (this.jqcanvas.width() / 2)
      const mouseY = e.pageY - off.top - (this.jqcanvas.height() / 2)

      this.line.path.push({ x: mouseX, y: mouseY })
      this.props.onDraw && this.props.onDraw({ line: this.line })
    }
  }

  stopDrawing(e) {
    if (this.drawing) {
      this.drawing = false
      const off = this.jqcanvas.offset()
      const mouseX = e.pageX - off.left - (this.jqcanvas.width() / 2)
      const mouseY = e.pageY - off.top - (this.jqcanvas.height() / 2)

      this.line.path.push({ x: mouseX, y: mouseY })
      this.props.onDraw && this.props.onDraw({ line: this.line })
      this.line = null
    }
  }
}

DrawingBoard.propTypes = {
  paths: PropTypes.object.isRequired,
  onDraw: PropTypes.func,
}

export default DrawingBoard