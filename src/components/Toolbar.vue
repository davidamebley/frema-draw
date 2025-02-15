<template>
    <div class="toolbar">
        <label for="colorPicker">Color:</label>
        <input
            id="colorPicker"
            type="color"
            :value="color"
            @input="handleColorChange"
        />

        <label for="brushSize">Brush Size:</label>
        <input
            id="brushSize"
            type="range"
            min="1"
            max="50"
            :value="brushSize"
            @input="handleBrushSizeChange"
        />

        <button
            :class="{ active: tool === 'pencil'}"
            @click="$emit('update:tool', 'pencil')"
        >
            Pencil
        </button>
        <button
            :class="{ active: tool === 'eraser'}"
            @click="$emit('update:tool', 'eraser')"
        >
            Eraser
        </button>
        <button @click="$emit('load-storage')">
            Load from Local
        </button>
        <button @click="$emit('save-storage')">
            Save to Local
        </button>
        <button @click="$emit('save-png')">
            Save PNG
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Toolbar',
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
        },
    },
    emits: ['update:color', 'update:brushSize', 'update:tool','save-png', 'save-storage', 'load-storage'],
    setup(props, { emit }) {
        const handleColorChange = (e: Event) => {
            const newColor = (e.target as HTMLInputElement).value
            emit('update:color', newColor)
        }

        const handleBrushSizeChange = (e: Event) => {
            const newBrushSize = parseInt((e.target as HTMLInputElement).value, 10)
            emit('update:brushSize', newBrushSize)
        }

        return {
            handleColorChange,
            handleBrushSizeChange,
        }
    },
})
</script>

<style scoped>
.toolbar {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

button {
    padding: 0.5rem;
    cursor: pointer;
}

button.active {
    background-color: #ddd;
}
</style>