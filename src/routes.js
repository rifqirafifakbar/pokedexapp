import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// pages
import { Home } from "./components/Pages/Home/Home";
import { Details } from "./components/Pages/Details/Details";

function Routes() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/:query?" component={Home} />
          <Route exact path="/details/:name?" component={Details} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
