<template>
    <div class="prompt-base close" ref="promptBase" style="display: none;">
        <div class="prompt">
            <div class="head">
                <span class="title">
                    <Icon :icon="props.icon" v-if="props.icon != ''" /> {{ props.promptTitle }}
                </span>
                <div class="close" @click="closePrompt()">
                    <Icon icon="system-uicons:cross" />
                </div>
            </div>
            <slot />
        </div>
    </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    icon: {
        type: String,
        default: ''
    },
    promptTitle: {
        type: String,
        required: true
    }
})

const promptBase = ref<HTMLDivElement | null>(null);

function closePrompt() {
    if (!promptBase.value) return;
    promptBase.value.classList.add('close');

    setTimeout(() => {
        promptBase.value!.style.display = 'none';
    }, 400)
}

</script>

<style lang="scss" scoped>
.prompt-base {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: grid;
    place-items: center;
    background-color: #000000AF;
    background-image: url('/noise.png');
    backdrop-filter: blur(15px);
    overflow: auto;
    color-scheme: dark;

    animation-name: uibg_open;
    animation-timing-function: ease;
    animation-duration: .2s;
    animation-fill-mode: forwards;

    &.close {
        animation-name: uibg_close;
        animation-timing-function: ease;
        animation-duration: .2s;
        animation-fill-mode: forwards;

        .prompt {
            animation-name: ui_close;
            animation-timing-function: ease;
            animation-duration: .2s;
            animation-fill-mode: forwards;
        }
    }



    .prompt {
        width: 70%;
        background-color: #00000080;
        color: #fff;
        background-image: url('/noise.png');
        padding: 2em;
        padding-top: 3.5em;
        border-radius: 1em;
        margin: 2em 0;
        position: relative;

        animation-name: ui_open;
        animation-timing-function: ease;
        animation-duration: .2s;
        animation-fill-mode: forwards;

        .head {
            .title {
                font-weight: 900;
                position: absolute;
                left: 1.5em;
                top: 1.5em;
                display: flex;
                align-items: center;

                svg {
                    margin-right: .4em;
                }
            }

            .close {
                position: absolute;
                right: 1.5em;
                top: 1.5em;
                width: 1.2em;
                height: 1.2em;
                cursor: pointer;

                transition: .2s ease;

                &:hover {
                    transform: scale(1.2);
                }
            }
        }
    }
}

@media screen and (max-width: 500px) {
    .prompt-base .prompt {
        width: 80%;
    }
}

@keyframes uibg_open {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes ui_open {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes uibg_close {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

@keyframes ui_close {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.9);
    }
}
</style>