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
    />

    <!-- Canvas -->
     <Canvas
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

    return {
      color,
      brushSize,
      tool,
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
