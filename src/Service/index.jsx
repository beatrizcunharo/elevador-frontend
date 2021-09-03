import axios from 'axios';

const BASE_URL = 'http://localhost:8080/historico-andar';
export default class HistoricoService {
    // Salva histórico do elevador
    static save(andarApertado) {
        return axios.post(BASE_URL, { andar: andarApertado }).catch((error) => console.log(error));
    }

    // Carrega o histórico
    static buscarTodos() {
        return axios.get(BASE_URL);
    }
}
