import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Authentication from './Authentication.js'
import Home from './Home.js'
import Landing from './Landing.js'

function Routes() {
    return (
        <div>
            <Switch>
                <Route path="/" exact component = {Landing}/>
                <Route path="/authentication" exact component = {Authentication}/>
                <Route path='/home' exact component = {Home} />
            </Switch>
        </div>
    )
}

export default Routes