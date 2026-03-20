import { Link } from "react-router-dom";

export const VanCard = ({ van }) => {

  return (
    <>
      <Link to={`/vans/${van.car_id}`} className="text-decoration-none text-dark">
        <div className="card h-100 shadow border-0 rounded">
            <div
              id={`carousel-${van.car_id}`}
              className="carousel slide"
              data-bs-ride="false"
            >
              <div className="carousel-inner">
                {van.media && van.media.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      src={item.url_vehicle}
                      className="d-block w-100 rounded-top"
                      style={{ height: "250px", objectFit: "cover" }}
                      alt={van.model}
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-${van.car_id}`}
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${van.car_id}`}
                data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>

          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="text-success fw-bold text-uppercase mb-1">{van.brand}</h6>
                <h5 className="card-title fw-bold">{van.model}</h5>
              </div>
            </div>
            <p className="card-text mt-2 text-muted">
              Desde <span className="fw-bold text-dark">{van.price_per_day}€</span> / día
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};