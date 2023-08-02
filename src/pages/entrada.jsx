import NavBar from "./navbar";
import Swal from 'sweetalert2'
import axios from 'axios';
import moment from "moment/moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Entrada() {

    var JsBarcode = require('jsbarcode');
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(0, 0);


    const [placa, setPlaca] = useState("");
    const [veiculo, setVeiculo] = useState("Carro");
    const [clientes, setClientes] = useState([]);
    const [nome, setNome] = useState("");
    const [numvagas, setNumvagas] = useState(0);
    const [numvagasUso, setNumvagasUso] = useState(0);




    const [entrada, setEntrada] = useState("");
    const [saida, setSaida] = useState("");
    const [permanencia, setPermanencia] = useState("");
    const [valor, setValor] = useState("");
    const [id, setId] = useState("");
    const [pagamento, setPagamento] = useState("Dinheiro");

    const [busca, setBusca] = useState("");
    const navigate = useNavigate();


    function handleRegistrar() {

        const token = window.localStorage.getItem('x-access-token');
        getClientes();

        

        if(numvagas <= numvagasUso){
            return Swal.fire({
                icon: 'error',
                title: 'Todas as vagas estão ocupadas !',
                text: 'Para alterar o número de vagas acesse a aba de configurações.',
            })
        }

    
        axios({
            method: 'post',
            url: 'http://localhost:3301/cliente',
            headers: {
                'x-access-token': token
            },
            data: {
                placa: placa,
                veiculo: veiculo
            }
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Veiculo Registrado !',
                text: 'Para impirmir o comprovante clique em imprimir na tabela.',
            })
            setPlaca("")
            getClientes()
        }).catch((err) => {
            const erro = err.response.data.error;
            if (erro === "failed-auth-token") { return Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error') }
            if (erro === "create-error") { return Swal.fire("Erro ao adicionar cliente, por favor tente novamente !", '', 'error') }
            if (erro === "placa-is-empty") { return Swal.fire("O campo placa está vazio !", '', 'error') }

            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
            return Swal.fire("Erro desconhecido, por favor tente novamente !", '', 'error')
        })


    }

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
            setClientes(filtrado)
            setNumvagasUso(filtrado.length)
            console.log(filtrado)


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
            setNome(res.data.estacionamento.nome);
            setNumvagas(res.data.estacionamento.numvagas);
        }).catch((err) => {
            const erro = err.response.data.error;

            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
        })
    }

    function handleImprimirA4(id, entrada, placa) {

        JsBarcode(canvas, id);


        var docDefinition = {
            //pageSize: {width: 151, height: 176},
            content: [
                { text: `TICKET ${id}`, style: { bold: true }, margin: [110, 0, 0, 0], fontSize: 20 },
                { text: `ENTRADA: ${entrada} `, style: { bold: false }, margin: [170, 20, 0, 0] },
                { text: `PLACA:   ${placa} `, style: { bold: false }, margin: [170, 20, 0, 0] },
                { image: canvas.toDataURL(), width: 160, height: 80, margin: [190, 20, 0, 0] }, 
                { text: nome, style: { bold: false }, margin: [180, 20, 0, 0] },
            ],
        };
        pdfMake.createPdf(docDefinition).open();
    }
    function handleImprimirEtiqueta(id, entrada, placa) {

        JsBarcode(canvas, id);

        var docDefinition = {
            pageSize: { width: 151, height: 176 },
            content: [
                { text: `TICKET ${id}`, style: { bold: true }, fontSize: 7 },
                { text: `ENTRADA: ${entrada} `, style: { bold: false }, margin: [0, 3, 0, 0], fontSize: 6 },
                { text: `PLACA:   ${placa} `, style: { bold: false }, margin: [0, 2, 0, 0], fontSize: 6 },
                { image: canvas.toDataURL(), width: 60, height: 30, margin: [0, 2, 0, 0] }, 
                { text: nome, style: { bold: false }, margin: [0, 4, 0, 0], fontSize: 5 },
            ],
        };
        pdfMake.createPdf(docDefinition).open();
    }
    

   async function configSaida(entrada, id, veiculo,mensalista) {

   

        setEntrada(entrada)
        setId(id)
        var saida = new Date().toLocaleString('pt-BR');
        setSaida(saida)

        var ms = moment(saida, "DD/MM/YYYY HH:mm:ss").diff(moment(entrada, "DD/MM/YYYY HH:mm:ss"));
        var d = moment.duration(ms);
        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        setPermanencia(s)
        var dateSplit = s.split(":");
        var horas = dateSplit[0];
        var minutos = dateSplit[1];

        const token = window.localStorage.getItem('x-access-token');

        axios({
            method: 'get',
            url: 'http://localhost:3301/configuracoes',
            headers: {
                'x-access-token': token
            }
        }).then((res) => {

            if (veiculo === "Carro") {

                if (horas >= 1) {
                    setValor(parseFloat(res.data.carro.ate1hr) + parseFloat(res.data.carro.adc1hr) * (horas))
                } else if (horas < 1 && minutos > 30) {
                    setValor(res.data.carro.ate1hr);
                } else if (minutos < 30 && minutos > 15) {
                    setValor(res.data.carro.ate30min);
                } else {
                    setValor(res.data.carro.ate15min);
                }

            }

            if (veiculo === "Moto") {

                if (horas >= 1) {
                    setValor(parseFloat(res.data.moto.ate1hr) + parseFloat(res.data.moto.adc1hr) * (horas))
                } else if (horas < 1 && minutos > 30) {
                    setValor(res.data.moto.ate1hr);
                } else if (minutos < 30 && minutos > 15) {
                    setValor(res.data.moto.ate30min);
                } else {
                    setValor(res.data.moto.ate15min);
                }

            }

            if (veiculo === "Caminhonete") {

                if (horas >= 1) {
                    setValor(parseFloat(res.data.caminhonete.ate1hr) + parseFloat(res.data.caminhonete.adc1hr) * (horas))
                } else if (horas < 1 && minutos > 30) {
                    setValor(res.data.caminhonete.ate1hr);
                } else if (minutos < 30 && minutos > 15) {
                    setValor(res.data.caminhonete.ate30min);
                } else {
                    setValor(res.data.caminhonete.ate15min);
                }

            }

        }).catch((err)=>{
            const erro = err.response.data.error;

            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
        })

    }

    function handleSalvar(){

        const token = window.localStorage.getItem('x-access-token');

        axios({
            method: 'put',
            url: 'http://localhost:3301/cliente',
            headers: {
                'x-access-token': token
            },
            data: {
                id: id,
                saida: saida,
                pagamento: pagamento,
                valor: valor
            }
        }).then(()=>{
            return Swal.fire("Salvo com sucesso !", '', 'success')


        }).catch((err)=>{
            console.log(err)
            const erro = err.response.data.error;

            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
            return Swal.fire("Erro ao salvar dados, por favor tente novamente !", '', 'error')
        })

        getClientes();


    }

    useEffect(() => {
        getClientes();
    }, [])

    useEffect(()=>{

        var filtrado = clientes.filter(function(obj) { return obj._id.includes(busca)});
        if(filtrado.length === 0){
            getClientes()
        }else{
            setClientes(filtrado)        
        }
    },[busca])

    return (
        <div>
            <NavBar />
            <div className="container">

                <div className="row">
                    <div className="col-3 p-3">
                        <div className="form-floating">
                            <input type="text" className="form-control" id="floatingInput" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                            <label for="floatingInput">Placa</label>
                        </div>
                    </div>
                    <div className="col-3 p-4">
                        <select className="form-select" aria-label="Default select example" onChange={(e) => setVeiculo(e.target.value)}>
                            <option selected value="Carro">Carro</option>
                            <option value="Moto">Moto</option>
                            <option value="Caminhonete">Caminhonete</option>
                        </select>
                    </div>

                    <div className="col-3 p-4">
                        <button className="btn btn-primary" onClick={handleRegistrar}>Registrar</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping"><i className="bi bi-search"></i></span>
                            <input type="text" className="form-control" placeholder="Pesquisar" aria-label="Pesquisar" aria-describedby="addon-wrapping" onChange={(e)=> setBusca(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <table className="table" id="dados">
                            <thead>
                                <tr>
                                    <th scope="col">Ticket</th>
                                    <th scope="col">Placa</th>
                                    <th scope="col">Veiculo</th>
                                    <th scope="col">Entrada</th>
                                    <th scope="col">Mensalista</th>
                                    <th>Controle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((item) => (
                                    <tr key={item._id}>
                                        <th>{item._id}</th>
                                        <td>{item.placa}</td>
                                        <td>{item.veiculo}</td>
                                        <td>{item.entrada}</td>
                                        <td>{item.mensalista}</td>
                                        <td><button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => configSaida(item.entrada, item._id, item.veiculo)}>Registrar Saída</button> <button className="btn btn-success" onClick={() => handleImprimirA4(item._id, item.entrada, item.placa,item.mensalista)}>Imprimir A4</button> <button className="btn btn-success" onClick={() => handleImprimirEtiqueta(item._id, item.entrada, item.placa,)} >Imprimir 151x176</button></td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Saída</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-5">
                                    Entrada: {entrada}
                                </div>
                                <div className="col-5">
                                    Saída: {saida}
                                </div>
                                <div className="col-5">
                                    Permanência: {permanencia}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-1 p-3">

                                    Valor:

                                </div>
                                <div className="col-3 p-3">
                                    <input type="number" className="form-control" value={valor} onChange={(e) => setValor(e.target.value)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col p-3">
                                    <select class="form-select" aria-label="Default select example" onChange={(e) => setPagamento(e.target.value)}>
                                        <option value="Dinheiro">Dinheiro</option>
                                        <option value="Débito">Débito</option>
                                        <option value="Crédito">Crédito</option>
                                        <option value="Pix">Pix</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSalvar}>Salvar</button> <button className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}



export default Entrada;