import { useEffect, useState } from "react";
import { editProfile } from "../services/loginServices";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const WelcomeModal = ({
    show,
    onClose,
}) => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate()

    useEffect(() => {
        if (show) {
            setUsername("");
            setName("");
            setLastName("");
            setPhone("");
            setAddress("");
            setError("");
            setSaving(false);
        }
    }, [show]);
    if (!show) return null;

    const handleSave = async () => {
        setError("");
        const clean = username.trim();
        if (!clean) {
            setError("Por favor elija un nombre de usuario.");
            return;
        }
        setSaving(true);
        const response = await editProfile({ 
            user_name: username.trim(), 
            name: name.trim(), 
            last_name: lastName.trim(), 
            phone: phone.trim(), 
            address: address.trim()
        })

        if (response.error) {
            setError(response.error)
            setSaving(false)
            return
        }
        dispatch({ type: "auth_set_user", payload: response });
        onClose();
        navigate("/user");
        
    }
    const handleClose = () => {
        dispatch({ type: "auth_logout" })
        onClose();
    };

    return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark">
                <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">¡Bienvenido! Completa tu perfil</h5>
                </div>
                <div className="modal-body">
                    {error && <div className="alert alert-danger py-2 small">{error}</div>}
                    <form>
                        {/* user_name es obligatorio según tu lógica */}
                        <div className="mb-2">
                            <label className="form-label small fw-bold">Nombre de usuario *</label>
                            <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="pablo_vlogs"
                            />
                        </div>

                        <div className="row">
                            <div className="col-6 mb-2">
                                <label className="form-label small fw-bold">Nombre</label>
                                <input type="text" className="form-control form-control-sm" id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className="col-6 mb-2">
                                <label className="form-label small fw-bold">Apellido</label>
                                <input type="text" className="form-control form-control-sm" id="last_name"
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>

                        <div className="mb-2">
                            <label className="form-label small fw-bold">Teléfono</label>
                            <input type="number" className="form-control form-control-sm" id="phone" placeholder="600000000"
                            value={phone} 
                                onChange={(e) => setPhone(e.target.value)} />
                        </div>

                        <div className="mb-2">
                            <label className="form-label small fw-bold">Dirección</label>
                            <input type="text" className="form-control form-control-sm" id="address" placeholder="Calle Ejemplo, 123"
                            value={address} 
                                onChange={(e) => setAddress(e.target.value)} />
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleClose}>
                        Cerrar sesión
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-sm btn-primary" 
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <span className="spinner-border spinner-border-sm me-1"></span>
                        ) : "Guardar y entrar"}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

};

