import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'

class Lobby extends Component {
  constructor(props) {
    super(props)
    this.state = { users: [] }
  }

  componentDidMount () {
    const { socket } = this.props
    const channel = socket.channel('lobby')

    channel
      .join()

    channel.on("presence_state", this.onPresenceState.bind(this))
    channel.on("presence_diff", this.onPresenceDiff.bind(this))
  }

  componentWillUnmount () {
    socket.channel('lobby').leave().receive("ok", () => alert("left!") )
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

  render () {
    const { socket } = this.props

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper style={{ padding: 16 }}>
            <Typography variant='headline'>
              Sketcher { socket.params.user }
            </Typography>

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

Lobby.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
}

Lobby.styles = theme => ({
})

export default withStyles(
  Lobby.styles,
  { withTheme: true }
)(Lobby)