import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2'


function Login() {

    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");


    function handleLogin(e) {
        e.preventDefault();

        axios({
            method: 'post',
            url: 'http://localhost:3301/login',
            data: {
                login: login,
                senha: senha
            }
        }).then((res) => {
            window.localStorage.setItem('x-access-token', res.data.token)
            navigate('/', { replace: true })
        }).catch((err) => {
            const erro = err.response.data.error;
            console.log(err.response.data.error)

            if (erro === "login-password-not-match") { return Swal.fire("Login e senha não conferem !", '', 'error') }
            if (erro === "login-password-is-empty") { return Swal.fire("Login e senha estão vazios !", '', 'error') }
            if (erro === "user-not-exist") { return Swal.fire("Usuário não existe !", '', 'error') }
            return Swal.fire("Erro desconhecido, tente novamente !", '', 'error')

        })

    }

    return (
        <div>
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-8 col-lg-7 col-xl-6">
                            <img src="https://img.freepik.com/vetores-gratis/pelo-meu-conceito-de-ilustracao-de-carro_114360-831.jpg?w=826&t=st=1674746251~exp=1674746851~hmac=fb26deb4e79c3926ff567085abce7b99185135918e983752c739c7bd6ed21ac2" className="img-fluid" alt="Phone image" />
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <form>
                                <div className="form-outline mb-4">
                                    <input type="text" id="usuario" className="form-control form-control-lg" placeholder="Usuário" value={login} onChange={(e) => setLogin(e.target.value)} />
                                </div>
                                <div className="form-outline mb-4">
                                    <input type="password" id="password" className="form-control form-control-lg" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg btn-block" onClick={handleLogin}>Entrar</button>
                                <hr />
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}



export default Login;