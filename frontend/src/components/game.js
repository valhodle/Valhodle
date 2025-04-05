import React, { useState, useEffect, useCallback, useRef } from 'react';
import { iniciarJogo, verificarTentativa } from '../api/api';
import Feedback from './feedback';
import Ranking from './ranking';
import './game.css';
import { FaGamepad, FaArrowRight, FaMedal, FaPlay, FaStar, FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const Game = () => {
    const [jogoId, setJogoId] = useState(null);
    const [tentativas, setTentativas] = useState(0);
    const [feedbacks, setFeedbacks] = useState([]);
    const [acertou, setAcertou] = useState(false);

    const [jogador, setJogador] = useState('');
    const [tentativa, setTentativa] = useState('');
    const [modo, setModo] = useState('normal');

    const [mostrarRanking, setMostrarRanking] = useState(false);
    const [tempoRestante, setTempoRestante] = useState('');

    const [esperandoResposta, setEsperandoResposta] = useState(false);
    const [tempoEspera, setTempoEspera] = useState(0);
    const [mostrarAjuda, setMostrarAjuda] = useState(false);
    const esperaRef = useRef(null);

    const formatarTempo = (ms) => {
        const horas = Math.floor(ms / 1000 / 60 / 60);
        const minutos = Math.floor((ms / 1000 / 60) % 60);
        const segundos = Math.floor((ms / 1000) % 60);
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    const atualizarTempo = useCallback(() => {
        const agora = new Date();
        const meiaNoite = new Date();
        meiaNoite.setHours(24, 0, 0, 0);
        const diff = meiaNoite - agora;
        setTempoRestante(formatarTempo(diff));
    }, []);

    const iniciarContagemEspera = () => {
        setTempoEspera(0);
        setMostrarAjuda(false);
        esperaRef.current = setInterval(() => {
            setTempoEspera(prev => {
                const novoTempo = prev + 1;
                if (novoTempo >= 5) setMostrarAjuda(true);
                return novoTempo;
            });
        }, 1000);
    };

    const pararContagemEspera = () => {
        clearInterval(esperaRef.current);
        setTempoEspera(0);
        setEsperandoResposta(false);
        setMostrarAjuda(false);
    };

    const handleIniciarJogo = useCallback(async () => {
        setEsperandoResposta(true);
        iniciarContagemEspera();
        try {
            const nome = jogador.trim() || 'Anonimo';
            const jogo = await iniciarJogo(nome, modo);

            setJogoId(jogo.jogo_id);

            if (jogo.mensagem?.includes("já jogou hoje")) {
                setFeedbacks([{ feedback: jogo.feedback, acertou: jogo.acertou }]);
                setAcertou(jogo.acertou);
                setTentativas(jogo.tentativas);
            } else {
                setFeedbacks([]);
                setAcertou(false);
                setTentativas(0);
            }
        } catch (err) {
            console.error("Erro ao iniciar o jogo:", err);
            alert("Erro ao iniciar o jogo. Tente novamente.");
        } finally {
            pararContagemEspera();
        }
    }, [jogador, modo]);

    const handleEnviarTentativa = useCallback(async () => {
        if (!tentativa) return;

        try {
            const resposta = await verificarTentativa(jogoId, tentativa);
            if (resposta.mensagem === "Amigo não encontrado!") return;

            setFeedbacks(prev => [
                { feedback: resposta.feedback, acertou: resposta.acertou },
                ...prev
            ]);
            setAcertou(resposta.acertou);
            setTentativas(resposta.tentativas);
            setTentativa('');
        } catch (err) {
            console.error("Erro ao verificar tentativa:", err);
            alert("Erro ao enviar tentativa. Tente novamente.");
        }
    }, [tentativa, jogoId]);

    useEffect(() => {
        atualizarTempo();
        const intervalo = setInterval(atualizarTempo, 1000);
        return () => clearInterval(intervalo);
    }, [atualizarTempo]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleEnviarTentativa();
    };

    const renderModoBotao = (modoAtual, icone, tooltip, onClick, selecionado = false) => (
        <>
            <button 
                className={`modo-btn ${selecionado ? 'selected' : ''}`}
                onClick={onClick}
                data-tooltip-id={`tooltip-${tooltip}`}
            >
                {icone}
            </button>
            <Tooltip id={`tooltip-${tooltip}`} place="top" content={tooltip} />
        </>
    );

    return (
        <div>
            <h1 className="tituloLOL">Valhodle</h1>

            <div className="modo-container">
                {renderModoBotao("normal", <FaGamepad className="modo-icon" />, "Modo normal", () => setModo("normal"), modo === "normal")}
                {renderModoBotao("ranking", <FaMedal className="modo-icon" />, "Ranking", () => setMostrarRanking(true), mostrarRanking)}
                {renderModoBotao("em-breve", <FaStar className="modo-icon" />, "Novos modos em breve", () => {}, false)}
            </div>

            {mostrarRanking && <Ranking onClose={() => setMostrarRanking(false)} />}

            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="input-jogador"
                        placeholder="Jogador"
                        value={jogador}
                        onChange={(e) => setJogador(e.target.value)}
                        data-tooltip-id="tooltip-jogador"
                    />
                    <Tooltip id="tooltip-jogador" place="top" content="Digite seu nome ou jogue anonimamente" />
                </div>
            </div>

            <div className="btn-ajuda-container">
                <button className="btn-iniciar" onClick={handleIniciarJogo}>
                    <FaPlay />
                </button>

                {esperandoResposta && mostrarAjuda && (
                    <>
                        <button 
                            className="btn-ajuda" 
                            data-tooltip-id="tooltip-ajuda"
                        >
                            <FaQuestionCircle />
                        </button>
                        <Tooltip 
                            id="tooltip-ajuda" 
                            place="top" 
                            content={`Esperando resposta do servidor há ${tempoEspera} segundos...`}
                        />
                    </>
                )}
            </div>

            {jogoId && acertou && (
                <div className="contador-container">
                    <p className="contador-texto">
                        Próximo jogo em: <strong>{tempoRestante}</strong>
                    </p>
                </div>
            )}

            {jogoId && !acertou && (
                <div className="tentativa-container">
                    <input
                        type="text"
                        placeholder="Digite um nome..."
                        value={tentativa}
                        onChange={(e) => setTentativa(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="input-tentativa"
                    />
                    <button className="btn-enviar" onClick={handleEnviarTentativa}>
                        Enviar
                    </button>
                </div>
            )}

            <div>
                {acertou && (
                    <h2 className="parabens">
                        Parabéns! Você acertou em {tentativas} {tentativas === 1 ? 'tentativa' : 'tentativas'}!
                    </h2>
                )}
                <Feedback tentativas={feedbacks} />
            </div>
        </div>
    );
};

export default Game;
