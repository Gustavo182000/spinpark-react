import NavBar from "./navbar";
import axios from 'axios';
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

function VerificarMensalistas() {

    const [id, setId] = useState("");
    const [dados, setDados] = useState([]);
    const [placa, setPlaca] = useState("");
    const [veiculo, setVeiculo] = useState("Carro");
    const [cpfcnpj, setCpfCnpj] = useState("");
    const [nome, setNome] = useState("");
    const [cep, setCep] = useState("");
    const [endereco, setEndereco] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [uf, setUf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [celular, setCelular] = useState("");
    const [email, setEmail] = useState("");
    const [valorplano, setValorPlano] = useState("");
    const [observacao, setObservacao] = useState("");

    const [clientes, setClientes] = useState([]);
    const [numvagas, setNumvagas] = useState(0);
    const [numvagasUso, setNumvagasUso] = useState(0);

    const [busca, setBusca] = useState("");
    const navigate = useNavigate();


    function handleSalvar() {

        const token = window.localStorage.getItem('x-access-token');
        axios({
            method: 'put',
            url: 'http://localhost:3301/mensalista',
            headers: {

                'x-access-token': token
            },
            data: {
                id: id,
                cpfcnpj: cpfcnpj,
                nome: nome,
                cep: cep,
                placa: placa,
                veiculo: veiculo,
                endereco: endereco,
                bairro: bairro,
                cidade: cidade,
                uf: uf,
                telefone: telefone,
                celular: celular,
                email: email,
                valorplano: valorplano,
                observacao: observacao
            }
        }).then(() => {
            setId("");
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
            handleGetAllDados()
            return Swal.fire("Atualizado com sucesso !", '', 'success')

        }).catch((err) => {
            const erro = err.response.data.error;
            if (erro === "error-data-empty") { return Swal.fire("Os campos obrigatórios não podem ficar vazios !", '', 'error') }
            if (erro === "updated-error") { return Swal.fire("Falha ao atualizar os dados, por favor tente novamente !", '', 'error') }

            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
        })
    }

    function handleGetAllDados() {
        const token = window.localStorage.getItem('x-access-token');

        axios({
            method: 'get',
            url: 'http://localhost:3301/mensalista',
            headers: {

                'x-access-token': token
            }
        }).then((res) => {
            console.log(res.data)
            setDados(res.data)
        }).catch((err) => {
            const erro = err.response.data.error;

            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }
            return Swal.fire("Falha ao buscar os dados, por favor tente novamente !", '', 'error')
        })
    }

    function handleGetDados(idEdit) {

        const token = window.localStorage.getItem('x-access-token');

        axios({
            method: 'get',
            url: `http://localhost:3301/mensalista/${idEdit}`,
            headers: {

                'x-access-token': token
            },

        }).then((res) => {
            console.log(res.data)

            setCpfCnpj(res.data.cpfcnpj);
            setNome(res.data.nome);
            setCep(res.data.cep);
            setPlaca(res.data.placa)
            setEndereco(res.data.endereco);
            setBairro(res.data.bairro);
            setCidade(res.data.cidade);
            setUf(res.data.uf);
            setTelefone(res.data.telefone);
            setCelular(res.data.celular);
            setEmail(res.data.email);
            setValorPlano(res.data.valorplano);
            setObservacao(res.data.observacao);
            setId(res.data._id)
            setVeiculo(res.data.veiculo)
        }).catch((err) => {
            const erro = err.response.data.error;

            if (erro === "failed-auth-token") {
                Swal.fire("Sua sessão expirou, realize o login novamente !", '', 'error')
                navigate('/login', { replace: true })
            }

        })
    }

    function handleRegistrar(itemplaca, itemveiculo) {

        const token = window.localStorage.getItem('x-access-token');
        getClientes();



        if (numvagas <= numvagasUso) {
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
                placa: itemplaca,
                veiculo: itemveiculo,
                mensalista: "Sim",
            }
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Veiculo Registrado !',
                text: 'Para impirmir o comprovante clique na aba rotativo e em imprimir na tabela.',
            })
            setPlaca("")
            getClientes();
            handleGetAllDados();
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
            var filtrado = res.data.filter(function (obj) { return obj.saida === undefined; });
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
            } console.log(err)
        })
    }
    useEffect(() => {
        handleGetAllDados();
        getClientes();
    }, [])
    useEffect(() => {

        var filtrado = dados.filter(function (obj) { return obj.cpfcnpj.includes(busca) });
        if (filtrado.length === 0) {
            handleGetAllDados()
        } else {
            setDados(filtrado)
        }
    }, [busca])

    return (
        <div>
            <NavBar />

            <div class="container">

                {id ?
                    <div>

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
                                <select className="form-select" aria-label="Default select example" value={veiculo} onChange={(e) => setVeiculo(e.target.value)}>
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
                            <button className="btn btn-primary" onClick={handleSalvar}>Salvar</button>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="row">
                            <div className="col">
                                <div className="input-group flex-nowrap">
                                    <span className="input-group-text" id="addon-wrapping"><i className="bi bi-search"></i></span>
                                    <input type="text" className="form-control" placeholder="Pesquisar CPF/CNPJ" aria-label="Pesquisar" aria-describedby="addon-wrapping" onChange={(e) => setBusca(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <table className="table" id="dados">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Nome</th>
                                            <th scope="col">Celular</th>
                                            <th scope="col">CPF/CNPJ</th>
                                            <th>Controle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dados.map((item) => (
                                            <tr key={item._id}>
                                                <th>{item._id}</th>
                                                <th>{item.nome}</th>
                                                <td>{item.celular}</td>
                                                <td>{item.cpfcnpj}</td>
                                                <td> <button className="btn btn-success" onClick={(e) => handleGetDados(item._id)}>Ver detalhes</button> <button className="btn btn-primary" onClick={(e) => handleRegistrar(item.placa, item.veiculo)}>Registrar entrada</button></td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }


            </div>




        </div>
    )
}



export default VerificarMensalistas;