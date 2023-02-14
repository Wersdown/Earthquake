<template>
    <div class="map" ref="mapElement"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, PropType, watch } from 'vue';

import store from '@/store';
import { GoogleMapType, EarthquakeResponse, EarthquakeData, MapFeature } from '@/types';

const mapElement = ref<HTMLElement | null>(null);

const props = defineProps({
    modelValue: {
        type: Object as PropType<{map: google.maps.Map | null, infoWindow: google.maps.InfoWindow | null}>,
        required: true
    },
    promptID: {
        type: String,
        required: true
    }
});
const emit = defineEmits(['update:modelValue']);

function getCircle(magnitude: number) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "red",
        fillOpacity: 0.2,
        scale: Math.pow(2, magnitude) / 2,
        strokeColor: "white",
        strokeWeight: 0.5,
    };
}

function convertToFeature(dataset: Array<EarthquakeData>): Array<MapFeature> {
    let featureDataset: Array<MapFeature> = [];
    for (let i = 0; i < dataset.length; i++) {
        let data = dataset[i];
        featureDataset.push({
            type: "Feature",
            properties: {
                mag: data.mag,
                place: data.location_properties.closestCity.name,
                time: data.date,
                updated: 0,
                tz: null,
                url: "",
                detail: "",
                felt: 0,
                cdi: 0,
                mmi: null,
                alert: null,
                status: "reviewed",
                tsunami: 0,
                sig: 0,
                net: "us",
                code: "",
                ids: "",
                sources: "",
                types: "",
                nst: 0,
                dmin: 0,
                rms: 0,
                gap: 0,
                magType: "undefined",
                type: "earthquake",
                title: data.title
            },
            geometry: {
                type: "Point",
                coordinates: [data.geojson.coordinates[0], data.geojson.coordinates[1], 0]
            },
            id: ""
        });
    }
    return featureDataset;
}

onMounted(() => {
    let infoWindow = props.modelValue.infoWindow;
    let map = props.modelValue.map;

    function initMap(): void {
        // Error Safe
        if (!mapElement.value) return;

        // Initialize Map
        map = new google.maps.Map(mapElement.value, {
            zoom: store.state.zoom,
            center: new google.maps.LatLng(store.state.location.lat, store.state.location.lng),
            mapTypeId: store.state.googleMapType,
        })

        // Initialize InfoWindow
        infoWindow = new google.maps.InfoWindow();

        // Emit Changes
        emit('update:modelValue', {map, infoWindow});

        // Loading Earthquake Data from https://api.orhanaydogdu.com.tr/deprem/live.php
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://api.orhanaydogdu.com.tr/deprem/live.php');

        xhr.onreadystatechange = (ev) => {
            if (xhr.readyState == xhr.DONE) {
                let data: EarthquakeResponse = JSON.parse(xhr.responseText);
                eqfeed_callback(data);
            }
        }

        xhr.send();

        // Auto Update Store Values
        map?.addListener("maptypeid_changed", () => {
            let type = map?.getMapTypeId();

            if (!type) return;

            store.state.googleMapType = type as GoogleMapType;
            store.commit('saveValues');
        })

        map?.addListener("zoom_changed", () => {
            let zoom = map?.getZoom();

            if (!zoom) return;

            store.state.zoom = zoom;
            store.commit('saveValues');
        })

        map?.addListener("dragend", () => {
            let center = map?.getCenter()?.toJSON();

            if (!center) return;

            store.state.location = center;
            store.commit('saveValues');
        })

        // Circle Map Drawing
        if (store.state.mapType == "circle") {
            map?.data.setStyle((mapGeoData) => {
                const magnitude = mapGeoData.getProperty("mag");
                return {
                    icon: getCircle(magnitude),
                    clickable: true
                }
            })

            map?.data.addListener('click', (feature: any) => {
                infoWindow?.setPosition(feature.latLng);
                let details = feature.feature.j;

                console.log(details);

                let content = document.createElement("div");

                let title = document.createElement("h3");
                let mag = document.createElement("p");
                let date = document.createElement("p");

                title.textContent = details.title;
                mag.textContent = `Büyüklük: ${details.mag}`;
                date.textContent = `Tarih: ${details.time}`
                

                content.appendChild(title);
                content.appendChild(mag);
                content.appendChild(date);

                infoWindow?.setContent(content);
                infoWindow?.open(map);
            })
        }
    }

    const eqfeed_callback = function (results: EarthquakeResponse) {
        store.state.data = results.result;
        const data = results.result;
        switch (store.state.mapType) {
            case 'circle':
                // 
                // Circle View Data Pushing
                //
                map?.data.addGeoJson({
                    type: "FeatureCollection",
                    metadata:{
                        generated:Date.now(),
                        url:"https://api.orhanaydogdu.com.tr/deprem/live.php",
                        title:"Kandilli Rasathanesi - Son Depremler",
                        status:200,
                        api:"1.0.0.",
                        count:data.length
                    },
                    features: convertToFeature(data)
                });
                break;
            case 'heat':
                // 
                // Heat View
                //
                const heatmapData = [];

                for (let i = 0; i < data.length; i++) {
                    const coords = data[i].geojson.coordinates;
                    const latLng = new google.maps.LatLng(coords[1], coords[0]);

                    heatmapData.push(latLng);
                }

                new google.maps.visualization.HeatmapLayer({
                    data: heatmapData,
                    dissipating: false,
                    map: map
                });
                break;
            case 'point':
                // 
                // Pointer View
                //
                for (let i = 0; i < data.length; i++) {
                    const coords = data[i].geojson.coordinates;
                    const latLng = new google.maps.LatLng(coords[1], coords[0]);

                    const marker = new google.maps.Marker({
                        position: latLng,
                        map: map
                    });

                    marker.addListener('click', () => {
                        infoWindow?.setPosition(latLng);

                        let content = document.createElement("div");

                        let title = document.createElement("h3");
                        let mag = document.createElement("p");
                        let date = document.createElement("p");

                        title.textContent = data[i].title;
                        mag.textContent = `Büyüklük: ${data[i].mag}`;
                        date.textContent = `Tarih: ${data[i].date}`

                        content.appendChild(title);
                        content.appendChild(mag);
                        content.appendChild(date);

                        infoWindow?.setContent(content);
                        infoWindow?.open(map);
                    });
                }
                break;
        }
    };

    window.initMap = initMap;
    window.eqfeed_callback = eqfeed_callback;
})
</script>

<style lang="scss">
.map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>