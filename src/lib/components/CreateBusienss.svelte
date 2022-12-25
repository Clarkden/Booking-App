<script lang="ts">
  import { createEventDispatcher } from "svelte";


    const dispatch = createEventDispatcher()

    function createBusiness() {
        dispatch('create business')
    }
</script>

<h1>Business</h1>
<button on:click={createBusiness} class="bg-emerald-300">Create Business</button>