<script lang="ts">
  import type { Counter as CounterType } from '../database.js';
  import { getAllCounters, createCounter } from '../database.js';
  import Counter from './Counter.svelte';
  import { getCurrentWindow } from '@tauri-apps/api/window';
  
  let counters = $state<CounterType[]>([]);
  let isLoading = $state(false);
  let showNewForm = $state(false);
  let newCounterName = $state('');
  let newCounterInput: HTMLInputElement;
  
  
  async function loadCounters() {
    isLoading = true;
    try {
      counters = await getAllCounters();
    } catch (error) {
      console.error('Failed to load counters:', error);
    } finally {
      isLoading = false;
    }
  }
  
  async function handleCreateCounter() {
    if (!newCounterName.trim()) return;
    
    isLoading = true;
    try {
      const newCounter = await createCounter({ name: newCounterName.trim() });
      counters = [newCounter, ...counters];
      newCounterName = '';
      showNewForm = false;
    } catch (error) {
      console.error('Failed to create counter:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function handleCounterUpdate(updatedCounter: CounterType) {
    counters = counters.map(c => c.id === updatedCounter.id ? updatedCounter : c);
  }
  
  function handleCounterDelete(deletedId: number) {
    counters = counters.filter(c => c.id !== deletedId);
  }
  
  function handleNewFormCancel() {
    showNewForm = false;
    newCounterName = '';
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleCreateCounter();
    } else if (event.key === 'Escape') {
      handleNewFormCancel();
    }
  }
  
  function handleGlobalKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
      event.preventDefault();
      if (!showNewForm && !isLoading) {
        showNewForm = true;
        // Focus input after it's rendered
        setTimeout(() => {
          newCounterInput?.focus();
        }, 0);
      }
    }
  }
  
  // Load counters on mount
  $effect(() => {
    loadCounters();
  });
  
  // Add global keyboard shortcut listener
  $effect(() => {
    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  });
</script>

<div class="counter-list">
  
  
  <header class="header">
    <h1 class="app-title">count</h1>
  </header>
  
  {#if showNewForm}
    <div class="new-counter-form">
      <input
        bind:this={newCounterInput}
        class="new-counter-input"
        type="text"
        placeholder="Counter name..."
        bind:value={newCounterName}
        onkeydown={handleKeydown}
        onblur={handleNewFormCancel}
      />
    </div>
  {/if}
  
  {#if isLoading && counters.length === 0}
    <div class="loading">Loading counters...</div>
  {:else if counters.length === 0}
    <div class="empty-state">
      <p class="empty-hint">cmd+n</p>
    </div>
  {:else}
    <div class="counters-grid">
      {#each counters as counter (counter.id)}
        <Counter 
          {counter}
          onUpdate={handleCounterUpdate}
          onDelete={handleCounterDelete}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .counter-list {
    height: 100vh;
    background: #2f2f2f;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    border-radius: 0 !important;
  }
  
  :global(*) {
    border-radius: 0 !important;
  }
  
  :global(body) {
    background: #2f2f2f;
  }
  
  :global(html) {
    background: #2f2f2f;
  }

  
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 16px 8px;
    flex-shrink: 0;
    background: transparent;
  }
  
  .app-title {
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.1px;
    cursor: move;
  }
  
  
  .new-counter-form {
    padding: 8px 16px 12px;
    flex-shrink: 0;
    background: transparent;
  }
  
  .new-counter-input {
    width: 100%;
    max-width: 200px;
    padding: 8px 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-size: 12px;
    background: rgba(0, 0, 0, 0.3);
    outline: none;
    font-family: inherit;
    color: #ffffff;
    border-radius: 0;
  }
  
  .new-counter-input:focus {
    border-color: #ffffff;
    background: rgba(0, 0, 0, 0.4);
  }
  
  .loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
    font-size: 14px;
  }
  
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .empty-message {
    font-size: 16px;
    font-weight: 400;
    color: #cccccc;
    margin: 0 0 4px;
  }
  
  .empty-hint {
    font-size: 12px;
    color: #999999;
    margin: 0;
  }
  
  .counters-grid {
    flex: 1;
    padding: 12px;
    display: grid;
    gap: 12px;
    align-content: start;
    overflow-y: auto;
    grid-template-columns: 1fr;
  }
  
  /* Context-aware grid sizing */
  @media (min-width: 400px) {
    .counters-grid {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }
  
  @media (min-width: 600px) {
    .counters-grid {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
  }
  
  @media (min-width: 800px) {
    .counters-grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .counter-list {
      background: #111111;
    }
    
    .app-title {
      color: #ffffff;
    }
    
    .empty-message {
      color: #cccccc;
    }
    
    .empty-hint {
      color: #666666;
    }
    
    .loading {
      color: #666666;
    }
    
    .new-counter-input {
      background: #2a2a2a;
      color: #ffffff;
      border-color: #007aff;
    }
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
      text-align: center;
    }
    
    .counters-grid {
      grid-template-columns: 1fr;
      padding: 16px 8px;
    }
  }
</style>