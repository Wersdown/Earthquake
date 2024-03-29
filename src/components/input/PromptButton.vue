<template>
    <div class="button icon" ref="buttonElement" @click="openPrompt()" v-if="props.buttonType == 'icon'">
        <div class="content">
            <div class="icon">
                <Icon :icon="props.icon" v-if="props.icon != ''" />
            </div>
        </div>
    </div>
    <div class="button" ref="buttonElement" @click="openPrompt()" v-else>
        <div class="content">
            <div class="icon">
                <Icon :icon="props.icon" v-if="props.icon != ''" />
            </div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, PropType } from 'vue';

import { Icon } from '@iconify/vue';

const props = defineProps({
    icon: {
        type: String,
        default: ''
    },
    buttonType: {
        type: String as PropType<"text" | "icon">,
        default: 'text'
    },
    promptID: {
        type: String,
        required: true
    }
})

const buttonElement = ref<HTMLButtonElement | null>(null);
const promptElement = ref<HTMLElement | null>(null);

function openPrompt() {
    if (!promptElement.value) return;
    promptElement.value.classList.remove('close');

    setTimeout(() => {
        promptElement.value!.style.display = 'grid';
    }, 400)
}

onMounted(() => {
    promptElement.value = document.getElementById(props.promptID);

    if (!buttonElement.value) return;

    buttonElement.value.addEventListener('mousedown', () => {
        buttonElement.value?.classList.add('click');
    })

    buttonElement.value.addEventListener('mouseup', () => {
        buttonElement.value?.classList.remove('click');
    })

    buttonElement.value.addEventListener('mouseout', () => {
        buttonElement.value?.classList.remove('click');
    })
})
</script>

<style lang="scss" scoped>
.button {
    font-size: .9em;

    cursor: pointer;

    padding: .7em 1.2em;
    border-radius: 1em;
    background-color: #000000AF;
    background-image: url('/noise.png');
    backdrop-filter: blur(15px);
    color: #fff;
    width: fit-content;

    user-select: none;

    transition: .2s ease;

    .content {
        display: flex;
        align-items: center;

        transition: .1s ease;
    }

    .icon {
        display: flex;
        margin-right: .4em;

        svg {
            width: 1.6em;
            height: 1.6em;
        }
    }

    &:hover {
        background-color: #121212AF;
    }

    &.click .content {
        transform: scale(.95);
    }

    &.icon.click .content {
        transform: scale(.8);
    }

    &.icon {
        padding: .7em;

        .icon {
            margin: 0;
        }
    }
}
</style>