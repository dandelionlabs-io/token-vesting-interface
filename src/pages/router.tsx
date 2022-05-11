import { Route, Switch } from 'react-router-dom'

import Dashboard from './Dashboard'
import LandingPage from './LandingPage'
import NotFound from './NotFound'

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
      <Route path="/dashboard" component={Dashboard} />
      <Route exact component={NotFound} />
    </Switch>
  )
}

export default RouterPage
