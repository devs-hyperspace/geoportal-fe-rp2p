"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-map-gl";
import * as turf from "@turf/turf";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { SharedComponentButtonTooltip } from "@/shared/components/SharedComponentButtonTooltip";
import { PencilRuler, Spline, SquareDashedBottom, SquareDashedMousePointer, SquareMousePointer, Trash2 } from "lucide-react";
import { GeoJSONSource } from "maplibre-gl";

interface MapControlMeasureProps {
    setMeasurement: (value: string) => void;
    active: boolean;
    onClick: () => void;
    disabled: boolean;
}

export const MapControlMeasure: React.FC<MapControlMeasureProps> = ({
    setMeasurement,
    active,
    onClick,
    disabled,
}) => {
    const map = useMap();
    const mapCurrent = map.current?.getMap();
    const draw = useRef<MapboxDraw | null>(null);
    const [measurementValue, setMeasurementValue] = useState("");
    const [drawMode, setDrawMode] = useState<"line" | "polygon" | null>(null); // Track current drawing mode

    const geojson = useRef<any>({
        type: "FeatureCollection",
        features: [],
    });

    const linestring = useRef<any>({
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [],
        },
    });

    useEffect(() => {
        if (!mapCurrent) return;

        if (active) {
            mapCurrent.getCanvas().style.cursor = "pointer"; // Set cursor to crosshair when drawing
        } else {
            mapCurrent.getCanvas().style.cursor = "grab"; // Reset cursor when inactive
        }

        if (active) {
            if (!draw.current) {
                draw.current = new MapboxDraw({
                    displayControlsDefault: false,
                    styles: [
                        {
                            'id': 'gl-draw-polygon-fill-inactive',
                            'type': 'fill',
                            'filter': ['all', ['==', 'active', 'false'],
                                ['==', '$type', 'Polygon'],
                                ['!=', 'mode', 'static']
                            ],
                            'paint': {
                                'fill-color': '#3bb2d0',
                                'fill-outline-color': '#3bb2d0',
                                'fill-opacity': 0.1
                            }
                        },
                        {
                            'id': 'gl-draw-polygon-fill-active',
                            'type': 'fill',
                            'filter': ['all', ['==', 'active', 'true'],
                                ['==', '$type', 'Polygon']
                            ],
                            'paint': {
                                'fill-color': '#fbb03b',
                                'fill-outline-color': '#fbb03b',
                                'fill-opacity': 0.1
                            }
                        },
                        {
                            'id': 'gl-draw-polygon-midpoint',
                            'type': 'circle',
                            'filter': ['all', ['==', '$type', 'Point'],
                                ['==', 'meta', 'midpoint']
                            ],
                            'paint': {
                                'circle-radius': 3,
                                'circle-color': '#fbb03b'
                            }
                        },
                        {
                            'id': 'gl-draw-polygon-stroke-inactive',
                            'type': 'line',
                            'filter': ['all', ['==', 'active', 'false'],
                                ['==', '$type', 'Polygon'],
                                ['!=', 'mode', 'static']
                            ],
                            'layout': {
                                'line-cap': 'round',
                                'line-join': 'round'
                            },
                            'paint': {
                                'line-color': '#3bb2d0',
                                'line-width': 2
                            }
                        },
                        {
                            'id': 'gl-draw-polygon-stroke-active',
                            'type': 'line',
                            'filter': ['all', ['==', 'active', 'true'],
                                ['==', '$type', 'Polygon']
                            ],
                            'layout': {
                                'line-cap': 'round',
                                'line-join': 'round'
                            },
                            'paint': {
                                'line-color': '#fbb03b',
                                'line-dasharray': [0.2, 2],
                                'line-width': 2
                            }
                        },
                        {
                            'id': 'gl-draw-line-inactive',
                            'type': 'line',
                            'filter': ['all', ['==', 'active', 'false'],
                                ['==', '$type', 'LineString'],
                                ['!=', 'mode', 'static']
                            ],
                            'layout': {
                                'line-cap': 'round',
                                'line-join': 'round'
                            },
                            'paint': {
                                'line-color': '#3bb2d0',
                                'line-width': 2
                            }
                        },
                        {
                            'id': 'gl-draw-line-active',
                            'type': 'line',
                            'filter': ['all', ['==', '$type', 'LineString'],
                                ['==', 'active', 'true']
                            ],
                            'layout': {
                                'line-cap': 'round',
                                'line-join': 'round'
                            },
                            'paint': {
                                'line-color': '#fbb03b',
                                'line-dasharray': [0.2, 2],
                                'line-width': 2
                            }
                        },
                        {
                            'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
                            'type': 'circle',
                            'filter': ['all', ['==', 'meta', 'vertex'],
                                ['==', '$type', 'Point'],
                                ['!=', 'mode', 'static']
                            ],
                            'paint': {
                                'circle-radius': 5,
                                'circle-color': '#fff'
                            }
                        },
                        {
                            'id': 'gl-draw-polygon-and-line-vertex-inactive',
                            'type': 'circle',
                            'filter': ['all', ['==', 'meta', 'vertex'],
                                ['==', '$type', 'Point'],
                                ['!=', 'mode', 'static']
                            ],
                            'paint': {
                                'circle-radius': 3,
                                'circle-color': '#fbb03b'
                            }
                        },
                        {
                            'id': 'gl-draw-point-point-stroke-inactive',
                            'type': 'circle',
                            'filter': ['all', ['==', 'active', 'false'],
                                ['==', '$type', 'Point'],
                                ['==', 'meta', 'feature'],
                                ['!=', 'mode', 'static']
                            ],
                            'paint': {
                                'circle-radius': 5,
                                'circle-opacity': 1,
                                'circle-color': '#fff'
                            }
                        },
                        {
                            'id': 'gl-draw-point-inactive',
                            'type': 'circle',
                            'filter': ['all', ['==', 'active', 'false'],
                                ['==', '$type', 'Point'],
                                ['==', 'meta', 'feature'],
                                ['!=', 'mode', 'static']
                            ],
                            'paint': {
                                'circle-radius': 3,
                                'circle-color': '#3bb2d0'
                            }
                        },
                        {
                            'id': 'gl-draw-point-stroke-active',
                            'type': 'circle',
                            'filter': ['all', ['==', '$type', 'Point'],
                                ['==', 'active', 'true'],
                                ['!=', 'meta', 'midpoint']
                            ],
                            'paint': {
                                'circle-radius': 7,
                                'circle-color': '#fff'
                            }
                        },
                        {
                            'id': 'gl-draw-point-active',
                            'type': 'circle',
                            'filter': ['all', ['==', '$type', 'Point'],
                                ['!=', 'meta', 'midpoint'],
                                ['==', 'active', 'true']
                            ],
                            'paint': {
                                'circle-radius': 5,
                                'circle-color': '#fbb03b'
                            }
                        },
                        {
                            'id': 'gl-draw-polygon-fill-static',
                            'type': 'fill',
                            'filter': ['all', ['==', 'mode', 'static'],
                                ['==', '$type', 'Polygon']
                            ],
                            'paint': {
                                'fill-color': '#404040',
                                'fill-outline-color': '#404040',
                                'fill-opacity': 0.1
                            }
                        },
                        {
                            'id': 'gl-draw-polygon-stroke-static',
                            'type': 'line',
                            'filter': ['all', ['==', 'mode', 'static'],
                                ['==', '$type', 'Polygon']
                            ],
                            'layout': {
                                'line-cap': 'round',
                                'line-join': 'round'
                            },
                            'paint': {
                                'line-color': '#404040',
                                'line-width': 2
                            }
                        },
                        {
                            'id': 'gl-draw-line-static',
                            'type': 'line',
                            'filter': ['all', ['==', 'mode', 'static'],
                                ['==', '$type', 'LineString']
                            ],
                            'layout': {
                                'line-cap': 'round',
                                'line-join': 'round'
                            },
                            'paint': {
                                'line-color': '#404040',
                                'line-width': 2
                            }
                        },
                        {
                            'id': 'gl-draw-point-static',
                            'type': 'circle',
                            'filter': ['all', ['==', 'mode', 'static'],
                                ['==', '$type', 'Point']
                            ],
                            'paint': {
                                'circle-radius': 5,
                                'circle-color': '#404040'
                            }
                        }
                    ]
                }
            );
            }

            if (!mapCurrent.hasControl(draw.current)) {
                mapCurrent.addControl(draw.current);
            }

            // Add GeoJSON source for line measurement
            if (!mapCurrent.getSource("measure-geojson")) {
                mapCurrent.addSource("measure-geojson", {
                    type: "geojson",
                    data: geojson.current,
                });
            }

            // Add measure layers for line measurement
            if (!mapCurrent.getLayer("measure-points")) {
                mapCurrent.addLayer({
                    id: "measure-points",
                    type: "circle",
                    source: "measure-geojson",
                    paint: {
                        "circle-radius": 5,
                        "circle-color": "#fbb03b",
                    },
                    filter: ["in", "$type", "Point"],
                });

                mapCurrent.addLayer({
                    id: "measure-lines",
                    type: "line",
                    source: "measure-geojson",
                    layout: {
                        "line-cap": "round",
                        "line-join": "round",
                    },
                    paint: {
                        "line-color": "#fbb03b",
                        "line-width": 2.5,
                        "line-dasharray": [0.5, 2.5],
                    },
                    filter: ["in", "$type", "LineString"],
                });
            }

            const handleClick = (e: any) => {
                if (drawMode === "line") {
                    const features = mapCurrent.queryRenderedFeatures(e.point, {
                        layers: ["measure-points"],
                    });
                    if (geojson.current.features.length > 1) geojson.current.features.pop();
                    setMeasurementValue("");

                    if (features.length) {
                        const id = features[0].properties?.id;
                        geojson.current.features = geojson.current.features.filter(
                            (point: { properties: { id: any } }) => point.properties.id !== id
                        );
                    } else {
                        const point = {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [e.lngLat.lng, e.lngLat.lat],
                            },
                            properties: {
                                id: String(new Date().getTime()),
                            },
                        };
                        geojson.current.features.push(point);
                    }

                    if (geojson.current.features.length > 1) {
                        linestring.current.geometry.coordinates = geojson.current.features.map(
                            (point: { geometry: { coordinates: any } }) => point.geometry.coordinates
                        );
                        geojson.current.features.push(linestring.current);
                        const totalDistance = turf.length(linestring.current, { units: "meters" }).toFixed(1);
                        setMeasurementValue(`Distance: ${Number(totalDistance).toLocaleString("en-US")} m`);
                    }

                    (mapCurrent.getSource("measure-geojson") as unknown as GeoJSONSource)?.setData(geojson.current);
                }
            };

            const updatePolygonMeasurement = () => {
                if (drawMode === "polygon") {
                    const data = draw.current?.getAll();
                    if (data && data.features.length > 0) {
                        const area = turf.area(data);
                        const formattedArea = `Area: ${Math.round(area).toLocaleString()} m²`;
                        setMeasurementValue(formattedArea);
                        setDrawMode(null)
                    } else {
                        setMeasurementValue("");
                        setDrawMode(null)
                    }
                }
            };
            mapCurrent.on("click", handleClick);
            mapCurrent.on("draw.create", updatePolygonMeasurement);
            mapCurrent.on("draw.update", updatePolygonMeasurement);
            mapCurrent.on("draw.delete", updatePolygonMeasurement);

            return () => {
                mapCurrent.off("click", handleClick);
                mapCurrent.off("draw.create", updatePolygonMeasurement);
                mapCurrent.off("draw.update", updatePolygonMeasurement);
                mapCurrent.off("draw.delete", updatePolygonMeasurement);
            };
        } else {
            if (draw.current) {
                mapCurrent.removeControl(draw.current);
            }
        }

        return () => {
            if (mapCurrent) {
                mapCurrent.getCanvas().style.cursor = "grab"; // Ensure reset on cleanup
            }
        };
    }, [mapCurrent, active, drawMode]);

    const startDraw = (mode: "line" | "polygon") => {
        setDrawMode(mode);
        if (mode === "polygon" && draw.current) {
            draw.current.changeMode("draw_polygon");
        } else if (mode === "line") {
            geojson.current.features = [];
            linestring.current.geometry.coordinates = [];
            setMeasurementValue("");
        }
    };


    const clearMeasurements = () => {
        geojson.current.features = [];
        linestring.current.geometry.coordinates = [];
        setMeasurementValue("");
        (mapCurrent?.getSource("measure-geojson") as unknown as GeoJSONSource)?.setData(geojson.current);
        draw.current?.deleteAll();
    };

    return (
        <div className="flex items-center space-x-2">

            {active && (
                <div className="flex space-x-1">
                     {measurementValue && (
                        <div className="shadow bg-white py-1 px-2 text-sm text-primary text-center font-bold rounded">
                            {measurementValue}
                        </div>
                    )}
                    <SharedComponentButtonTooltip
                        tooltipProps={{ side: "bottom", children: "Measure Distance" }}
                        style={{ width: 29, height: 29, padding: 0 }}
                        onClick={() => startDraw("line")}
                        disabled={disabled}
                    >
                        <Spline size={20} color={drawMode === "line" ? "#0088EA" : "currentColor"} />
                    </SharedComponentButtonTooltip>

                    <SharedComponentButtonTooltip
                        tooltipProps={{ side: "bottom", children: "Measure Area" }}
                        style={{ width: 29, height: 29, padding: 0 }}
                        onClick={() => startDraw("polygon")}
                        disabled={disabled}
                    >
                        <SquareDashedBottom size={20} color={drawMode === "polygon" ? "#0088EA" : "currentColor"} />
                    </SharedComponentButtonTooltip>

                    <SharedComponentButtonTooltip
                        tooltipProps={{ side: "bottom", children: "Clear Measurements" }}
                        style={{ width: 29, height: 29, padding: 0 }}
                        onClick={clearMeasurements}
                        disabled={measurementValue ? false : true}
                    >
                        <Trash2 size={20} />
                    </SharedComponentButtonTooltip>
                </div>
            )}
            <SharedComponentButtonTooltip
                tooltipProps={{ side: "right", children: "Measure Control" }}
                style={{ width: 29, height: 29, padding: 0 }}
                onClick={onClick}
                disabled={disabled}
            >
                <PencilRuler size={20} color={active ? "#0088EA" : "currentColor"} />
            </SharedComponentButtonTooltip>
        </div>
    );
};
