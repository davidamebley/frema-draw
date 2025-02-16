<template>
  <div id="app">
    <h1>Frema Draw</h1>

    <!-- Will remove this later -->
    <p>Welcome to the Frema Draw app.</p>

    <!-- Pass savedKeys as a prop to <Toolbar> -->
     <Toolbar
      :color="color"
      :brushSize="brushSize"
      :tool="tool"
      :savedKeys="savedKeys"
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
import { defineComponent, onMounted, ref } from 'vue'
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

    const savedKeys = ref<string[]>([])

    // Get all localStorage keys that match "FremaDraw_"
    const refreshSavedKeys = () => {
      const allKeys = Object.keys(localStorage)
      savedKeys.value = allKeys.filter(k => k.startsWith('FremaDraw_'))
    }

    // Populate savedKeys so the toolbar's dropdown can see them
    onMounted(() => {
      refreshSavedKeys()
    })

    // Save as PNG
    const handleSavePng = () => {
      const base64 = drawingCanvas.value?.exportAsImage()
      if (!base64) return
      const link = document.createElement('a')
      link.href = base64
      link.download = 'frema-draw.png'
      link.click()
    }

    // Save to local storage under a chosen filename. After saving, call refreshSavedKeys() to update the list
    const handleSaveStorage = (filename: string) => {
      if (!filename) filename = 'untitled'
      const base64 = drawingCanvas.value?.exportAsImage()
      if (base64) {
        const key = `FremaDraw_${filename.trim()}`
        localStorage.setItem(key, base64)
        alert(`Saved drawing as "${key}" in local storage.`)
        refreshSavedKeys()
      }
    }

    // Load from local storage with the chosen filename
    const handleLoadStorage = (filename: string) => {
      if (!filename) filename = 'untitled'
      const key = `FremaDraw_${filename.trim()}`
      const saved = localStorage.getItem(key)
      if (saved && drawingCanvas.value) {
        drawingCanvas.value.loadFromBase64(saved)
      } else {
        alert(`No saved image found under "${key}".`)
      }
    }

    return {
      color,
      brushSize,
      tool,
      drawingCanvas,
      savedKeys,
      refreshSavedKeys,
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
