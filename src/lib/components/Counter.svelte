<script lang="ts">
  import type { Counter } from '../database.js';
  import { incrementCounter, updateCounter, deleteCounter } from '../database.js';
  
  interface Props {
    counter: Counter;
    onUpdate?: (counter: Counter) => void;
    onDelete?: (id: number) => void;
  }
  
  let { counter, onUpdate, onDelete }: Props = $props();
  
  let isEditing = $state(false);
  let editName = $state(counter.name);
  let isLoading = $state(false);
  
  async function handleIncrement() {
    if (isLoading) return;
    isLoading = true;
    try {
      const updatedCounter = await incrementCounter(counter.id, 1);
      onUpdate?.(updatedCounter);
    } catch (error) {
      console.error('Failed to increment counter:', error);
    } finally {
      isLoading = false;
    }
  }
  
  async function handleDecrement() {
    if (isLoading) return;
    isLoading = true;
    try {
      const updatedCounter = await incrementCounter(counter.id, -1);
      onUpdate?.(updatedCounter);
    } catch (error) {
      console.error('Failed to decrement counter:', error);
    } finally {
      isLoading = false;
    }
  }
  
  async function handleNameSave() {
    if (editName.trim() === counter.name || !editName.trim()) {
      isEditing = false;
      editName = counter.name;
      return;
    }
    
    isLoading = true;
    try {
      const updatedCounter = await updateCounter({
        id: counter.id,
        name: editName.trim()
      });
      onUpdate?.(updatedCounter);
      isEditing = false;
    } catch (error) {
      console.error('Failed to update counter name:', error);
      editName = counter.name;
      isEditing = false;
    } finally {
      isLoading = false;
    }
  }
  
  function handleNameEdit() {
    isEditing = true;
    editName = counter.name;
  }
  
  function handleNameCancel() {
    isEditing = false;
    editName = counter.name;
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleNameSave();
    } else if (event.key === 'Escape') {
      handleNameCancel();
    }
  }
  
  let showDeleteConfirm = $state(false);
  
  function startDelete() {
    showDeleteConfirm = true;
  }
  
  async function confirmDelete() {
    showDeleteConfirm = false;
    isLoading = true;
    try {
      await deleteCounter(counter.id);
      onDelete?.(counter.id);
    } catch (error) {
      console.error('Failed to delete counter:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function cancelDelete() {
    showDeleteConfirm = false;
  }
</script>

<div class="counter" class:loading={isLoading}>
  <div class="counter-header">
    {#if isEditing}
      <input
        class="counter-name-input"
        type="text"
        bind:value={editName}
        onkeydown={handleKeydown}
        onblur={handleNameSave}
      />
    {:else}
      <button class="counter-name" onclick={handleNameEdit} title="Click to edit name">
        {counter.name}
      </button>
    {/if}
    
    {#if showDeleteConfirm}
      <div class="delete-confirm">
        <button 
          class="confirm-button confirm-yes"
          onclick={confirmDelete}
          disabled={isLoading}
          title="Confirm delete"
        >
          ✓
        </button>
        <button 
          class="confirm-button confirm-no"
          onclick={cancelDelete}
          disabled={isLoading}
          title="Cancel delete"
        >
          ×
        </button>
      </div>
    {:else}
      <button 
        class="delete-button"
        onclick={startDelete}
        disabled={isLoading}
        title="Delete counter"
      >
        ×
      </button>
    {/if}
  </div>
  
  <div class="counter-value">
    {counter.value.toLocaleString()}
  </div>
  
  <div class="counter-controls">
    <button 
      class="counter-button decrement"
      onclick={handleDecrement}
      disabled={isLoading}
      title="Decrease by 1"
    >
      −
    </button>
    
    <button 
      class="counter-button increment"
      onclick={handleIncrement}
      disabled={isLoading}
      title="Increase by 1"
    >
      +
    </button>
  </div>
  
  <div class="counter-meta">
    Updated {new Date(counter.updated_at).toLocaleDateString()}
  </div>
</div>

<style>
  .counter {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px 14px 14px;
    width: 100%;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
    position: relative;
    display: flex;
    flex-direction: column;
    height: fit-content;
    border-radius: 0;
  }
  
  .counter:hover {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .counter.loading {
    opacity: 0.6;
    pointer-events: none;
  }
  
  .counter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  
  .counter-name {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    margin: 0;
    cursor: pointer;
    flex: 1;
    padding: 4px 0;
    transition: background-color 0.2s ease;
    background: none;
    border: none;
    text-align: left;
    font-family: inherit;
    letter-spacing: -0.1px;
  }
  
  .counter-name:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0;
  }
  
  .counter-name-input {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 4px 6px;
    background: rgba(0, 0, 0, 0.4);
    outline: none;
    width: 100%;
    font-family: inherit;
    letter-spacing: -0.1px;
    border-radius: 0;
  }
  
  .delete-button {
    background: none;
    border: none;
    color: #999999;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 0;
    transition: all 0.2s ease;
    margin-left: 8px;
  }
  
  .delete-button:hover {
    color: #ff3b30;
    background-color: #fff5f5;
  }
  
  .delete-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .delete-confirm {
    display: flex;
    gap: 4px;
    margin-left: 8px;
  }
  
  .confirm-button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 0;
    transition: all 0.2s ease;
    font-family: inherit;
  }
  
  .confirm-yes {
    color: #34c759;
  }
  
  .confirm-yes:hover {
    background-color: #e8f5e8;
  }
  
  .confirm-no {
    color: #ff3b30;
  }
  
  .confirm-no:hover {
    background-color: #fff5f5;
  }
  
  .confirm-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .counter-value {
    font-size: 36px;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    margin: 16px 0;
    letter-spacing: -1px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    line-height: 1;
  }
  
  .counter-controls {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
  }
  
  .counter-button {
    flex: 1;
    height: 36px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font-size: 18px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
    border-radius: 0;
  }
  
  .counter-button:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .counter-button:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.95);
  }
  
  .counter-button.increment:hover {
    background: rgba(34, 197, 94, 0.2);
    border-color: #22c55e;
    color: #22c55e;
  }
  
  .counter-button.decrement:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
    color: #ef4444;
  }
  
  .counter-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  .counter-meta {
    font-size: 9px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    font-family: inherit;
    font-weight: 400;
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .counter {
      background: #1e1e1e;
      border-color: #333333;
      color: #ffffff;
    }
    
    .counter-name,
    .counter-value {
      color: #ffffff;
    }
    
    .counter-name:hover {
      background-color: #2a2a2a;
    }
    
    .counter-name-input {
      background: #2a2a2a;
      border-color: #007aff;
      color: #ffffff;
    }
    
    .counter-button {
      background: #2a2a2a;
      border-color: #444444;
      color: #ffffff;
    }
    
    .counter-button:hover {
      background: #333333;
      border-color: #555555;
    }
    
    .counter-button:active {
      background: #3a3a3a;
    }
    
    .counter-button.increment:hover {
      background: #1a2a3a;
      border-color: #007aff;
      color: #007aff;
    }
    
    .counter-button.decrement:hover {
      background: #3a2a1a;
      border-color: #ff9500;
      color: #ff9500;
    }
  }
</style>