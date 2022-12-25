<script lang="ts">
  import { fade, fly } from "svelte/transition";

  export let data: any;
  $: ({ title, icon, destination } = data);
  let toolTip: boolean = false;
</script>

<li
  class="border-[1px] border-transparent hover:border-white bg-gradient-to-l from-emerald-50 to-sky-50 w-full rounded-lg drop-shadow-sm hover:bg-gradient-to-r hover:from-emerald-100 hover:to-sky-100 transition-all duration-500 h-[35px] ease-out flex items-center justify-center relative"
  on:mouseenter={() => (toolTip = true)}
  on:mouseleave={() => (toolTip = false)}
>
  {#if toolTip}
    <div
      class="absolute top-0 left-16 w-full h-full flex items-center justify-center"
      transition:fade={{ duration: 100 }}
    >
      <div
        class="flex flex-col items-center justify-center bg-white p-2 rounded-lg border-[1px] border-emerald-500"
        transition:fly={{ x: -50 }}
      >
        <p class="text-sm text-emerald-500">{title}</p>
      </div>
    </div>
  {/if}
  <a
    href={destination}
    class="w-full flex flex-row-reverse items-center justify-center gap-2"
    >{@html icon}
  </a>
</li>
