import { Link } from "react-router-dom";

function NavBar() {
    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
                <div className="container-fluid">
                    <a href="/" className="navbar-brand">SpinPark</a>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" style={{ textDecoration: 'none' }}><a className="nav-link" href="#"><i class="bi bi-house-door-fill"></i> Início</a></Link>
                        </li>
                        <li className="nav-item dropdown ">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"><i class="bi bi-file-earmark-person-fill"></i> Mensalistas</a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item "><Link to="/cadastromensalista" style={{ textDecoration: 'none' }}><i class="bi bi-person-fill-add"></i> Cadastrar</Link></a></li>
                                <li><a className="dropdown-item "><Link to="/verificarmensalista" style={{ textDecoration: 'none' }}><i class="bi bi-file-earmark-person-fill"></i> Verificar</Link></a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown ">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"><i class="bi bi-car-front-fill"></i> Rotativo</a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item "><Link to="/entrada" style={{ textDecoration: 'none' }}><i class="bi bi-journal-arrow-down"></i> Registrar Entrada / Saída</Link></a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link to="/historico" style={{ textDecoration: 'none' }}><a className="nav-link" href="#"><i class="bi bi-book"></i> Histórico</a></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/configuracao" style={{ textDecoration: 'none' }}><a className="nav-link" href="#"><i class="bi bi-gear-fill"></i> Configuração</a></Link>
                        </li>


                    </ul>

                </div>
            </nav>
        </div>
    )
}



export default NavBar;