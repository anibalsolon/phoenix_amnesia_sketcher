import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'

import { DrawingBoard } from '../components'

class Room extends Component {
  constructor(props) {
    super(props)
    this.setLine = this.setLine.bind(this)
    this.state = { users: [], paths: {}, connected: false }
  }

  componentDidMount () {
    const { socket, match: { params: { room } } } = this.props
    const channel = socket.channel('room:' + room)

    channel
      .join()
      .receive("ok", () => this.setState({ connected: true, channel }))
      .receive("error", () => this.setState({ connected: false, channel: null }))

    channel.on("presence_state", this.onPresenceState.bind(this))
    channel.on("presence_diff", this.onPresenceDiff.bind(this))
    channel.on("path/new", this.setLine)
  }

  componentWillUnmount () {
    this.state.channel.leave()
    this.setState({ connected: false, channel: null })
  }

  onPresenceState (message) {
    const users = Object.keys(message.state)
    this.setState({ users })
  }

  onPresenceDiff (message) {
    const joins = Object.keys(message.joins)
    const leaves = Object.keys(message.leaves)

    let users = this.state.users
    users = users.filter(u => leaves.indexOf(u) === -1)
    users = users.concat(joins)
    users = users.filter((u, i) => users.indexOf(u) === i)

    this.setState({ users })
  }

  onDraw ({ line }) {
    const { channel } = this.state
    this.setLine(line)
    channel.push("path/new", line)
  }

  setLine (line) {
    const { paths } = this.state
    paths[line.identifier] = line
    this.setState({ paths })
  }

  render () {
    const { socket } = this.props

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper style={{ padding: 16 }}>
            <Typography variant='headline'>
              Sketcher { socket.params.user }
            </Typography>

            <DrawingBoard paths={this.state.paths} onDraw={this.onDraw.bind(this)} />

            <ul>
              {
                this.state.users.map(
                  (u) => (
                    <li key={ u }>{ u }</li>
                  )
                )
              }
            </ul>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

Room.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
}

Room.styles = theme => ({
})

export default withStyles(
  Room.styles,
  { withTheme: true }
)(Room)