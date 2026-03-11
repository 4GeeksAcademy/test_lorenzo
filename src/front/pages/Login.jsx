import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { login} from "../services/loginServices.js";
import { useNavigate } from "react-router-dom";
import { WelcomeModal } from "../components/Welcomemodal.jsx";


export const Login = () => {

    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!user.email.trim() || !user.password.trim()) {
            setError("Por favor, completa todos los campos.");
            return;
        }
        
        setLoading(true);

        const response = await login(user)
        if (response.error) {
            setError(response.error);
            setLoading(false);
            return;
        }

        localStorage.setItem("token", response.token);
        dispatch({ type: "auth_login", payload: { token: response.token } });
        
        const hasUserName = response.user?.user_name
        

        if (!hasUserName){
            setShowWelcomeModal(true);
            setLoading(false);
            return
        }
        dispatch({type: "auth_set_user", payload:response.user});

        navigate("/")

    } 

    useEffect(() => {
        console.log(user)
    }, [user])


    return (
        <div className="container py-5" >
            {showWelcomeModal &&
            <WelcomeModal show={showWelcomeModal} onClose={()=> setShowWelcomeModal(false)}/>
             }
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-10 col-lg-5">
                    <h1 className="text-center">Ingresa a tu cuenta</h1>

                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Correo electronico</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-envelope"></i>
                                </span>
                                <input type="email" className="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    required>
                                </input>
                            </div>
                            <div id="emailHelp" className="form-text">Nunca compartiremos tu correo electrónico con nadie más.</div>

                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-lock" />
                                </span>
                                <input type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="••••••••"
                                    id="exampleInputPassword1"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    required>
                                </input>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword((s) => !s)}>
                                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="d-inline-flex align-items-center gap-2">
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Ingresando..
                                </span>
                            ) : (
                                "Ingresar a tu cuenta"
                            )}
                        </button>
                    </form>

                </div>

            </div>

        </div >
    );
}