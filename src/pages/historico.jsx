import NavBar from "./navbar";
import axios from 'axios';
import Swal from 'sweetalert2'
import { useEffect, useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useNavigate } from "react-router-dom";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Historico() {

    var JsBarcode = require('jsbarcode');
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(0, 0);


    const [clientes, setClientes] = useState([]);
    const [nome, setNome] = useState("");

    const [busca, setBusca] = useState("");
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
            var filtrado = res.data.filter(function(obj) { return obj.saida !== undefined; });
            setClientes(filtrado.reverse())


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
        }).catch((err) => {
            const erro = err.response.data.error;

            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
        })
    }
    function handleImprimirA4(id, entrada, placa,saida) {

        JsBarcode(canvas, id);


        var docDefinition = {
            //pageSize: {width: 151, height: 176},
            content: [
                { text: `TICKET ${id}`, style: { bold: true }, margin: [110, 0, 0, 0], fontSize: 20 },
                { text: `ENTRADA: ${entrada} `, style: { bold: false }, margin: [170, 20, 0, 0] },
                { text: `SAIDA: ${saida} `, style: { bold: false }, margin: [170, 0, 0, 0] },
                { text: `PLACA:   ${placa} `, style: { bold: false }, margin: [170, 20, 0, 0] },
                { image: canvas.toDataURL(), width: 160, height: 80, margin: [190, 20, 0, 0] }, 
                { text: nome, style: { bold: false }, margin: [180, 20, 0, 0] },
            ],
        };
        pdfMake.createPdf(docDefinition).open();
    }
    function handleImprimirEtiqueta(id, entrada, placa, saida) {

        JsBarcode(canvas, id);

        var docDefinition = {
            pageSize: { width: 151, height: 176 },
            content: [
                { text: `TICKET ${id}`, style: { bold: true }, fontSize: 7 },
                { text: `ENTRADA: ${entrada} `, style: { bold: false }, margin: [0, 0, 0, 0], fontSize: 6 },
                { text: `SAIDA: ${saida} `, style: { bold: false }, margin: [0, 0, 0, 0], fontSize: 6 },
                { text: `PLACA:   ${placa} `, style: { bold: false }, margin: [0, 0, 0, 0], fontSize: 6 },
                { image: canvas.toDataURL(), width: 60, height: 30, margin: [0, 0, 0, 0] }, 
                { text: nome, style: { bold: false }, margin: [0, 0, 0, 0], fontSize: 5 },
            ],
        };
        pdfMake.createPdf(docDefinition).open();
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

                
                <div className="row p-3">
                    <div className="col">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping"><i className="bi bi-search"></i></span>
                            <input type="text" className="form-control" placeholder="Pesquisar" aria-label="Pesquisar" aria-describedby="addon-wrapping" onChange={(e)=> setBusca(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Ticket</th>
                                    <th scope="col">Placa</th>
                                    <th scope="col">Veiculo</th>
                                    <th scope="col">Entrada</th>
                                    <th scope="col">Saída</th>
                                    <th scope="col">Pagamento</th>
                                    <th scope="col">Valor</th>
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
                                        <td>{item.saida}</td>
                                        <td>{item.pagamentotipo}</td>
                                        <td>{item.valor}</td>
                                        <td> <button className="btn btn-success" onClick={() => handleImprimirA4(item._id, item.entrada, item.placa,item.saida)}>Imprimir A4</button> <button className="btn btn-success" onClick={() => handleImprimirEtiqueta(item._id, item.entrada, item.placa,item.saida)} >Imprimir 151x176</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div >
    )
}



export default Historico;