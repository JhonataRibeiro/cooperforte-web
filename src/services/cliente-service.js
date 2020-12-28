const axios = require("axios");
axios.defaults.headers.post["Content-Type"] = "application/json";

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVICO_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const criar = (cliente) => {
  return api.post(`/clientes`, cliente);
};

const atualizar = (cliente) => {
  return api.put(`/clientes/${cliente.id}`, cliente);
};

const deletar = (id) => {
  return api.delete(`clientes/${id}`);
};
const listar = () => {
  //Workaround
  if (
    api.defaults &&
    api.defaults.headers.Authorization &&
    api.defaults.headers.Authorization.includes(null)
  ) {
    api.defaults.headers.Authorization = `Bearer ${localStorage.getItem(
      "token"
    )}`;
  }
  return api.get(`/clientes`);
};

export { listar, criar, atualizar, deletar };
