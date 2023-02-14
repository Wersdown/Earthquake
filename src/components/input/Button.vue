<template>
    <div class="button icon" ref="buttonElement" v-if="props.buttonType == 'icon'">
        <div class="content">
            <div class="icon">
                <Icon :icon="props.icon" v-if="props.icon != ''" />
            </div>
        </div>
    </div>
    <div class="button" ref="buttonElement" v-else>
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
        default: '',
        required: false
    },
    buttonType: {
        type: String as PropType<"text" | "icon">,
        default: 'text',
        required: false
    }
})

const buttonElement = ref<HTMLButtonElement | null>(null);

onMounted(() => {
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
    position: relative;
    padding: .7em 1.2em;
    border-radius: 1em;
    background-color: #000000AF;
    background-image: url('/noise.png');
    backdrop-filter: blur(15px);
    color: #fff;
    width: fit-content;

    transition: .2s ease;

    user-select: none;

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