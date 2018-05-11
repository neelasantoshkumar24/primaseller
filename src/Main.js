import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Albums from './Components/Albums';
import Artists from './Components/Artists';
import Tracks from './Components/Tracks';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Artists}/>
      <Route exact path='/viewalbums' component={Albums}/>
      <Route exact path='/viewtracks' component={Tracks}/>
    </Switch>
  </main>
)

export default Main
