<template>
    <div class="select">
        <div class="head" ref="selectElementHead">
            <div class="content">
                <slot />
                <div :class="`arrow ${props.bodyPosition}`"></div>
            </div>
        </div>
        <div :class="`body ${props.bodyPosition}`" ref="selectElementBody">
            <div class="select-item" :value="value.value" :fn="value.clickEvent" v-for="value of props.values">
                <div class="icon">
                    <Icon :icon="value.icon" />
                </div>
                {{ value.title }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, PropType, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { SelectValue } from '@/types';

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    values: {
        type: Array<SelectValue>,
        required: true
    },
    bodyPosition: {
        type: String as PropType<"upper" | "down">,
        default: 'down'
    }
});

const emits = defineEmits(["update:modelValue"]);

const selectElementHead = ref<HTMLDivElement | null>(null);
const selectElementBody = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (!selectElementHead.value || !selectElementBody.value) return;

    const selectElementBodyNodes = selectElementBody.value.childNodes;

    // Animating Body

    selectElementBody.value.style.display = "none";

    selectElementHead.value.addEventListener('mousedown', () => {
        selectElementHead.value?.classList.add("click");
    });

    selectElementHead.value.addEventListener('mouseup', () => {
        selectElementHead.value?.classList.remove("click");
        if (selectElementBody.value?.classList.contains("open")) {
            selectElementBody.value?.classList.remove("open");
            setTimeout(() => {
                selectElementBody.value!.style.display = "none";
            }, 200);
            return;
        }

        selectElementBody.value!.style.display = "flex";
        setTimeout(() => {
            selectElementBody.value?.classList.add("open");
        }, 100)
    })

    selectElementHead.value.addEventListener('mouseout', () => {
        selectElementHead.value?.classList.remove("click");
    })


    // Child Initializing
    for (let indexNode of selectElementBodyNodes) {
        let node = indexNode as HTMLDivElement;

        console.log(node);

        if (node.nodeName == '#text') continue;

        if (node.getAttribute('value') == props.modelValue) {
            node.classList.add("focus");
        }
        else {
            node.classList.remove('focus');
        }

        node.addEventListener('mousedown', () => {
            node.classList.add("click");
        });
        node.onmouseup = () => {
            node.classList.remove("click");
            selectElementBody.value?.classList.remove("open");
            selectElementBody.value!.style.display = "none";
            let toggledValue = node.getAttribute("value")
            emits('update:modelValue', toggledValue)
            localStorage.setItem('mapType', props.modelValue as string);
            const updateItems = () => {
                for (let secondIndexNode of selectElementBodyNodes) {
                    let secondNode = secondIndexNode as HTMLDivElement;
                    if (secondNode.nodeName == '#text') continue;
                    if (secondNode.getAttribute("value") == toggledValue) {
                        secondNode.classList.add("focus");
                    }
                    else {
                        secondNode.classList.remove('focus');
                    }
                }
            }
            watch(() => props.modelValue, (val) => {
                updateItems();
            })
            eval(node.getAttribute("data-fn") || '');
        }
    }
})
</script>

<style lang="scss" scoped>
.select {
    /* display: flex; */

    position: relative;
    cursor: pointer;

    font-size: .9em;

    user-select: none;

    .head {
        position: relative;
        padding: .7em 1.2em;
        border-radius: 1em;
        background-color: #000000AF;
        background-image: url('/noise.png');
        backdrop-filter: blur(15px);
        color: #fff;
        width: fit-content;

        transition: .2s ease;

        .content {
            display: flex;
            align-items: center;

            transition: .1s ease;
        }

        &.click .content {
            transform: scale(0.95);
        }

        &:hover {
            background-color: #121212AF;
        }

        .arrow {
            padding: .2em;
            width: .1em;
            height: .1em;
            border: .1em solid #fff;
            border-width: .125em .125em 0 0;
            transform: rotate(135deg) translateY(30%);
            margin-left: 1em;

            &.upper {
                transform: rotate(-45deg) translateY(30%);
            }
        }

    }

    .body {
        position: absolute;
        display: flex;
        flex-direction: column;
        background-color: #000000AF;
        background-image: url('/noise.png');
        backdrop-filter: blur(15px);
        color: #fff;
        padding: 1em 0;
        border-radius: 1em;
        width: max-content;
        transform: translateX(-50%);
        left: 50%;
        cursor: default;
        z-index: 10;

        opacity: 0;

        &.upper {
            bottom: 0;
            margin-bottom: 0em;
        }

        &.open {
            animation-name: jumpin_down;
            animation-timing-function: ease;
            animation-duration: .2s;
            animation-fill-mode: forwards;
        }

        &.upper.open {
            animation-name: jumpin_upper;
        }


        .select-item {
            padding: .4em 2.2em;
            transition: .2s ease;
            cursor: pointer;

            display: flex;

            transition: .1s ease;

            &.click {
                transform: scale(0.95);
            }

            &.focus {
                background: #FFFFFF15;
            }

            .icon {
                margin-right: .4em;

                svg {
                    width: 1.2em;
                    height: 1.2em;
                }
            }

            &:hover {
                background: #FFFFFF25;
            }
        }
    }
}

@keyframes jumpin_upper {
    from {
        margin-bottom: 3em;
        opacity: 0;
    }

    to {
        margin-bottom: 3.5em;
        opacity: 1;
    }
}

@keyframes jumpin_down {
    from {
        margin-top: 0em;
        opacity: 0;
    }

    to {
        margin-top: .5em;
        opacity: 1;
    }
}
</style>