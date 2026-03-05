import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const VanCard = ({ van }) => {

  const { store, dispatch } = useGlobalReducer()

  const fav_van = () => {
    dispatch({ type: 'fav_van', payload: van })
  }

  return (
    <>
      <div className="container">
        <div className="card mb-3" >
          <div className="row g-0">
            <div className="d-flex">
              <div id={`carousel-${van.car_id}`} className="carousel" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {van.media && van.media.map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <img
                        src={item.url_vehicle}
                        className="d-block w-100" 
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${van.car_id}`} data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${van.car_id}`} data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </div>
              <div className="card-body">
                <h5 className="card-title text-uppercase">{van.brand}</h5>
                <p className="card-text">Model {van.model}</p>
                <p className="card-text">Price {van.price_per_day}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};