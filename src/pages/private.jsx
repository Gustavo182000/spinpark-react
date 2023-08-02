import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from 'axios';

function Private({ children }) {

    const [loading, setLoading] = useState(true);
    const [logado, setLogado] = useState(false);

    async function ckeckLogin() {
        const token = window.localStorage.getItem('x-access-token');

        axios({
            method: 'post',
            url: 'http://localhost:3301/verifyjwt',
           headers:{
            'x-access-token': token
           }

          }).then(()=>{
            setLoading(false)
            setLogado(true)
          }).catch((err)=>{
            console.log(err)
            setLoading(false)
            setLogado(false)
          })

    }

    useEffect(() => {
        ckeckLogin();
    }, [])

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (!logado) {
        return <Navigate to='/login' />
    }

    return children
}


export default Private;