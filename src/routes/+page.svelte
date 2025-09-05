<script lang="ts">
  import CounterList from '$lib/components/CounterList.svelte';
</script>

<CounterList />

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
    height: 100vh;
    overflow: hidden;
    background: #2f2f2f !important;
  }
  
  :global(*) {
    box-sizing: border-box;
  }

  :global(#app) {
    background: #2f2f2f !important;
  }
</style>
