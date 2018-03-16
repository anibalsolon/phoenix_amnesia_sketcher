import React, { Component } from 'react'
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'

import { MuiThemeProvider } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import Theme from './Theme'

import {
  Lobby,
  Room
} from './containers'

import { Socket } from 'phoenix'

const socket = new Socket("/ws", {
  // logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }),
  params: { user: new Date().getTime().toString(16) }
})

socket.connect()
// socket.onOpen(ev => console.log("OPEN", ev))
// socket.onError(ev => console.log("ERROR", ev))
// socket.onClose(ev => console.log("CLOSE", ev))

class App extends Component {
  render () {
    return (
      <MuiThemeProvider theme={Theme}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Sketcher
            </Typography>
          </Toolbar>
        </AppBar>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' render={({ match }) => <Lobby match={match} socket={socket} />} />
            <Route exact path='/:room' render={({ match }) => <Room match={match} socket={socket} />} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }
}

export default App