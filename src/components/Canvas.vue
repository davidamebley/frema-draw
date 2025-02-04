<template>
    <canvas ref="canvasElem" class="drawing-canvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
    name: 'Canvas',
    props: {
        color: {
            type: String,
            required: true,
        },
        brushSize: {
            type: Number,
            required: true,
        },
        tool: {
            type: String,
            required: true,
            validator: (value: String) => ['pencil', 'eraser'].includes(value),
        },
    },
    setup(props) {
        const canvasElem = ref<HTMLCanvasElement | null>(null)
        const ctx = ref<CanvasRenderingContext2D | null>(null)

        onMounted(() => {
            if (canvasElem.value) {
                // Initialize canvas
                canvasElem.value.width = 800
                canvasElem.value.height = 600
                const context = canvasElem.value.getContext('2d')
                if (context) {
                    ctx.value = context
                    // Set a default background color
                    context.value.fillStyle = '#ffffff'
                    context.fillRect(0, 0, canvasElem.value.width, canvasElem.value.height)
                }
            }
        })

        return {
            canvasElem,
        }
    },
})
</script>