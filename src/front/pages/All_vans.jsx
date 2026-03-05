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
            <div className="overflow-auto">
                {store.vans && store.vans.map((van) => {
                    return (
                        <VanCard van={van} key={van.car_id} />
                    )
                })}
            </div>
        </>
    )
}