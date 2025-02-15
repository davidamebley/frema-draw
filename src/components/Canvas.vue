<template>
  <!-- Wrap canvas with checkerboard styling container -->
  <div ref="wrapperElem" class="canvas-wrapper">
    <canvas ref="canvasElem" class="drawing-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'Canvas',
  props: {
    color: {
      type: String as PropType<string>,
      required: true,
    },
    brushSize: {
      type: Number,
      required: true,
    },
    tool: {
      type: String as PropType<string>,
      required: true,
      validator: (value: string) => ['pencil', 'eraser'].includes(value),
    },
  },
  setup(props) {
    const wrapperElem = ref<HTMLDivElement | null>(null)
    const canvasElem = ref<HTMLCanvasElement | null>(null)
    const ctx = ref<CanvasRenderingContext2D | null>(null)

    // State for drawing
    let isDrawing = false
    let lastX = 0
    let lastY = 0

    // Dynamically size canvas to match the wrapper
    const resizeCanvasToWrapper = () => {
      if (!canvasElem.value || !wrapperElem.value) return
      const { clientWidth, clientHeight } = wrapperElem.value

      canvasElem.value.width = clientWidth
      canvasElem.value.height = clientHeight

      // Re-initialize context
      const context = canvasElem.value.getContext('2d')
      if (context) {
        ctx.value = context
        ctx.value.lineCap = 'round'
        ctx.value.lineJoin = 'round'
      }
    }

    // Add event listeners for drawing
    const addEventListeners = () => {
      if (!canvasElem.value) return

      // Mouse events
      canvasElem.value.addEventListener('mousedown', startDrawing)
      canvasElem.value.addEventListener('mousemove', draw)
      canvasElem.value.addEventListener('mouseup', stopDrawing)
      canvasElem.value.addEventListener('mouseout', stopDrawing)

      // Touch events
      canvasElem.value.addEventListener('touchstart', startDrawing, {
        passive: false,
      })
      canvasElem.value.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault() // Prevent scrolling
          draw(e)
        },
        { passive: false }
      )
      canvasElem.value.addEventListener('touchend', stopDrawing)
    }

    // Called once the component is mounted
    onMounted(() => {
      resizeCanvasToWrapper()
      window.addEventListener('resize', resizeCanvasToWrapper)
      addEventListeners()
    })

    // Cleanup
    onUnmounted(() => {
      window.removeEventListener('resize', resizeCanvasToWrapper)
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

    // Helpers for drawing
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

      // Draw a dot on single-click
      ctx.value.beginPath()
      ctx.value.arc(x, y, ctx.value.lineWidth / 2, 0, Math.PI * 2)
      ctx.value.fillStyle =
        props.tool === 'eraser' ? 'rgba(0,0,0,1)' : props.color // Set color based on tool. Eraser is irrelevant
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

    // Export/load image
    const exportAsImage = (): string | null => {
      if (!canvasElem.value) return null
      return canvasElem.value.toDataURL('image/png')
    }

    const loadFromBase64 = (base64: string) => {
      if (!canvasElem.value || !ctx.value) return
      const img = new Image()
      img.src = base64
      img.onload = () => {
        if (!ctx.value || !canvasElem.value) return
          // Clear canvas first
        ctx.value.clearRect(
          0,
          0,
          canvasElem.value!.width,
          canvasElem.value!.height
        )
        // Draw the loaded image
        ctx.value.drawImage(img, 0, 0)
      }
    }

    return {
      wrapperElem,
      canvasElem,
      exportAsImage,
      loadFromBase64,
    }
  },
})
</script>

<style scoped>
.canvas-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  /* For a consistent shape */

  /* Checkerboard background */
  background-color: #fff;
  /* fallback if pattern doesn't load */
  background-image: linear-gradient(
      45deg,
      #ccc 25%,
      transparent 25%,
      transparent 75%,
      #ccc 75%
    ),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    10px 10px;
}

.drawing-canvas {
  /* Make canvas fill entire parent/ wrapper */
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #ccc;
  touch-action: none;
  /* prevent gestures on touch devices */
  width: 100%;
  height: 100%;
}
</style>
