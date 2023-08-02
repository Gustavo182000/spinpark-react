import { Route, Routes } from "react-router-dom";
import CadastroMensalista from "../pages/cadastroMensalista";
import Configuracao from "../pages/configuracao";
import Entrada from "../pages/entrada";
import Historico from "../pages/historico";
import Home from "../pages/home";
import Login from "../pages/login";
import Private from "../pages/private";
import VerificarMensalistas from "../pages/verificarMensalistas";

function RoutesApp() {
    return (

        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Private><Home /></Private>} />
            <Route path="/entrada" element={<Private><Entrada /></Private>} />
            <Route path="/configuracao" element={<Private><Configuracao /></Private>} />
            <Route path="/historico" element={<Private><Historico /></Private>} />
            <Route path="/cadastromensalista" element={<Private><CadastroMensalista /></Private>} />
            <Route path="/verificarmensalista" element={<Private><VerificarMensalistas /></Private>} />

        </Routes>

    )
}


export default RoutesApp;