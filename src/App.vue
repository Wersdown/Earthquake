<template>
    <Story />
    <Prompt icon="system-uicons:document-stack" prompt-title="Detaylar" id="detailsPrompt">
        <h1>
            <Icon icon="system-uicons:document-words" /> Kaynaklar
        </h1>
        <p>Kullandığımız kaynaklar arasında en üstte gelen kaynak "Google Maps JavaScript API" oldu. Aşağıya
            koymuş
            olduğumuz linkten dokümantasyona ulaşabilir ve bilgi edinebilirsiniz.</p>

        <div class="button-group">
            <Button icon="system-uicons:document-stack">Google Earthquake API</Button>
            <Button icon="system-uicons:grid">System UI Icons</Button>
        </div>
        <div class="line"></div>
        <h1>
            <Icon icon="system-uicons:heart" /> Bağış
        </h1>
        <p>Buradan Türkiye'de ki, depremzedeler için bağışta bulunabilirsiniz.</p>
        <div class="button-group">
            <Button icon="system-uicons:heart">AFAD</Button>
            <Button icon="system-uicons:heart">Ahbap</Button>
            <Button icon="system-uicons:heart">Kızılay</Button>
        </div>
        <div class="line"></div>
        <center>
            <p><a href="mailto:support@wersdown.dev">support@wersdown.dev</a></p>
        </center>
    </Prompt>
    <Prompt icon="system-uicons:document-list" prompt-title="Son 400 Deprem" id="allEarthquakesPrompt">
        <ul>
            <li v-for="f of store.state.data">
                <div
                    @click="
                    mapData.map?.setCenter({ lat: f.geojson.coordinates[1], lng: f.geojson.coordinates[0] });
                    mapData.map?.setZoom(11);

                    mapData.infoWindow?.setPosition({ lat: f.geojson.coordinates[1], lng: f.geojson.coordinates[0] });
                    mapData.infoWindow?.setContent(`<div><h3>${f.title}</h3><p>Büyüklük: ${f.mag}</p><p>Tarih: ${f.date}</p></div>`);
                    mapData.infoWindow?.open(mapData.map);

                    closePrompt();
                    ">
                    {{ f.title }} - {{ f.mag }}</div>
            </li>
        </ul>
    </Prompt>
    <Prompt icon="system-uicons:list" prompt-title="Deprem" id="earthquakeDetailsPrompt"></Prompt>
    <div class="control-panel">
        <Select :values="selectValues" v-model="selectValue" class="view-type" body-position="upper">Görüntüleme
            Türü</Select>
        <PromptButton icon="system-uicons:document-stack" button-type="icon" promptID="detailsPrompt" />
        <PromptButton icon="system-uicons:document-list" button-type="icon" promptID="allEarthquakesPrompt" />
        <Button icon="system-uicons:location" button-type="icon" @click="findCurrentLocation()" />
    </div>
    <Map v-model="mapData" promptID="earthquakeDetailsPrompt" />
</template>

<script lang="ts" setup>
import Map from '@/components/map/Map.vue';
import store from '@/store';
import Button from '@/components/input/Button.vue';
import Select from '@/components/input/Select.vue';
import PromptButton from './components/input/PromptButton.vue';
import Prompt from './components/input/Prompt.vue';
import Story from './components/view/Story.vue';
import { Icon } from '@iconify/vue';
import { SelectValue } from './types';
import { ref, watch, onMounted } from 'vue';

const selectValue = ref<string>('circle');
const mapData = ref<{map: google.maps.Map | null, infoWindow: google.maps.InfoWindow | null}>({ map: null, infoWindow: null });

let allEarthquakes: HTMLElement | null = null;

const selectValues: Array<SelectValue> = [
    {
        icon: 'system-uicons:circle',
        value: 'circle',
        title: 'Daire'
    },
    {
        icon: 'system-uicons:loader',
        value: 'heat',
        title: 'Isı'
    },
    {
        icon: 'system-uicons:location',
        value: 'point',
        title: 'İşaret'
    }
]

store.commit('safeLoadValues');

function closePrompt() {
    if (!allEarthquakes) return;
    allEarthquakes.classList.add('close');

    setTimeout(() => {
        allEarthquakes!.style.display = 'none';
    }, 400)
}

function handleLocationError(browserHasGeolocation: any, infoWindow: any, pos: any) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Hata: Konum servisi başarısız oldu."
      : "Hata: Tarayıcınız konum servisini desteklemiyor."
  );
  infoWindow.open(mapData.value.map);
}

function findCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          mapData.value.infoWindow?.setPosition(pos);
          mapData.value.infoWindow?.setContent("Şimdiki konumunuz");
          mapData.value.infoWindow?.open(mapData.value.map);
          mapData.value.map?.setCenter(pos);
          console.log(mapData.value.map?.getCenter()?.lat());
        },
        () => {
          handleLocationError(true, mapData.value.infoWindow, mapData.value.map?.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, mapData.value.infoWindow, mapData.value.map?.getCenter());
    }    
}

selectValue.value = store.state.mapType;

watch(selectValue, (val: any) => {
    localStorage.setItem('mapType', val);
    store.state.mapType = val;
    window.initMap();
})

onMounted(() => {
    allEarthquakes = document.getElementById("allEarthquakesPrompt");
})
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

body {
    font-size: clamp(1rem, 1.5vw, 2rem);
    height: 100vh;
}

.control-panel {
    position: absolute;
    z-index: 11;
    bottom: 1em;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;

    .select,
    .button {
        margin: .4em;
    }
}

.prompt {
    .line {
        margin: 1em auto;
        background: #747474;
        width: 80%;
        position: relative;
        height: 1px;
    }

    h1 {
        margin-bottom: .3em;

        display: flex;
        align-items: center;

        svg {
            width: 1em;
            height: 1em;
            margin-right: .4em;
        }
    }

    .button-group {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .button {
            margin: .4em;
        }
    }

    ul {
        overflow: auto;
        max-height: 70vh;

        li {
            list-style: none;
            padding: .4em .8em;
            margin: 0.4em;
            border-radius: .6em;
            cursor: pointer;

            &:hover {
                background-color: rgba(0, 0, 0, 0.5019607843);
                color: #fff;
                background-image: url(/noise.png);
            }
        }
    }
}
</style>