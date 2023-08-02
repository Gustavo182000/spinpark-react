import NavBar from "./navbar";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from 'sweetalert2'

function CadastroMensalista() {

    const [cpfcnpj, setCpfCnpj] = useState("");
    const [nome, setNome] = useState("");
    const [cep, setCep] = useState("");
    const [placa, setPlaca] = useState("");
    const [veiculo, setVeiculo] = useState("Carro");
    const [endereco, setEndereco] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [uf, setUf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [celular, setCelular] = useState("");
    const [email, setEmail] = useState("");
    const [valorplano, setValorPlano] = useState("");
    const [observacao, setObservacao] = useState("");

    const navigate = useNavigate();

    function handleSalvar() {


        const token = window.localStorage.getItem('x-access-token');


        axios({
            method: 'post',
            url: 'http://localhost:3301/mensalista',
            headers: {

                'x-access-token': token
            },
            data: {
                cpfcnpj: cpfcnpj,
                nome: nome,
                cep: cep,
                endereco: endereco,
                bairro: bairro,
                cidade: cidade,
                uf: uf,
                telefone: telefone,
                celular: celular,
                email: email,
                valorplano: valorplano,
                observacao: observacao,
                placa: placa,
                veiculo: veiculo
            }
        }).then(() => {

            setCpfCnpj("");
            setNome("");
            setCep("");
            setEndereco("");
            setBairro("");
            setCidade("");
            setUf("");
            setTelefone("");
            setCelular("");
            setEmail("");
            setValorPlano("");
            setObservacao("");
            setPlaca("");
            setVeiculo("");

            return Swal.fire("Cadastrado com sucesso !", '', 'success')

        }).catch((err) => {
            const erro = err.response.data.error;
            if (erro === "error-data-empty") { return Swal.fire("Os campos obrigatórios não podem ficar vazios !", '', 'error') }
            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
        })
    }

    return (
        <div>
            <NavBar />

            <div class="container">
                <div className="row">
                    <div className="col">
                        CPF/CNPJ: <span className="text-danger">*</span> <input type="text" className="form-control" value={cpfcnpj} onChange={(e) => setCpfCnpj(e.target.value)} />
                    </div>
                    <div className="col">
                        Nome: <span className="text-danger">*</span> <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="col">
                        CEP:  <input type="text" className="form-control" value={cep} onChange={(e) => setCep(e.target.value)} />
                    </div>
                    <div className="col-2">
                        Placa:  <span className="text-danger">*</span><input type="text" className="form-control" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                    </div>
                   
                    <div className="col-2">
                    Veiculo: <span className="text-danger">*</span>
                        <select className="form-select" aria-label="Default select example" onChange={(e) => setVeiculo(e.target.value)}>
                            <option selected value="Carro">Carro</option>
                            <option value="Moto">Moto</option>
                            <option value="Caminhonete">Caminhonete</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        Endereço: <span className="text-danger">*</span> <input type="text" className="form-control" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                    </div>
                    <div className="col">
                        Bairro: <span className="text-danger">*</span><input type="text" className="form-control" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                    </div>
                    <div className="col">
                        Cidade: <span className="text-danger">*</span><input type="text" className="form-control" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                    </div>
                    <div className="col-1">
                        UF: <span className="text-danger">*</span><input type="text" className="form-control" value={uf} onChange={(e) => setUf(e.target.value)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        Telefone: <input type="text" className="form-control" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    </div>
                    <div className="col">
                        Celular: <span className="text-danger">*</span><input type="text" className="form-control" value={celular} onChange={(e) => setCelular(e.target.value)} />
                    </div>
                    <div className="col">
                        E-mail: <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="col-2">
                        Valor do Plano: <span className="text-danger">*</span><input type="number" className="form-control" value={valorplano} onChange={(e) => setValorPlano(e.target.value)} />
                    </div>
                </div>
                <div className="row">

                    <dir className="col">
                        Observação:
                    </dir>
                </div>
                <div className="row">
                    <div className="col">
                        <textarea name="" id="" cols="140" rows="8" className="form-control" value={observacao} onChange={(e) => setObservacao(e.target.value)}></textarea>
                    </div>
                </div>
                <div className="row p-2">
                    <button className="btn btn-primary" onClick={handleSalvar}>Cadastrar</button>
                </div>
            </div>

        </div>
    )
}



export default CadastroMensalista;