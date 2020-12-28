import { deletar, listar } from "../services/cliente-service";
import { erro, sucesso } from "./alertas/alertas";
import { maskCep, maskCpf, maskPhone } from "../masks/masks";

import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { CardHeader } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import MailIcon from "@material-ui/icons/Mail";
import PhoneIcon from "@material-ui/icons/Phone";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { usuarioLogadoEhAdministrador } from "../services/autenticacao-service";
import { withRouter } from "react-router-dom";

class ClienteLista extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientes: [],
      usuarioLogadoEhAdministrador: usuarioLogadoEhAdministrador(),
    };
  }

  componentDidMount() {
    listar().then(
      (response) => {
        let { data } = response;
        this.setState({ clientes: data });
      },
      () => {
        erro("Oops!", "ocorreu um erro ao buscar clientes");
      }
    );
  }

  excluirCliente = (id) => {
    deletar(id)
      .then(() => {
        this.setState({
          clientes: this.state.clientes.filter((cliente) => cliente.id !== id),
        });
        sucesso("", "Cliente excluído com sucesso!");
      })
      .catch(() => {
        erro("Oops!", "Ocorreu um erro ao tentar excluir cliente");
      });
  };

  editarCliente = (cliente) => {
    this.props.history.push({
      pathname: "/editar",
      state: {
        cliente: cliente,
      },
    });
  };

  render() {
    const classes = {
      link: {},
    };

    return (
      <React.Fragment>
        <Container fixed>
          <Link to={"/novo"} className={classes.link}>
            <Typography variant="body2">
              {this.state.usuarioLogadoEhAdministrador && (
                <Button variant="contained" color="primary">
                  {this.state.clientes.length
                    ? "Novo Cliente"
                    : "Adicionar Cliente"}
                </Button>
              )}
            </Typography>
          </Link>

          {this.state.clientes.map((cliente) => {
            return (
              <Box key={cliente.id} m={2}>
                <Card>
                  <CardHeader>
                    <IconButton aria-label="delete" className={classes.margin}>
                      <DeleteIcon fontSize="large" />
                    </IconButton>
                  </CardHeader>
                  <CardContent>
                    <Typography color="textSecondary">
                      {cliente.nome}
                    </Typography>
                    <Typography>CPF: {maskCpf(cliente.cpf)}</Typography>
                    <Typography>
                      {cliente.logradouro}, {cliente.bairro}, {cliente.cidade},{" "}
                      {maskCep(cliente.cep)}, {cliente.complemento}
                    </Typography>
                    <Typography></Typography>
                    <Box m={2}>
                      <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                      >
                        <Grid>
                          <Box m={2}>
                            <Badge
                              badgeContent={cliente.emails.length}
                              color="primary"
                            >
                              <MailIcon />
                            </Badge>

                            {cliente &&
                              cliente.emails &&
                              cliente.emails.map((email) => (
                                <Typography
                                  key={email.id}
                                  color="textSecondary"
                                >
                                  {email.email}
                                </Typography>
                              ))}
                          </Box>
                        </Grid>
                        <Grid>
                          <Box m={2}>
                            <Badge
                              badgeContent={cliente.telefones.length}
                              color="primary"
                            >
                              <PhoneIcon />
                            </Badge>
                            {cliente &&
                              cliente.telefones &&
                              cliente.telefones.map((telefone) => (
                                <Typography
                                  key={telefone.id}
                                  color="textSecondary"
                                >
                                  {maskPhone(telefone.telefone, telefone.tipo)}
                                </Typography>
                              ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                  <CardActions>
                    {this.state.usuarioLogadoEhAdministrador && (
                      <React.Fragment>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            this.excluirCliente(cliente.id);
                          }}
                          className={classes.margin}
                        >
                          <DeleteIcon fontSize="large" />
                        </IconButton>

                        <IconButton
                          aria-label="Editar"
                          onClick={() => {
                            this.editarCliente(cliente);
                          }}
                          className={classes.margin}
                        >
                          <EditIcon fontSize="large" />
                        </IconButton>
                      </React.Fragment>
                    )}
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(ClienteLista);
