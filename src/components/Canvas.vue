
<template>
    <!-- Wrap canvas with checkerboard styling container -->
     <div class="canvas-wrapper">
        <canvas ref="canvasElem" class="drawing-canvas"></canvas>
     </div> 
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'

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
        let isDrawing = false
        let lastX = 0
        let lastY = 0

        onMounted(() => {
            if (canvasElem.value) {
                // Initialize canvas
                canvasElem.value.width = 800
                canvasElem.value.height = 600
                const context = canvasElem.value.getContext('2d')
                if (context) {
                    ctx.value = context
                    // Set a default background color
                    context.fillStyle = '#ffffff'
                    context.fillRect(0, 0, canvasElem.value.width, canvasElem.value.height)

                    // Smoother strokes
                    context.lineCap = 'round'
                    context.lineJoin = 'round'
                }
            }
        })

        // Watch for prop changes (color, brushSize, tool) and update context
        watch(
            () => [props.color, props.brushSize, props.tool],
            () => {
                if (!ctx.value) return

                // Always use source-over blending mode
                ctx.value.globalCompositeOperation = 'source-over'

                if (props.tool === 'eraser') {
                    // Paint with white color (eraser)
                    ctx.value.strokeStyle = '#ffffff'
                } else {
                    // "Pencil" approach: draw in color
                    ctx.value.strokeStyle = props.color
                }

                ctx.value.lineWidth = props.brushSize
            },
                { immediate: true }
        )

        // Helper to get X, Y from MouseEvent or TouchEvent
        const getCoords = (e: MouseEvent | TouchEvent) => {
            if (!canvasElem.value) return { x: 0, y: 0 }
            const rect = canvasElem.value.getBoundingClientRect()
            if (e instanceof MouseEvent) {
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                }
            } else {
                // Touch event
                const touch = e.touches[0]
                return {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top,
                }
            }
        }

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            if (!ctx.value) return
            isDrawing = true
            const { x, y } = getCoords(e)
            lastX = x
            lastY = y

            // Draw a dot at the starting point
            ctx.value.beginPath()
            ctx.value.arc(x, y, ctx.value.lineWidth / 2, 0, Math.PI * 2)
            ctx.value.fillStyle = ctx.value.strokeStyle
            ctx.value.fill()
        }

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing || !ctx.value) return
            const { x, y } = getCoords(e)
            ctx.value.beginPath()
            ctx.value.moveTo(lastX, lastY)
            ctx.value.lineTo(x, y)
            ctx.value.stroke()
            lastX = x
            lastY = y
        }

        const stopDrawing = () => {
            isDrawing = false
        }

        // Register event listeners on canvas
        const addEventListeners = () => {
            if (!canvasElem.value) return

            // Mouse events
            canvasElem.value.addEventListener('mousedown', startDrawing)
            canvasElem.value.addEventListener('mousemove', draw)
            canvasElem.value.addEventListener('mouseup', stopDrawing)
            canvasElem.value.addEventListener('mouseout', stopDrawing)

            // Touch events
            canvasElem.value.addEventListener('touchstart', startDrawing, { passive: false })
            canvasElem.value.addEventListener('touchmove', (e) => {
                e.preventDefault()  // Prevent scrolling
                draw(e)
            }, { passive: false })
            canvasElem.value.addEventListener('touchend', stopDrawing)
        }

        onMounted(() => {
            addEventListeners()
        })

        return {
            canvasElem,
        }
    },
})
</script>

<style scoped>
.drawing-canvas {
    border: 1px solid #ccc;
    display: block;
    margin: 0 auto;
    touch-action: none; /* prevent browser gestures on touch devices */
}
</style>