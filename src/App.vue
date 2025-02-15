<template>
  <div id="app">
    <h1>Frema Draw</h1>

    <!-- Will remove this later -->
    <p>Welcome to the Frema Draw app.</p>

    <!-- Toolbar -->
     <Toolbar
      :color="color"
      :brushSize="brushSize"
      :tool="tool"
      @update:color="color = $event"
      @update:brushSize="brushSize = $event"
      @update:tool="tool = $event"
      @save-png="handleSavePng"
      @save-storage="handleSaveStorage"
      @load-storage="handleLoadStorage"
    />

    <!-- Canvas -->
     <Canvas
      ref="drawingCanvas"
      :color="color"
      :brushSize="brushSize"
      :tool="tool"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Toolbar from './components/Toolbar.vue'
import Canvas from './components/Canvas.vue'

export default defineComponent({
  name: 'App',
  components: {
    Toolbar,
    Canvas,
  },
  setup() {
    // Reactive state for color, brush size, tool
    const color = ref('#000000')
    const brushSize = ref(5)
    const tool = ref('pencil')  // 'pencil' or 'eraser'

    // Store a reference to the Canvas component
    const drawingCanvas = ref()

    // Save as PNG
    const handleSavePng = () => {
      // Access the exportAsImage method
      const base64 = drawingCanvas.value?.exportAsImage()
      if (!base64) return

      // Create an <a> element to download the image
      const link = document.createElement('a')
      link.href = base64
      link.download = 'frema-draw.png'
      link.click()
    }

    // Save to local storage
    const handleSaveStorage = () => {
      const base64 = drawingCanvas.value?.exportAsImage()
      if (base64) {
        localStorage.setItem('frema-draw-image', base64)
        alert('Image saved to local storage.')
      }
    }

    // Load from local storage
    const handleLoadStorage = () => {
      const saved = localStorage.getItem('frema-draw-image')
      if (saved && drawingCanvas.value) {
        drawingCanvas.value.loadFromBase64(saved)
      } else {
        alert('No saved image found.')
      }
    }
    

    return {
      color,
      brushSize,
      tool,
      drawingCanvas,
      handleSavePng,
      handleSaveStorage,
      handleLoadStorage,
    }
  },
})
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 2rem;
  text-align: center;
}
</style>
