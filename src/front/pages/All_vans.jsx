import { useEffect } from "react";
import { VanCard } from "../components/VanCard";
import useGlobalReducer from "../hooks/useGlobalReducer"
import { getAllVans } from "../services/vanServices";

export const All_vans = () => {

    const { store, dispatch } = useGlobalReducer()

    useEffect(() => {
        getAllVans(dispatch);
    }, [])

    return (
        <>
            <div className="bg-topo min-vh-100 py-5">
                <div className="container">
                    <div className="row mt-3 g-4">
                        {store.vans && store.vans.map((van) => (
                            <div className="col-12 col-md-6" key={van.car_id}>
                                <VanCard van={van} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}