import NavBar from "./navbar";
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Configuracao() {

    const [nome, setNome] = useState("");
    const [numvagas, setNumvagas] = useState();

    const [carro15min, setCarro15min] = useState("");
    const [carro30min, setCarro30min] = useState("");
    const [carro1hr, setCarro1hr] = useState("");
    const [carro1hradc, setCarro1hradc] = useState("");

    const [moto15min, setMoto15min] = useState("");
    const [moto30min, setMoto30min] = useState("");
    const [moto1hr, setMoto1hr] = useState("");
    const [moto1hradc, setMoto1hradc] = useState("");

    const [caminhonete15min, setCaminhonete15min] = useState("");
    const [caminhonete30min, setCaminhonete30min] = useState("");
    const [caminhonete1hr, setCaminhonete1hr] = useState("");
    const [caminhonete1hradc, setCaminhonete1hradc] = useState("");

    const navigate = useNavigate();


    async function getConfig() {

        const token = window.localStorage.getItem('x-access-token');

        axios({
            method: 'get',
            url: 'http://localhost:3301/configuracoes',
            headers: {
                'x-access-token': token
            }
        }).then((res) => {
            console.log(res.data)
            setNome(res.data.estacionamento.nome);
            setNumvagas(res.data.estacionamento.numvagas)

            setCarro15min(res.data.carro.ate15min)
            setCarro30min(res.data.carro.ate30min)
            setCarro1hr(res.data.carro.ate1hr)
            setCarro1hradc(res.data.carro.adc1hr)

            setMoto15min(res.data.moto.ate15min)
            setMoto30min(res.data.moto.ate30min)
            setMoto1hr(res.data.moto.ate1hr)
            setMoto1hradc(res.data.moto.adc1hr)

            setCaminhonete15min(res.data.caminhonete.ate15min)
            setCaminhonete30min(res.data.caminhonete.ate30min)
            setCaminhonete1hr(res.data.caminhonete.ate1hr)
            setCaminhonete1hradc(res.data.caminhonete.adc1hr)




        }).catch((err) => {
            const erro = err.response.data.error;
            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
        })

    }

    function saveConfig() {

        const token = window.localStorage.getItem('x-access-token');

        axios({
            method: 'post',
            url: 'http://localhost:3301/configuracoes',
            headers: {
                'x-access-token': token
            },
            data: {
                nome: nome,
                numvagas: numvagas,
                carro15min: carro15min,
                carro30min: carro30min,
                carro1hr: carro1hr,
                carro1hradc: carro1hradc,
                moto15min: moto15min,
                moto30min: moto30min,
                moto1hr: moto1hr,
                moto1hradc: moto1hradc,
                caminhonete15min: caminhonete15min,
                caminhonete30min: caminhonete30min,
                caminhonete1hr: caminhonete1hr,
                caminhonete1hradc: caminhonete1hradc
            }
        }).then(()=>{
            Swal.fire("Configuração atualizada !", '', 'success')
        }).catch((err)=>{
            const erro = err.response.data.error;
            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
            if (erro === "fail-set-parking") { Swal.fire("Falha ao salvar os dados do estacionamento, por favor tente novamente !", '', 'error') }
            if (erro === "fail-set-car") { Swal.fire("Falha ao salvar os dados do carro, por favor tente novamente !", '', 'error') }
            if (erro === "fail-set-motorbike") { Swal.fire("Falha ao salvar os dados da moto, por favor tente novamente !", '', 'error') }
            if (erro === "fail-set-truck") { Swal.fire("Falha ao salvar os dados da caminhonete, por favor tente novamente !", '', 'error') }
            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }



        })



    }


    useEffect(() => {
        getConfig();
    }, [])

    return (
        <div>
            <NavBar />

            <div className="container">
                <div className="row">
                    <div className="col">
                        <h2>Estabelecimento</h2>
                        <div className="form-floating">
                            <input type="text" className="form-control" id="floatingInput" value={nome} onChange={(e) => setNome(e.target.value)} />
                            <label for="floatingInput">Nome</label>
                        </div>
                        N° de vagas
                        <input type="number" className="form-control" value={numvagas} onChange={(e) => setNumvagas(e.target.value)} />

                    </div>
                </div>
                <div className="row ">
                    <div className="col">
                        <h2>Carro</h2>
                        Até 15 min
                        <input type="number" className="form-control" value={carro15min} onChange={(e) => setCarro15min(e.target.value)} />
                        Até 30 min
                        <input type="number" className="form-control" value={carro30min} onChange={(e) => setCarro30min(e.target.value)} />
                        Até 1 Hora
                        <input type="number" className="form-control" value={carro1hr} onChange={(e) => setCarro1hr(e.target.value)} />
                        Após, a cada 1 hora adicional
                        <input type="number" className="form-control" value={carro1hradc} onChange={(e) => setCarro1hradc(e.target.value)} />
                        <h2>Moto</h2>
                        Até 15 min
                        <input type="number" className="form-control" value={moto15min} onChange={(e) => setMoto15min(e.target.value)} />
                        Até 30 min
                        <input type="number" className="form-control" value={moto30min} onChange={(e) => setMoto30min(e.target.value)} />
                        Até 1 Hora
                        <input type="number" className="form-control" value={moto1hr} onChange={(e) => setMoto1hr(e.target.value)} />
                        Após, a cada 1 hora adicional
                        <input type="number" className="form-control" value={moto1hradc} onChange={(e) => setMoto1hradc(e.target.value)} />
                        <h2>Caminhonete</h2>
                        Até 15 min
                        <input type="number" className="form-control" value={caminhonete15min} onChange={(e) => setCaminhonete15min(e.target.value)} />
                        Até 30 min
                        <input type="number" className="form-control" value={caminhonete30min} onChange={(e) => setCaminhonete30min(e.target.value)} />
                        Até 1 Hora
                        <input type="number" className="form-control" value={caminhonete1hr} onChange={(e) => setCaminhonete1hr(e.target.value)} />
                        Após, a cada 1 hora adicional
                        <input type="number" className="form-control" value={caminhonete1hradc} onChange={(e) => setCaminhonete1hradc(e.target.value)} />
                    </div>

                </div>
                <div className="row p-3">
                    <button className="btn btn-primary" onClick={saveConfig}>Salvar</button>
                </div>
            </div>

        </div>
    )
}



export default Configuracao;