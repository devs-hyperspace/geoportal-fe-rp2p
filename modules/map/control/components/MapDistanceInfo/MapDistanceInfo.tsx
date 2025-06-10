import React from "react"

export const MapDistanceInfo:React.FC<{ distance:string }> = (props) => {
    return (
        <React.Fragment>
            {props.distance && (
                <div className="p-2 rounded-md bg-white">
                    <span className="text-sm text-primary">{props.distance}</span>
                </div>
            )}
        </React.Fragment>
    )
}