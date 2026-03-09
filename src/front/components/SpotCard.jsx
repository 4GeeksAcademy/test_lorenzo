
export const SpotCard = ({spot}) => {

    console.log(spot);
    
    return (
        <>
           <div className="card flex-shrink-0 shadow-sm" style={{ width: "300px", margin: "10px" }}>
            <div className="card-body">
                <h5 className="card-title text-truncate">{spot.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{spot.city}</h6>
                <div className="d-flex justify-content-between">
                    <span className="badge text-bg-success">{spot.category}</span>
                    <span className="badge text-bg-warning">★ {spot.rating}</span>
                </div>
            </div>
        </div>
        </>
    )
}