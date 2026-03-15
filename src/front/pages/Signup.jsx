import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { signUp } from "../services/BackEndService.js";
import { useNavigate } from "react-router-dom";

export const Signup = () => {

    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 1. Validaciones locales (antes de llamar a la API)
        if (!user.email.trim() || !user.password.trim() || !user.confirmPassword.trim()) {
            setError("Por favor, completa todos los campos.");
            return;
        }
        if (user.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        if (user.password !== user.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true); // Bloqueamos el botón

        try {
            const response = await signUp(user);

            // 2. Manejo de errores controlados del Backend (ej: email ya existe)
            if (response.error) {
                setError(response.error);
                return; // Saltará al bloque 'finally' automáticamente
            }

            // 3. Éxito: Registro correcto
            if (response.token) {
                localStorage.setItem("token", response.token);
                dispatch({ type: "auth_login", payload: { token: response.token } });
                dispatch({ type: "auth_set_user", payload: response.user });
                navigate("/");
            } else {
                // Caso borde por si no viene token pero no hay error explícito
                navigate("/login");
            }

        } catch (err) {
            // 4. Manejo de errores de red o caídas del servidor
            console.error("Error en el registro:", err);
            setError("No se pudo conectar con el servidor. Inténtalo más tarde.");
        } finally {
            // 5. El "Seguro de vida": Pase lo que pase, el botón se libera aquí
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log(user)
    }, [user])


    return (
        <div className="container py-5" >
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-10 col-lg-5">
                    <h1 className="text-center">Crea tu perfil</h1>

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
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Confrimar contraseña</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-lock" />
                                </span>
                                <input type={showConfirmPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="••••••••"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    required>
                                </input>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowConfirmPassword((s) => !s)}>
                                    <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
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
                                    Creando...
                                </span>
                            ) : (
                                "Crear cuenta"
                            )}
                        </button>
                    </form>

                </div>

            </div>

        </div >
    );
}