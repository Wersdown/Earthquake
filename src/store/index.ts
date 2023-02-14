import { EarthquakeData, GoogleMapType, MapType } from "@/types";
import { createStore } from "vuex";

function convertBool(val: string) {
    return ["true", "True"].filter((v) => { return v == val }).length == 1;
}

export default createStore({
    state: {
        location: {
            lat: 39 as number,
            lng: 36 as number
        },
        story: false as boolean,
        mapType: "heat" as MapType,
        googleMapType: "terrain" as GoogleMapType,
        zoom: 6 as number,
        data: [] as EarthquakeData[]
    },
    mutations: {
        safeLoadValues(state) {
            try {
                state.mapType = localStorage.getItem('mapType') as MapType || 'circle';
                state.googleMapType = localStorage.getItem('googleMapType') as GoogleMapType || state.googleMapType;
                let story = localStorage.getItem("story");
                state.story = story ? convertBool(story) : state.story;
                let loc = localStorage.getItem("location");
                state.location = loc ? JSON.parse(loc) : state.location;
                let zoom = localStorage.getItem("zoom");
                state.zoom = zoom ? parseInt(zoom) : state.zoom;
            }
            catch (e) {
                if (e) {
                    localStorage.clear();
                    window.location.reload();
                }
            }
        },
        saveValues(state) {
            localStorage.setItem("mapType", state.mapType);
            localStorage.setItem("googleMapType", state.googleMapType);
            localStorage.setItem("story", state.story + '');
            localStorage.setItem("location", JSON.stringify(state.location))
            localStorage.setItem("zoom", state.zoom + '');
        }
    }
})