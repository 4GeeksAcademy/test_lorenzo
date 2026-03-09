import { useEffect } from "react"
import { SpotCard } from "../components/SpotCard"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { SpotData } from "../services/spotServices"


export const UserPage = () => {

    const { store, dispatch } = useGlobalReducer()
    const campings = store.spot.filter(spot => spot.category === "campground");
    const parking = store.spot.filter(spot => spot.category === "parking")
    const aguasGrises = store.spot.filter(spot => spot.category === "water_waste")

    useEffect(() => {
        SpotData(dispatch)
    }, [])

    return (
        <>
            {/* <div className="d-flex overflow-scroll pb-2" style={{ gap: "3rem" }}>                {store.spot && store.spot.map((spot) => {
                return (
                    <SpotCard spot={spot} key={spot.id || spot.spot_id} />
                )
            })}
            </div> */}
            
            <div className="container">

                <h2 className="mb-3">Campings</h2>
                <div className="d-flex flex-row flex-nowrap overflow-x-auto pb-4 gap-3 mb-5">
                    {campings.map(spot => <SpotCard spot={spot} key={spot.id} />)}
                </div>

                <h2 className="mb-3">Parking</h2>
                <div className="d-flex flex-row flex-nowrap overflow-x-auto pb-4 gap-3 mb-5">
                    {parking.map(spot => <SpotCard spot={spot} key={spot.id} />)}
                </div>

                <h2 className="mb-3">Vaciado de Aguas</h2>
                <div className="d-flex flex-row flex-nowrap overflow-x-auto pb-4 gap-3 mb-5">
                    {aguasGrises.map(spot => <SpotCard spot={spot} key={spot.id} />)}
                </div>
            </div>
        </>
    )
}