import { FieldArray, Formik } from "formik";
import { FormControl, Grid, InputLabel, MenuItem } from "@material-ui/core";
import { atualizar, criar } from "../services/cliente-service";
import { erro, sucesso } from "./alertas/alertas";
import {
  maskCep,
  maskCpf,
  maskJustLetters,
  maskJustNumbers,
  maskPhone,
} from "../masks/masks";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import React from "react";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { obterEnderecoPeloCep } from "../services/via-cep-service";
import { validate } from "cpf-check";
import { withRouter } from "react-router-dom";

class FormularioCliente extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        cpf: "",
        nome: "",
        emails: [],
        telefones: [],
        cep: "",
        logradouro: "",
        bairro: "",
        cidade: "",
        uf: "",
        complemento: "",
        email: "",
        celular: "",
        tipo: "",
      },
    };

    if (
      props &&
      props.location &&
      props.location.state &&
      props.location.state.cliente
    ) {
      this.state.values = {
        ...this.state.values,
        ...props.location.state.cliente,
      };
    }
  }

  onSubmit = (dados, { setSubmitting }) => {
    const cpf = maskJustNumbers(dados.cpf);
    const telefones = dados.telefones.map((telefone) => {
      telefone.telefone = maskJustNumbers(telefone.telefone);
      return telefone;
    });

    dados = { ...dados, cpf, telefones };

    if (dados && dados.id) {
      this.atualizarCliente(dados);
      return;
    }

    criar(JSON.stringify(dados))
      .then(() => {
        sucesso("", "Cliente cadastrado com sucesso!");
        this.props.history.push("/clientes");
      })
      .catch(() => {
        erro("Oops", "Ocorreu um erro ao tentar salvar o cliente");
      });
  };

  atualizarCliente = (cliente) => {
    atualizar(cliente)
      .then((resposta) => {
        sucesso("", "Cliente atualizado com sucesso!");
        this.props.history.push("/clientes");
      })
      .catch(() => {
        erro("Oops", "Ocorreu um erro ao tentar atualizar dados do cliente");
      });
  };

  atualizarCampoDependentesDoCep = (value, setFieldValue) => {
    let cep = value.target.value.replace(/\D/g, "");

    if (cep.length > 6) {
      obterEnderecoPeloCep(cep).then((res) => {
        if (res) {
          let { complemento, logradouro, localidade, uf, bairro } = res.data;
          setFieldValue("logradouro", logradouro);
          setFieldValue("complemento", complemento);
          setFieldValue("cidade", localidade);
          setFieldValue("uf", uf);
          setFieldValue("bairro", bairro);
        }
      });
    }
    setFieldValue("cep", value.target.value);
  };

  adicionarEmail = (
    values,
    arrayHelpers,
    setFieldValue,
    getFieldProps,
    touched
  ) => {
    const emailCadastrado = values.emails.some(
      (email) => email.email === getFieldProps("email").value
    );

    if (emailCadastrado) {
      erro("Opos!", "email já adicionado");
      return;
    }

    arrayHelpers.push({
      email: getFieldProps("email").value,
    });

    setFieldValue("email", "");
    touched.email = false;
  };

  adicionarTelefone(
    values,
    arrayHelpers,
    setFieldValue,
    getFieldProps,
    touched
  ) {
    const telefoneCadastrado = values.telefones.some(
      (telefone) =>
        telefone.telefone === maskJustNumbers(getFieldProps("celular").value)
    );

    if (telefoneCadastrado) {
      erro("Opos!", "telefone já adicionado");
      return;
    }

    arrayHelpers.push({
      telefone: getFieldProps("celular").value,
      tipo: getFieldProps("tipo").value,
    });

    setFieldValue("celular", "");
    setFieldValue("tipo", "");
    touched.celular = false;
  }

  render() {
    const classes = {
      table: {
        minWidth: 650,
      },
      link: {},
    };

    return (
      <React.Fragment>
        <Container fixed>
          <Box m={2}>
            <Link to={"/clientes"} className={classes.link}>
              <Typography variant="body2">
                <Button margin="normal" variant="contained">
                  Cancelar
                </Button>
              </Typography>
            </Link>
          </Box>

          <Formik
            initialValues={this.state.values}
            validateOnMount={true}
            onSubmit={this.onSubmit}
            validate={(values) => {
              const errors = {};

              if (!values.cpf) {
                errors.cpf = "Precisamos do seu cpf para continuar";
              } else if (!validate(values.cpf)) {
                errors.cpf = "O cpf informádo não é válido";
              }

              if (!values.nome) {
                errors.nome = "Informe seu nome para continuar";
              } else if (values.nome.length < 3) {
                errors.nome = "Seu nome deve conter mais de 3 caracteres";
              } else if (values.nome.length > 100) {
                errors.nome = "Seu nome deve conter menos de 100 caracteres";
              }

              if (values.emails && !values.emails.length) {
                errors.emails = "Pelo menos um email deve ser adicionado";
              }

              if (values.telefones && !values.telefones.length) {
                errors.emails = "Pelo menos um email deve ser adicionado";
              }

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
              isValid,
            }) => (
              <form onSubmit={handleSubmit} id="form1">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.nome && touched.nome}
                      helperText={errors.nome && touched.nome && errors.nome}
                      label="Nome Completo"
                      type="text"
                      variant="outlined"
                      fullWidth
                      name="nome"
                      value={maskJustLetters(values.nome)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      error={errors.cpf && touched.cpf}
                      helperText={errors.cpf && touched.cpf && errors.cpf}
                      label="CPF"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="cpf"
                      value={maskCpf(values.cpf)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Cep"
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        maxLength: 10,
                      }}
                      type="text"
                      name="cep"
                      value={maskCep(values.cep)}
                      onChange={(value) => {
                        this.atualizarCampoDependentesDoCep(
                          value,
                          setFieldValue
                        );
                      }}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Cidade"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="cidade"
                      value={values.cidade}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Logradouro"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="logradouro"
                      value={values.logradouro}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="UF"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="uf"
                      value={values.uf}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Complemento"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="complemento"
                      value={values.complemento}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bairro"
                      variant="outlined"
                      fullWidth
                      type="text"
                      name="bairro"
                      value={values.bairro}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="h5">Telefones</Typography>
                    <FieldArray
                      name="telefones"
                      render={(arrayHelpers) => (
                        <div>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="tipoTelefone">
                              Tipo de telefone
                            </InputLabel>
                            <Select
                              labelId="tipoTelefone"
                              id="tipoTelefone"
                              value={values.tipo}
                              name="tipo"
                              onChange={handleChange}
                              label="Tipo do telefone"
                            >
                              <MenuItem value={"RESIDENCIAL"}>
                                Residencial
                              </MenuItem>
                              <MenuItem value={"CELULAR"}>Celular</MenuItem>
                              <MenuItem value={"COMERCIAL"}>Comercial</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            margin="normal"
                            error={errors.celular && touched.celular}
                            helperText={
                              errors.celular &&
                              touched.celular &&
                              errors.celular
                            }
                            label="Celular"
                            variant="outlined"
                            fullWidth
                            type="text"
                            name="celular"
                            value={maskPhone(
                              values.celular,
                              getFieldProps("tipo").value
                            )}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <Box m={2}>
                            <Button
                              type="button"
                              disabled={
                                !getFieldProps("celular").value ||
                                !getFieldProps("tipo").value
                              }
                              onClick={() =>
                                this.adicionarTelefone(
                                  values,
                                  arrayHelpers,
                                  setFieldValue,
                                  getFieldProps,
                                  touched
                                )
                              }
                              variant="contained"
                              color="primary"
                            >
                              +
                            </Button>
                          </Box>

                          {values.telefones && values.telefones.length > 0
                            ? values.telefones.map((telefone, index) => (
                                <div key={index}>
                                  {maskPhone(
                                    values.telefones[index].telefone,
                                    values.telefones[index].tipo
                                  )}{" "}
                                  ({values.telefones[index].tipo})
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    -
                                  </button>
                                </div>
                              ))
                            : null}
                        </div>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="h5">Emails</Typography>
                    <FieldArray
                      name="emails"
                      render={(arrayHelpers) => (
                        <div>
                          <TextField
                            error={errors.email && touched.email}
                            helperText={
                              errors.email && touched.email && errors.email
                            }
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="text"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />

                          <Box m={2}>
                            <Button
                              type="button"
                              onClick={() => {
                                this.adicionarEmail(
                                  values,
                                  arrayHelpers,
                                  setFieldValue,
                                  getFieldProps,
                                  touched,
                                  errors
                                );
                              }}
                              variant="contained"
                              color="primary"
                              disabled={
                                (errors && !!errors.email) ||
                                !getFieldProps("email").value ||
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                  getFieldProps("email").value
                                )
                              }
                            >
                              +
                            </Button>
                          </Box>

                          {values.emails && values.emails.length > 0
                            ? values.emails.map((email, index) => (
                                <div key={index}>
                                  {values.emails[index].email}
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    -
                                  </button>
                                </div>
                              ))
                            : null}
                        </div>
                      )}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  form="form1"
                  variant="contained"
                  color="primary"
                  disabled={!isValid}
                >
                  Salvar
                </Button>
              </form>
            )}
          </Formik>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(FormularioCliente);
