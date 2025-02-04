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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
})
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 2rem;
  text-align: center;
}
</style>
