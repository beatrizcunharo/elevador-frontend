import clsx from 'clsx';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import './Elevador.scss';
import Service from '../../Service';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import ModalComponent from '../ModalComponent';

const containerHeight = 750;
const countAndares = 4;
const opcoesAndares = Array.from(Array(countAndares).keys())
    .map((x) => ++x)
    .reverse();
const heightPercAndar = 75 / (countAndares - 1);
const tempoAndar = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function obterTempoAnimacao(prevAndar, currAndar) {
    return Math.abs(currAndar - prevAndar) * tempoAndar;
}

function animarElevador(elevatorElement, tempoAnimacao, andar) {
    elevatorElement.style.transition = `bottom ${tempoAnimacao - 500}ms linear`;
    elevatorElement.style.bottom = (andar - 1) * heightPercAndar + '%';
}

const acoes = [];
export function Elevador() {
    const elevatorContainerRef = useRef();
    const andarRef = useRef(1);
    const [andaresApertados, setAndaresApertados] = useState([]);
    const [open, setOpen] = useState(false);
    const [{ mensagem, portaAberta }, setState] = useState({
        mensagem: 'Você está no andar 1',
        portaAberta: true
    });

    function tratarApertoBotao(btnAndar) {
        if (andarRef.current === btnAndar && portaAberta) alert('Você já se encontra no andar ' + btnAndar);
        else if (andaresApertados.includes(btnAndar)) return;
        else {
            acoes.unshift(btnAndar);
            setAndaresApertados([btnAndar, ...andaresApertados]);
        }
    }

    const moverElevador = useCallback(async (andarApertado) => {
        const tempoAnimacao = obterTempoAnimacao(andarRef.current, andarApertado);

        // Fechando as portas do elevador
        setState((p) => ({ ...p, portaAberta: false }));
        await sleep(300);

        // Anima o Elevador
        animarElevador(elevatorContainerRef.current, tempoAnimacao, andarApertado);

        // Altera a Mensagem
        setState((p) => ({
            ...p,
            mensagem: andarRef.current < andarApertado ? 'Subindo /\\' : 'Descendo \\/'
        }));

        // Aguarda o tempo da animação
        await sleep(tempoAnimacao);

        // Chegou no andar

        // Salvando no histórico
        Service.save(andarApertado);

        andarRef.current = andarApertado;
        setState((p) => ({
            ...p,
            mensagem: 'Você está no andar ' + andarApertado,
            portaAberta: true
        }));

        // Limpa o andar apertado do array
        setAndaresApertados((pAndaresApertados) => pAndaresApertados.filter((andar) => andar !== andarApertado));
        await sleep(tempoAndar);
    }, []);

    const verificarAndarApertado = useCallback(async () => {
        while (acoes.length) {
            const andarApertado = acoes.pop();
            if (andarApertado) await moverElevador(andarApertado);
        }
        await sleep(1000);
        await verificarAndarApertado();
    }, [moverElevador]);

    /**
     * Fica verificando se tem andares apertados e executa a ação de mover o elevador
     */
    useEffect(() => {
        verificarAndarApertado();
    }, [verificarAndarApertado]);

    // Abrir e fechar o modal do histórico
    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    return (
        <div className='container'>
            <div className='floorSelect'>
                <h4>{mensagem}</h4>
                <ul>
                    {opcoesAndares.map((andarValue) => (
                        <li
                            key={andarValue}
                            value={andarValue}
                            onClick={(ev) => tratarApertoBotao(ev.target.value)}
                            className={clsx({
                                btnInFloor: andarValue === andarRef.current,
                                btnActive: andaresApertados.includes(andarValue)
                            })}
                        >
                            {andarValue}
                        </li>
                    ))}
                    <Button className='button' variant='contained' color='default' onClick={handleOpen}>
                        Histórico
                    </Button>
                </ul>
            </div>

            <div className='building'>
                <div className='elevatorShaft'>
                    <div className='elevatorContainer'>
                        <div className='elevatorStrings' />
                        <div
                            className='elevator'
                            ref={elevatorContainerRef}
                            style={{ height: containerHeight / countAndares }}
                        >
                            <div className={clsx('door', portaAberta && 'open-left')} id='leftDoor'></div>
                            <div className={clsx('door', portaAberta && 'open-right')} id='rightDoor'></div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='simple-modal-title'
                aria-describedby='simple-modal-description'
            >
                <ModalComponent />
            </Modal>
        </div>
    );
}
