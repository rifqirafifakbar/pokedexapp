import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// pages
import { Home } from "./components/Pages/Home/Home";

function Routes() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/:query?" component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
