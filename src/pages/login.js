import { Container, CssBaseline } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { autenticar } from "../services/autenticacao-service";
import { withRouter } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        usuario: "",
        senha: "",
      },
    };
  }

  onSubmit = ({ usuario, senha }) => {
    autenticar({ username: usuario, password: senha })
      .then((res) => {
        if (res && res.data) {
          const { token } = res.data;
          localStorage.setItem("token", token);
          this.props.history.push("/clientes");
        }
      })
      .catch((erro) => {
        erro("ocorreu um erro ao tentar logar", erro);
      });
  };

  render() {
    const classes = {};

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>

          <Formik
            initialValues={this.state.values}
            validateOnMount={true}
            onSubmit={this.onSubmit}
            validate={(values) => {
              const errors = {};

              return errors;
            }}
          >
            {({
              values,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              errors,
              setFieldValue,
              getFieldProps,
              useField,
              isValid,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} id="login">
                <TextField
                  error={errors.usuario && touched.usuario}
                  helperText={
                    errors.usuario && touched.usuario && errors.usuario
                  }
                  label="Usuário"
                  type="text"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="usuario"
                  value={values.usuario}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="usuario"
                  autoFocus
                />

                <TextField
                  error={errors.senha && touched.senha}
                  helperText={errors.senha && touched.senha && errors.senha}
                  label="Senha"
                  margin="normal"
                  type="password"
                  variant="outlined"
                  fullWidth
                  name="senha"
                  value={values.senha}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="senha"
                  autoFocus
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Entrar
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </Container>
    );
  }
}

export default withRouter(Login);
