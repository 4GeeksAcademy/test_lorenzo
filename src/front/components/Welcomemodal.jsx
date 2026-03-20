import { useEffect, useState } from "react";
import { editProfile } from "../services/loginServices";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const WelcomeModal = ({ show, onClose }) => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const isEditing = !!store.user?.user_name;

    useEffect(() => {
        if (show) {
            setUsername(store.user?.user_name || "");
            setName(store.user?.name || "");
            setLastName(store.user?.last_name || "");
            setPhone(store.user?.phone || "");
            setAddress(store.user?.address || "");
            setError("");
            setSaving(false);
        }
    }, [show, store.user]);

    const handleSave = async () => {
        setError("");
        if (!username.trim()) {
            setError("Por favor elije un nombre de usuario.");
            return;
        }
        setSaving(true);
        const response = await editProfile({
            user_name: username.trim(),
            name: name.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            address: address.trim()
        });

        if (response.error) {
            setError(response.error);
            setSaving(false);
            return;
        }
        dispatch({ type: "auth_set_user", payload: response });
        onClose();
        navigate("/user");
    };

    const handleClose = () => {
        if (!store.token) {
            dispatch({ type: "auth_logout" });
        }
        onClose();
    };
    if (!show) return null;

    const inputStyle = { borderColor: "#c8e6c9", backgroundColor: "#fafffe" };
    const iconSpanStyle = { background: "#f0f7f2", borderColor: "#c8e6c9", color: "#2d6a4f" };
    const labelStyle = { fontSize: "0.875rem", fontWeight: 600, color: "#1b2e22", marginBottom: "0.4rem" };

    return (
        <>
            <div
                onClick={handleClose}
                style={{
                    position: "fixed", top: 0, left: 0,
                    width: "100vw", height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 99998
                }}
            />
            <div style={{
                position: "fixed",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 99999,
                width: "90%", maxWidth: "460px",
                maxHeight: "90vh", overflowY: "auto",
                background: "rgba(255,255,255,0.97)",
                borderRadius: "20px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                padding: "2.5rem 2rem"
            }}>
                <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1b2e22", marginBottom: "0.25rem" }}>
                        <i className={`fa-solid ${isEditing ? "fa-pen-to-square" : "fa-van-shuttle"} me-2 text-success`}></i>
                        {isEditing ? "Editar tu perfil" : "Crea tu perfil"}
                    </div>
                    <p style={{ color: "#6c757d", fontSize: "0.9rem", margin: 0 }}>
                        {isEditing ? "Actualiza tus datos" : "Únete a la comunidad camper"}
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 small mb-3">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>
                        {error}
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label" style={labelStyle}>
                        Nombre de usuario <span style={{ color: "#e63946" }}>*</span>
                    </label>
                    <div className="input-group">
                        <span className="input-group-text" style={iconSpanStyle}>
                            <i className="fa-solid fa-at"></i>
                        </span>
                        <input type="text" className="form-control" value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="ej: camper_aventurero"
                            style={inputStyle} />
                    </div>
                </div>
                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <label className="form-label" style={labelStyle}>Nombre</label>
                        <input type="text" className="form-control" value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Tu nombre" style={inputStyle} />
                    </div>
                    <div className="col-6">
                        <label className="form-label" style={labelStyle}>Apellido</label>
                        <input type="text" className="form-control" value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Tu apellido" style={inputStyle} />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label" style={labelStyle}>Teléfono</label>
                    <div className="input-group">
                        <span className="input-group-text" style={iconSpanStyle}>
                            <i className="fa-solid fa-phone"></i>
                        </span>
                        <input type="number" className="form-control" value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="Tu teléfono" style={inputStyle} />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="form-label" style={labelStyle}>Dirección</label>
                    <div className="input-group">
                        <span className="input-group-text" style={iconSpanStyle}>
                            <i className="fa-solid fa-house"></i>
                        </span>
                        <input type="text" className="form-control" value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Tu dirección" style={inputStyle} />
                    </div>
                </div>
                <button
                    className="btn w-100"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        background: "#2d6a4f", color: "#fff",
                        borderRadius: "999px", padding: "0.65rem",
                        fontWeight: 600, fontSize: "1rem", border: "none",
                        marginBottom: "0.75rem"
                    }}
                >
                    {saving ? (
                        <span className="d-inline-flex align-items-center gap-2">
                            <span className="spinner-border spinner-border-sm"></span>
                            Guardando...
                        </span>
                    ) : (
                        <>
                            <i className={`fa-solid ${isEditing ? "fa-floppy-disk" : "fa-right-to-bracket"} me-2`}></i>
                            {isEditing ? "Guardar cambios" : "Guardar y entrar"}
                        </>
                    )}
                </button>
                <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#6c757d" }}>
                    <button
                        onClick={handleClose}
                        style={{ background: "none", border: "none", color: "#2d6a4f", fontWeight: 600, cursor: "pointer" }}
                    >
                        {isEditing ? "Cancelar" : "Cerrar sesión"}
                    </button>
                </div>

            </div>
        </>
    );
};