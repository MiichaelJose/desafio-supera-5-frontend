import { useEffect, useState } from "react";
import { Input } from "../../components/Input/input";
import mock from '../mock.json'
import { AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import api from "../../service/api";
import moment from 'moment';

import './styles.css';

export default function Tela() {
  const [totalList, setTotalList] = useState([]);
  const [list, setList] = useState([]);
  const [linhas, setLinhas] = useState(0);
  const [loading, setLoading] = useState(true);
  let [dataInicial, setDataInicial] = useState("");
  let [dataFinal, setDataFinal] = useState("");
  let [nomeOperador, setNomeOperador] = useState("");

  // utilizado para teste
  //let data = mock;
  useEffect(() => {
    preencherListaTotal()
  }, []);

  async function preencherListaTotal() {
    const { data } = await api.get('/api/transferencia');

    let lista = [];
    let cont = 1;

    data.listaTransferencias.forEach(e => {
      e.data_transferencia = formatarData(e.data_transferencia)
      
      if(cont <= 4) {
        lista.push(e);
      }

      cont++;
    })

    setList(lista);
    setLinhas(data.totalLinhas);
    setTotalList(data);
    setLoading(false);
  }

  function preencherTabela() {
    
  }

  function definirButtons() {
    const buttons = [];
    const contButton = Math.ceil(linhas / 4, 1);

    for (let i = 0; i < contButton; i++) {
      buttons.push(i);
    }
    
    return buttons.map((e, key) => <button key={key} onClick={() => mudarConteudoInicial(e+1)}>{e+1}</button>);
  }

  function mudarConteudoInicial(pagina) {

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

  async function filtrar() {
    const diaInico = pegarDia(dataInicial);
    const diaFim = pegarDia(dataFinal);
    
    if (dataInicial != "" || dataFinal != "" || nomeOperador != "") {
      
      let cont = 0;

      const d =  totalList.listaTransferencias.filter((e) => {
          const data = pegarDia(e.data_transferencia);
          // if(dataInicial != "" && dataFinal != "") {
          //     if (data >= diaInico && data <= diaFim) {
          //       console.log(e);
          //       return true;
          //     }

          //       //if(e.nome_operador_transacao.toLowerCase().includes(dataInicial.toLowerCase())) {
          //     else return false;
          // }else 
          if(dataInicial != "" || dataFinal != "") {
            if (data >= diaInico || data <= diaFim) {
              if(cont < 4) {
                
                cont++;
                return true;
              }
            }
            else return false;
          }
          
          // todos parametros
          // if(dataInicial != "" && dataFinal != "" && nomeOperador != "") {
          //   if (data >= diaInico && data <= diaFim) 
          //     if(e.nome_operador_transacao.toLowerCase().includes(dataInicial.toLowerCase())) {
          //       return true;
          //     }
          //   else return false;
          // // apenas datainicial e datafinal
          // }else if(dataInicial != "" && dataFinal != "") {
          //   if (data >= diaInico && data <= diaFim) 
          //     return true;
          //   else return false;
          // // apenas datainicial ou datafinal
          // }else if(dataInicial || "" && dataFinal || "") {
          //   if (data >= diaInico || data <= diaFim) 
          //     return true;
          //   else return false;
          // }
        })
      setList(d);
    }
  }
  
  function pegarDia(dataInicio) {
    const date = moment(dataInicio, 'DD/MM/YYYY').toDate();

    return date.getTime();
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

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

  return (
    <div className="main">
      <div className="container">
        <div className="inputs">
          <div>
            <Input placeholder={"data inicio"} label={'Data de Inicio'} change={(e) => setDataInicial(e.target.value)} value={dataInicial}/>
            <Input placeholder={"data fim"} label={'Data de Fim'} change={(e) => setDataFinal(e.target.value)} value={dataFinal}/>
            <Input placeholder={"t"} label={'Nome operador transacionado'} change={(e) => setNomeOperador(e.target.value)} value={nomeOperador}/>
          </div>
          <button onClick={() => filtrar()}>pequisar</button>
        </div>
        <div className="table">
          <header>
            <p>Saldo total: {dataInicial}</p>
            <p>Saldo no periodo: </p>
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
            <div>
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
                        <p>{e.tipo}</p>
                      </div>
                      <div>
                        <p>{e.nome_operador_transacao}</p>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <div>

            </div>
          </section>
          <footer>
              <div className="buttons">
                <div>
                  <p> <AiOutlineDoubleLeft/> </p>
                  <p> <AiOutlineLeft/> </p>
                </div>
                <div className="buttons__center">
                  {
                    !loading ? 
                    //botao.map((e, key) => <button key={key} onClick={() => mudarConteudo(e)}>{e}</button>)
                        definirButtons()
                    : ""
                  }

                </div>
                <div>
                  <p> <AiOutlineRight/> </p>
                  <p> <AiOutlineDoubleRight/> </p>
                </div>
              </div>
          </footer>
        </div>
      </div>
    </div>
  );
}