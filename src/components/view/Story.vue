<template>
    <div class="load" ref="storyBase">
        <div class="logo"></div>
        <div class="text">
            Son günlerde yaşadığımız olaylardan ötürü "Wersdown" ekibi olarak inanılmaz fazla üzüldük. Bunun için şuanda
            buradayız. Sizlere yapmış olduğumuz bu özel Web sitesinde deprem hakkındaki şiddet, yüksek deprem alanları
            ve her deprem konumunda bir adet işaretçi olarak depremin nerelerde olduğunu ve nerelerde hangi şiddetlerde
            yaşandığını izleyebilmeniz için güzel bir harita oluşturduk. Umarım işinizi görür ve umarım beğenirsiniz.
            Ayrıca aşağıdaki "detay" kısmından Türkiye bölgesindeki depremzedeler için bağış yapabilirsiniz.
        </div>
        <Button icon="system-uicons:arrow-left" @click="endStory()">İlerle</Button>
    </div>
</template>

<script lang="ts" setup>
import Button from '../input/Button.vue';
import { ref, onMounted } from 'vue';
import store from '@/store';

const storyBase = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (!store.state.story) storyBase.value?.classList.add("view");
})

function endStory() {
    storyBase.value?.classList.add('done');
    localStorage.setItem("story", true+'');

    setTimeout(() => {
        storyBase.value!.style.display = 'none';
    }, 3000);
}
</script>

<style lang="scss" scoped>
.load {
    background: #1A1B20;
    color: #fff;
    position: absolute;
    z-index: 105;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;

    &.view {
        display: block;
    }

    .logo {
        width: 7em;
        height: 7em;
        background: url('/Wersdown_white.svg');
        background-size: cover;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        animation-name: story_logo;
        animation-timing-function: ease;
        animation-duration: 2s;
        animation-fill-mode: forwards;
    }

    .text {
        font-weight: 700;
        font-style: italic;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        opacity: 0;
        margin-left: 1em;

        animation-name: story_text_in;
        animation-timing-function: ease;
        animation-delay: 2s;
        animation-duration: .2s;
        animation-fill-mode: forwards;
    }

    .button {
        position: absolute;
        bottom: 2em;
        left: 2em;

        opacity: 0;
        margin-left: 1em;

        animation-name: story_text_in;
        animation-timing-function: ease;
        animation-delay: 3s;
        animation-duration: .2s;
        animation-fill-mode: forwards;
    }

    &.done {
        .text {
            margin-left: 0;
            opacity: 1;

            animation-name: story_text_out;
            animation-timing-function: ease;
            animation-duration: .2s;
            animation-fill-mode: forwards;
        }

        .button {
            margin-left: 0;
            opacity: 1;

            animation-name: story_text_out;
            animation-timing-function: ease;
            animation-delay: 1s;
            animation-duration: .2s;
            animation-fill-mode: forwards;
        }

        animation-name: uibg_open;
        animation-timing-function: ease;
        animation-direction: reverse;
        animation-delay: 2s;
        animation-duration: .2s;
        animation-fill-mode: forwards;

    }
}

@keyframes story_logo {
    0% {
        margin-left: 1em;
        opacity: 0;
    }

    10% {
        margin-left: 0;
        opacity: 1;
    }

    90% {
        margin-left: 0;
        opacity: 1;
    }

    100% {
        margin-left: -1em;
        opacity: 0;
    }
}

@keyframes story_text_in {
    from {
        margin-left: 1em;
        opacity: 0;
    }

    to {
        margin-left: 0;
        opacity: 1;
    }
}

@keyframes story_text_out {
    from {
        margin-left: 0;
        opacity: 1;
    }

    to {
        margin-left: -1em;
        opacity: 0;
    }
}
</style>