import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'

export default class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = { users: [] }
  }
}