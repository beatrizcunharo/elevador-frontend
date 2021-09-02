import React, { useState, useEffect, useCallback, useRef } from 'react';
import clsx from 'clsx';
import './Elevador.scss';

const tempoAndar = 1000;

function obterDistanciaBottom(andar) {
    return (andar - 1) * 20 + '%';
}

function acoesContainsAndar(acoes, andar) {
    return acoes.find((acao) => acao.andar === andar);
}

function obterTempoAnimacao(prevAndar, currAndar) {
    return Math.abs(currAndar - prevAndar) * tempoAndar;
}

function animarElevador(elevatorElement, tempoAnimacao, bottom) {
    elevatorElement.style.transition = `bottom ${tempoAnimacao}ms linear`;
    elevatorElement.style.bottom = bottom;
}

export function Elevador() {
    const elevatorContainerRef = useRef();
    const [andar, setAndar] = useState(1);
    const [acoes, setAcoes] = useState([{ andar }]);
    const [state, setState] = useState({
        mensagem: 'Você está no andar 1',
        portaAberta: true
    });

    function incluirAcao(_andar) {
        if (andar === _andar && state.portaAberta) alert('Você já se encontra no andar ' + _andar);
        else if (acoesContainsAndar(acoes, _andar)) return;
        else setAcoes([...acoes, { andar: _andar }]);
    }

    function tratarCliqueAndar(ev) {
        incluirAcao(ev.target.value);
    }

    function obterCssAndarAtivo(_andar) {
        return clsx(acoesContainsAndar(acoes, _andar) && _andar !== andar && 'btnActive');
    }

    const executarAcao = useCallback(
        async (_acoes) => {
            const acao = _acoes.pop();
            if (!acao || andar === acao?.andar) {
                setAcoes(_acoes);
                return;
            }
            const tempoAnimacao = obterTempoAnimacao(andar, acao.andar);
            console.log('Fechando as portas do Elevador...');

            // Anima o Elevador
            animarElevador(elevatorContainerRef.current, tempoAnimacao, obterDistanciaBottom(acao.andar));

            // Altera a Mensagem e fecha a porta
            setState((p) => ({
                ...p,
                mensagem: andar < acao.andar ? 'Subindo...' : 'Descendo...',
                portaAberta: false
            }));

            await setTimeout(() => {
                // Fazer: disparar no histórico
                // Elevador chegou no andar
                setState((p) => ({
                    ...p,
                    mensagem: 'Você está no andar ' + acao.andar,
                    portaAberta: true
                }));
                setAndar(acao.andar);
            }, tempoAnimacao);

            await setTimeout(() => {
                console.log('Aguardando pessoas saírem...');
                setAcoes(_acoes);
            }, 2000);
        },
        [andar]
    );

    const executorDeAcoes = useCallback(
        async (_acoes) => {
            await executarAcao(_acoes);
        },
        [executarAcao]
    );

    // Processa Ação
    useEffect(() => {
        if (acoes.length > 0) executorDeAcoes([...acoes]);
    }, [executorDeAcoes, acoes]);

    return (
        <div className='container'>
            <div className='floorSelect'>
                <h4>{state.mensagem}</h4>
                <ul>
                    <li value='1' onClick={tratarCliqueAndar} className={obterCssAndarAtivo(1)}>
                        1
                    </li>
                    <li value='2' onClick={tratarCliqueAndar} className={obterCssAndarAtivo(2)}>
                        2
                    </li>
                    <li value='3' onClick={tratarCliqueAndar} className={obterCssAndarAtivo(3)}>
                        3
                    </li>
                </ul>
            </div>

            <div className='building'>
                <div className='elevatorShaft'>
                    <div className='elevatorContainer' ref={elevatorContainerRef}>
                        <div className='elevatorStrings'></div>
                        <div className='elevator'>
                            <div className={clsx('door', state.portaAberta && 'open-left')} id='leftDoor'></div>
                            <div className={clsx('door', state.portaAberta && 'open-right')} id='rightDoor'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
