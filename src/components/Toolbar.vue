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

        <!-- Input for filename -->
        <input
            type="text"
            v-model="filename"
            placeholder="Drawing name"
            list="savedDrawingsList"
            style="width: 100px;"
            title="Enter a name for your drawing"
        />

        <!-- This datalist references savedKeys from the parent -->
        <datalist id="savedDrawingsList">
            <option
                v-for="key in savedKeys"
                :key="key"
                :value="key.replace('FremaDraw_', '')"
            />
        </datalist>

        <!-- Tools -->
        <button
            :class="{ active: tool === 'pencil'}"
            @click="$emit('update:tool', 'pencil')"
            title="Pencil"
        >
            ✏️
        </button>
        <button
            :class="{ active: tool === 'eraser'}"
            @click="$emit('update:tool', 'eraser')"
            title="Eraser"
        >
            🧽
        </button>
        <button @click="emitSave" title="Save to local storage">
            💾 
        </button>
        <button @click="emitLoad" title="Load from local storage">
            📂 
        </button>
        <button @click="$emit('save-png')" title="Download as PNG">
            🖼️
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { PropType } from 'vue'

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

        // Receive the savedKeys array from App.vue
        savedKeys: {
            type: Array as PropType<string[]>,
            default: () => [],
        },

    },
    emits: ['update:color', 'update:brushSize', 'update:tool','save-png', 'save-storage', 'load-storage'],
    setup(_, { emit }) {
        const filename = ref('')

        const handleColorChange = (e: Event) => {
            const newColor = (e.target as HTMLInputElement).value
            emit('update:color', newColor)
        }

        const handleBrushSizeChange = (e: Event) => {
            const newBrushSize = parseInt((e.target as HTMLInputElement).value, 10)
            emit('update:brushSize', newBrushSize)
        }

        // Emit the filename along with the event
        const emitSave = () => {
            emit('save-storage', filename.value)
        }
        const emitLoad = () => {
            emit('load-storage', filename.value)
        }

        return {
            filename,
            handleColorChange,
            handleBrushSizeChange,
            emitSave,
            emitLoad,
        }
    },
})
</script>

<style scoped>
.toolbar {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    margin-bottom: 1rem;
}

button {
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    font-size: 1.2rem; /* enlarge emoji slightly */
}

button.active {
    background-color: #ddd;
    border-radius: 4px;
}
</style>