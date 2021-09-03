import axios from 'axios';

const BASE_URL = 'http://localhost:8080/historico-andar';
export default class Elevador {
    // Salva histórico do elevador
    static save(andarApertado) {
        axios.post(BASE_URL, { andar: andarApertado });
    }
}
