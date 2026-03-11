
// export const OffcanvasUser = ({id}) => {

//     const {id} = useParams()
//     return (
//         <>
//             <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasUser" aria-labelledby="offcanvasRightLabel">
//                 <div className="offcanvas-header">
//                     <h5 className="offcanvas-title" id="offcanvasRightLabel">Profile</h5>
//                     <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//                 </div>
//                 <div className="offcanvas-body">
//                     <ul className="list-group list-group-flush">
//                         <li
//                             className="list-group-item"
//                             role="button"
//                             data-bs-toggle="modal"
//                             data-bs-target="#userSettingsModal"
//                             data-bs-dismiss="offcanvas"
//                         >
//                             <i className="fa-solid fa-user-gear me-2"></i> Editar Perfil
//                         </li>
//                         <li className="list-group-item">Lugares Favoritos</li>
//                         <li className="list-group-item">Reservas</li>
//                     </ul>
//                 </div>
//             </div>

//                         {/* ----------MODAL EDITAR PERFIL---------- */}

//             <div className="modal fade" id="userSettingsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//                 <div className="modal-dialog modal-dialog-centered">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="staticBackdropLabel">Información de Usuario</h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <div className="modal-body">
//                             Editar Info
//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
//                             <button type="button" className="btn btn-primary">Guardar Cambios</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }