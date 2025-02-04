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
    </div>
</template>