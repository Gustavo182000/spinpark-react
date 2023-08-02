import NavBar from "./navbar";
import './home.css'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const [clientes, setClientes] = useState([]);
  const [numvagas, setNumvagas] = useState(0);
  const [numvagasUso, setNumvagasUso] = useState(0);
  const navigate = useNavigate();

  function getClientes() {

    const token = window.localStorage.getItem('x-access-token');

    axios({
        method: 'get',
        url: 'http://localhost:3301/cliente',
        headers: {
            'x-access-token': token
        }
    }).then((res) => {
        var filtrado = res.data.filter(function(obj) { return obj.saida === undefined; });
        setClientes(res.data)
        setNumvagasUso(filtrado.length)


    }).catch((err) => {
        const erro = err.response.data.error;

        if (erro === "failed-auth-token") {
            Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
            navigate('/login', { replace: true })
        }

    })


    axios({
        method: 'get',
        url: 'http://localhost:3301/configuracoes',
        headers: {
            'x-access-token': token
        }
    }).then((res) => {
        setNumvagas(res.data.estacionamento.numvagas);
    }).catch((err) => {
      const erro = err.response.data.error;

      if (erro === "failed-auth-token") {
          Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
          navigate('/login', { replace: true })
      }
    })
}

useEffect(()=>{
  getClientes();
},[])

  return (
    <div>
      <NavBar />

      <div class="container">
        <div class="row">

          <div class="col-md-3">
            <div className="card-counter primary">
              <i className="fa fa-car"></i>
              <span className="count-numbers">{numvagas}</span>
              <span className="count-name">Vagas</span>
            </div>
          </div>

          <div class="col-md-3">
            <div className="card-counter success">
              <i className="fa fa-check-square"></i>
              <span className="count-numbers">{numvagas - numvagasUso}</span>
              <span className="count-name">Vagas Disponiveis</span>
            </div>
          </div>

          <div class="col-md-3">
            <div className="card-counter danger">
              <i className="fa fa-exclamation-triangle"></i>
              <span className="count-numbers">{numvagasUso}</span>
              <span className="count-name">Vagas ocupadas</span>
            </div>
          </div>

          <div class="col-md-3">
            <div className="card-counter info">
              <i className="fa fa-recycle"></i>
              <span className="count-numbers">{clientes.length}</span>
              <span className="count-name">Total Rotatividade</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}



export default Home;