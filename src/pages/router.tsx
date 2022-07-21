import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './Dashboard'
import LandingPage from './LandingPage'
import NotFound from './NotFound'
import Pool from './Pool'
import SupportPage from './SupportPage/index'

const RouterPage = () => {
  return (
    <Switch>
      <Route exact path="/">
        <LandingPage />
      </Route>
      <Route exact path="/career">
        <LandingPage />
      </Route>
      <Route exact path="/blog">
        <LandingPage />
      </Route>
      <Route exact path="/contact">
        <LandingPage />
      </Route>
      <Route exact path="/support">
        <SupportPage />
      </Route>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pool" component={Pool} />
      <Route exact component={NotFound} />
    </Switch>
  )
}

export default RouterPage
