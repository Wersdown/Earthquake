export type GoogleMapType = "terrain" | "roadmap" | "satellite" | "hybrid";
export type MapType = "circle" | "heat" | "point";

export interface SelectValue {
    icon: string,
    title: string,
    value: string,
    clickEvent?: () => void
}

export interface MapFeature {
    type: "Feature",
    properties: {
        mag: number,
        place: string,
        time: string,
        updated: number,
        tz: any,
        url: string,
        detail: string,
        felt: number,
        cdi: number,
        mmi: any,
        alert: any,
        status: "reviewed",
        tsunami: number,
        sig: number,
        net: "us",
        code: string,
        ids: string,
        sources: string,
        types: string,
        nst: number,
        dmin: number,
        rms: number,
        gap: number,
        magType: string,
        type: "earthquake",
        title: string
    },
    geometry: {
        type: "Point",
        coordinates: [number, number, number]
    },
    id: string
}

export interface EarthquakeResponse {
    status: boolean,
    httpStatus: number,
    serverloadms: number,
    desc: string,
    result: Array<EarthquakeData>
}

export interface EarthquakeData {
    earthquake_id: string,
    title: string,
    date: string,
    mag: number,
    depth: number,
    geojson: {
        type: string,
        coordinates: [number, number]
    },
    location_properties: {
        closestCity: {
            name: string
        },
        epiCenter: {
            name: string
        },
        airports: [{
            distance: number,
            name: string,
            code: string,
            coordinates: {
                type: string,
                coordinates: [number, number]
            }
        }, {
            distance: number,
            name: string,
            code: string,
            coordinates: {
                type: string,
                coordinates: [number, number]
            }
        }, {
            distance: number,
            name: string,
            code: string,
            coordinates: {
                type: string,
                coordinates: [number, number]
            }
        }]
    },
    rev: null,
    date_stamp: string,
    date_day: string,
    date_hour: string,
    timestamp: string,
    location_tz: string
}