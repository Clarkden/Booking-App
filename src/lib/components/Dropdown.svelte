<script lang="ts">
  export let data: any = [{ title: "Home", destination: "/" }];
  let expanded: boolean = false;
</script>

<div class="relative" on:blur={() => expanded=false}>
  <button
    on:click={() => {
      expanded = !expanded;
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="black"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  </button>
  {#if expanded}
  <div
    class="absolute top-6 right-0 bg-white rounded-lg p-2 drop-shadow-lg"
  >
    <div class="flex flex-col gap-2">
      {#each data as item}
        <a href={item.destination} class="text-black text-sm hover:text-emerald-400">{item.title}</a>
      {/each}
    </div>
  </div>
  {/if}
</div>
