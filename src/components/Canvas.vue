
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
        
        // State for drawing
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

                    // Smoother edges for lines
                    context.lineCap = 'round'
                    context.lineJoin = 'round'
                }
            }
        })

        // Watch for changes to color, brushSize, or tool
        watch(
            () => [props.color, props.brushSize, props.tool],
            () => {
                if (!ctx.value) return

                if (props.tool === 'eraser') {
                    // Use destination-out for true erasing (transparent)
                    ctx.value.globalCompositeOperation = 'destination-out'
                    // Set stroke style to white for eraser. Could be any color
                    ctx.value.strokeStyle = '#000000'
                } else {
                    // Pencil draws over existing content
                    ctx.value.globalCompositeOperation = 'source-over'
                    ctx.value.strokeStyle = props.color
                }

                ctx.value.lineWidth = props.brushSize
            },
                { immediate: true }
        )

        // Retrieve coordinates from mouse or touch
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

        // Start drawing
        const startDrawing = (e: MouseEvent | TouchEvent) => {
            if (!ctx.value) return
            isDrawing = true
            const { x, y } = getCoords(e)
            lastX = x
            lastY = y

            // Draw a dot on single-click
            ctx.value.beginPath()
            ctx.value.arc(x, y, ctx.value.lineWidth / 2, 0, Math.PI * 2)
            ctx.value.fillStyle = props.tool === 'eraser' ? 'rgba(0,0,0,1)': props.color    // Set color based on tool. Eraser is irrelevant
            ctx.value.fill()
        }

        // Continue drawing
        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing || !ctx.value) return
            const { x, y } = getCoords(e)
            
            // Draw line from last position to current position
            ctx.value.beginPath()
            ctx.value.moveTo(lastX, lastY)
            ctx.value.lineTo(x, y)
            ctx.value.stroke()
            
            lastX = x
            lastY = y
        }

        // Stop drawing
        const stopDrawing = () => {
            isDrawing = false
        }


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

        // Export canvas as image
        const exportAsImage = (): string | null => {
            if (!canvasElem.value) return null
            return canvasElem.value.toDataURL('image/png')
        }

        // Load image from base64
        const loadFromBase64 = (base64: string) => {
            if (!canvasElem.value || !ctx.value) return
            const img = new Image()
            img.src = base64
            img.onload = () => {
                // Clear canvas first
                ctx.value.clearRect(0, 0, canvasElem.value!.width, canvasElem.value!.height)
                // Draw the loaded image
                ctx.value.drawImage(img, 0, 0)
            }
        }

        return {
            canvasElem,
            exportAsImage,
            loadFromBase64,
        }
    },
})
</script>

<style scoped>
/* Wrapper sized to 800x600 to match with canvas */
.canvas-wrapper {
  position: relative;
  width: 800px;
  height: 600px;

  /* Checkerboard background */
  background-color: #fff; /* fallback if pattern doesn't load */
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.drawing-canvas {
    /* Make canvas fill entire parent/ wrapper */
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #ccc;
    touch-action: none; /* prevent browser gestures on touch devices */
}
</style>