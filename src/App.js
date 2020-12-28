import "./App.css";

import { Redirect, Route, Switch } from "react-router-dom";

import ClienteLista from "./pages/clientes-lista";
import FormularioCliente from "./pages/formulario-cliente";
import Login from "./pages/login";
import React from "react";
import { usuarioEstaLogado } from "./services/autenticacao-service";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">Clientes</header>
        <Switch>
          <Route exact path={["/", "/login"]} component={Login} />
          <Route
            exact
            path={["/clientes"]}
            render={() =>
              usuarioEstaLogado() ? <ClienteLista /> : <Redirect to={"/"} />
            }
          />
          <Route
            exact
            path={["/novo", "/editar"]}
            render={() =>
              usuarioEstaLogado() ? (
                <FormularioCliente />
              ) : (
                <Redirect to={"/"} />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

export default App;
