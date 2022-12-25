<script lang="ts">
  import supabase from "$lib/db";
  import { page } from "$app/stores";
  import { goto, invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { stringify } from "postcss";
  import Navbar from "../../lib/components/Navbar.svelte";

  let loading: boolean = false;
  export let data: any;
  $: ({ user, businesses } = data);
</script>

<div>
  {#if loading}
    <p>Loading...</p>
  {:else}
    <div class="flex flex-col h-full w-full">
      <Navbar {data} {supabase} />
      <div class="flex flex-row overflow-scroll w-full gap-4 my-6">
        {#each businesses as business (business.id)}
          <a href={`business/${business.id}`} class="bg-white group">
            <div
              class="border-slate-200 group-hover:border-emerald-300 border-[2px] w-60 h-[350px] flex flex-col items-start"
            >
              <div class="w-full h-48 overflow-hidden relative border-b-[1px] group-hover:border-b-[2px] group-hover:border-emerald-400">
                <img
                  src={business.mainImage}
                  alt={business.name}
                  class="object-cover"
                />
              </div>
              <div class="p-1 h-[45%] flex flex-col justify-between">
                <h1>{business.title}</h1>
                <div>
                  <p class="">
                    {business.description}
                  </p>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>
