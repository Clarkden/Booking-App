<script lang="ts">
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  export let check: any;

  const dispatch = createEventDispatcher();

  function toggle() {
    check = !check;
    dispatch("toggle", check);
  }
</script>

<div
  on:mousedown={() => toggle()}
  class={`h-[20px] w-[40px] flex flex-row rounded-full p-[2px] cursor-pointer ${
    check ? "bg-green-400 justify-end" : "bg-red-400 justify-start"
  }`}
>
  <div class="h-full w-1/2 bg-gray-100 rounded-full" />
</div>
