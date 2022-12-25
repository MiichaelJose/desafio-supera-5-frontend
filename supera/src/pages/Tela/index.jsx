import { useEffect, useState } from "react";

import { Input } from "../../components/Input/input";

//test
//import mock from '../mock.json';

import { AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

import api from "../../service/api";

import moment from 'moment';

import './styles.css';

export default function Tela() {
  const [totalList, setTotalList] = useState([]);
  const [list, setList] = useState([]);
  const [linhas, setLinhas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [saldoTotal, setSaldoTotal] = useState(0.00);
  const [saldoTotalPeriodo, setSaldoTotalPeriodo] = useState(0.00);

  let [dataInicial, setDataInicial] = useState("");
  let [dataFinal, setDataFinal] = useState("");
  let [nomeOperador, setNomeOperador] = useState("");

  // utilizado para teste
  //let data = mock;
  
  // para preencher a tabela logo quando a tela for renderizada
  useEffect(() => {
    preencherListaTotal();
  }, []);

  // botoes de paginação
  function mudarPaginaDireita() {
    if(pagina != pegarQuantidadeBotoes())
      mudarConteudoInicial(pagina + 1);
  }

  function mudarPaginaEsquerda() {
    if(pagina != 0 && pagina != 1)
      mudarConteudoInicial(pagina - 1);
  }

  function mudarPaginaDireitaUltima() {
    if(pagina != pegarQuantidadeBotoes())
      mudarConteudoInicial(pegarQuantidadeBotoes());
  }

  function mudarPaginaEsquerdaUltima() {
    if(pagina != 0 && pagina != 1)
      mudarConteudoInicial(1);
  }
  
  // preencher lista principal
  async function preencherListaTotal() {
    const { data } = await api.get('/api/transferencia');

    setLinhas(data.totalLinhas);
    setTotalList(data);
    preencherTabelaInicio(data);
    // definir que a lista ja esta preenchida para evitar o erro (map)
    setLoading(false);
  }

  // preencher a tabela
  function preencherTabelaInicio(data) {
    let lista = [];
    let cont = 1;

    let total = 0;

    data.listaTransferencias.forEach(e => {
      total += e.valor;

      e.data_transferencia = formatarData(e.data_transferencia);

      // 4 por ser o numero de linhas que eu quero na tabela
      if(cont <= 4) {
         lista.push(e);
      }

      cont++;
    })

    setSaldoTotal(total.toFixed(2));
    definirButtonsInicio();
    setList(lista);
  }

  // definir os botoes
  function definirButtonsInicio() {
    const buttons = [];
    const contButton = pegarQuantidadeBotoes();

    for (let i = 1; i <= contButton; i++) {
      buttons.push(i);
    }
    
    return buttons.map((e, key) => <button key={key} onClick={() => mudarConteudoInicial(e)}>{e}</button>);
  }

  // pegar o total de botoes calculado de acordo com o numero de linhas
  function pegarQuantidadeBotoes() {
    return Math.ceil(linhas / 4, 1);
  }

  // mudar o conteudo da tabela de acordo com a posição atual para a proxima
  function mudarConteudoInicial(pagina) {
    setPagina(pagina);

    const salto = pagina * 4;
    const ponto = salto - 4;

    let cont = 0;
    let novaLista = [];

    totalList.listaTransferencias.forEach(e => {
      if(cont >= ponto && cont < salto) {
        novaLista.push(e);
      }

      cont++;
    })

    setList(novaLista);
  }

  // filtro para todos as opções definidas
  async function filtrar() {
    const diaInico = pegarData(dataInicial);
    const diaFim = pegarData(dataFinal);

    let total = 0;

    if(dataInicial != '' || dataFinal != '' || nomeOperador != '') {
      setList(totalList.listaTransferencias.filter((e) => {
        const data = pegarData(e.data_transferencia);

        if(dataInicial != "" && dataFinal != "" && nomeOperador != "" &&  e.nome_operador_transacao != null) {
          if (data >= diaInico && data <= diaFim) {
            if(e?.nome_operador_transacao.toLowerCase().includes(nomeOperador.toLowerCase())) {
              total += e.valor;
              return true;
            }
          }
        // apenas datainicial e datafinal
        }else if(dataInicial != "" && dataFinal != "") {
          if (data >= diaInico && data <= diaFim) {
            total += e.valor;
            return true;
          }
        // apenas datainicial ou datafinal
        }else if(nomeOperador != "" && e.nome_operador_transacao != null) {
          if(e?.nome_operador_transacao.toLowerCase().includes(nomeOperador.toLowerCase())) {
            console.log('entrou');
            total += e.valor;
            return true;
          }
        }else if(dataInicial != "" || dataFinal != "") {
          if (data >= diaInico || data <= diaFim){
            total += e.valor;
            return true;
          }
        }
      }));
    }
    
    setSaldoTotalPeriodo(total.toFixed(2));
  }

  // pegando a data em miliseguindos
  function pegarData(dataInicio) {
    const date = moment(dataInicio, 'DD/MM/YYYY').toDate();
    return date.getTime();
  }

  // definido para monitorar o preenchimento da tabela (evitar erro de carregamento com o .map)
  if (loading) {
    return <p>Carregando...</p>;
  }

  // formatar data timestamp para data pt-br
  function formatarData(value) {
    let dataEntrada = value;
    let formato = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    let data = new Date(dataEntrada);
    let dataSaida = formato.format(data);
    return dataSaida;
  }

  //tabela criada manualmente sem biblioteca
  return (
    <div className="main">
      <div className="container">
        <div className="inputs">
          <div>
            <Input placeholder={"data inicio"} label={'Data de Inicio'} change={(e) => setDataInicial(e.target.value)} value={dataInicial}/>
            <Input placeholder={"data fim"} label={'Data de Fim'} change={(e) => setDataFinal(e.target.value)} value={dataFinal}/>
            <Input placeholder={"nome"} label={'Nome operador transacionado'} change={(e) => setNomeOperador(e.target.value)} value={nomeOperador}/>
          </div>
          <button onClick={() => filtrar()}>pequisar</button>
        </div>
        <div className="table">
          <header>
            <p>Saldo total: {!loading ? saldoTotal : "0"}</p>
            <p>Saldo no periodo: {!loading ? saldoTotalPeriodo : "0"}</p>
          </header>
          <section>
            <div className="thead">
              <div>
                <h4>Dados</h4>
              </div>
              <div>
                <h4>Valentia</h4>
              </div>
              <div>
                <h4>Tipo</h4>
              </div>
              <div>
                <h5>Nome operador transacionado</h5>
              </div>
            </div>
            <div className="table__contente">
              {
                list.map((e, key) => {
                  return(
                    <div className="tr" key={key}>
                      <div>
                        <p>{e.data_transferencia}</p>
                      </div>
                      <div>
                        <p>{e.valor}</p>
                      </div>
                      <div>
                        <span>{e.tipo}</span>
                      </div>
                      <div>
                        <p>{e.nome_operador_transacao}</p>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </section>
          <footer>
              <div className="buttons">
                <div className="button__imgs">
                  <p onClick={() => mudarPaginaEsquerdaUltima()}><AiOutlineDoubleLeft size={20}/></p>
                  <p onClick={() => mudarPaginaEsquerda()}><AiOutlineLeft size={20}/></p>
                </div>
                <div className="buttons__center">
                  { !loading ? definirButtonsInicio() : "" }
                </div>
                <div>
                  <p onClick={() => mudarPaginaDireita()}><AiOutlineRight size={20}/></p>
                  <p onClick={() => mudarPaginaDireitaUltima()}><AiOutlineDoubleRight size={20}/></p>
                </div>
              </div>
          </footer>
        </div>
      </div>
    </div>
  );
}