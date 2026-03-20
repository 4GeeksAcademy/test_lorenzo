import { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { signUp } from "../services/signupService.js";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

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

        setLoading(true); 

        try {
            const response = await signUp(user);

            if (response.error) {
                setError(response.error);
                return; 
            }

            if (response.token) {
                localStorage.setItem("token", response.token);
                dispatch({ type: "auth_login", payload: { token: response.token } });
                dispatch({ type: "auth_set_user", payload: response.user });
                navigate("/");
            } else {
                navigate("/login");
            }

        } catch (err) {
            console.error("Error en el registro:", err);
            setError("No se pudo conectar con el servidor. Inténtalo más tarde.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log(user)
    }, [user])


    return (
<div className="signup-page">
            <div className="signup-card">
                <h1 className="signup-title">
                    <i className="fa-solid fa-van-shuttle me-2 text-success"></i>
                    Crea tu perfil
                </h1>
                <p className="signup-subtitle">Únete a la comunidad camper</p>

                {error && (
                    <div className="alert alert-danger py-2 small" role="alert">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label signup-label">Correo electrónico</label>
                        <div className="input-group signup-input-group">
                            <span className="input-group-text">
                                <i className="fa-solid fa-envelope"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <div className="signup-help-text mt-1">
                            Nunca compartiremos tu correo con nadie más.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label signup-label">Contraseña</label>
                        <div className="input-group signup-input-group">
                            <span className="input-group-text">
                                <i className="fa-solid fa-lock" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="••••••••"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(s => !s)}
                            >
                                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label signup-label">Confirmar contraseña</label>
                        <div className="input-group signup-input-group">
                            <span className="input-group-text">
                                <i className="fa-solid fa-lock" />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="••••••••"
                                name="confirmPassword"
                                value={user.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowConfirmPassword(s => !s)}
                            >
                                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-success w-100 signup-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="d-inline-flex align-items-center gap-2">
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Creando cuenta...
                            </span>
                        ) : (
                            <>
                                <i className="fa-solid fa-user-plus me-2"></i>
                                Crear cuenta
                            </>
                        )}
                    </button>

                </form>
                <div className="signup-login-link">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </div>

            </div>
        </div>
    );
}