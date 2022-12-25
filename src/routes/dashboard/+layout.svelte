<script lang="ts">
  import { invalidate } from "$app/navigation";
  import supabase from "$lib/db";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { fly, fade } from "svelte/transition";
  import SidebarItem from "$lib/components/SidebarItem.svelte";

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      invalidate("supabase:auth");
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  let expandedNavbar: boolean = false;
</script>

<div class=" flex flex-col md:flex-row relative p-5 md:p-0">
  <aside
    class="hidden md:flex flex-col items-start justify-start bg-white w-[100px] border-r-[1px] drop-shadow-sm h-full p-5"
  >
    <div class="flex items-center justify-center w-full">
      <a
        href="/"
        class="uppercase font-bold text-4xl text-emerald-400 text-center mb-8"
      >
        B
    </a>
    </div>
    <ul class="h-[90vh] flex flex-col gap-5 w-full">
      <SidebarItem
        data={{
          title: "Home",
          icon: `<svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>`,
          destination: "/dashboard",
        }}
      />
      <SidebarItem
        data={{
          title: "Profile",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
</svg>
`,
          destination: "/dashboard/profile",
        }}
      />
      <SidebarItem
        data={{
          title: "Business",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
</svg>
`,
          destination: "/dashboard/business",
        }}
      />
      <SidebarItem
        data={{
          title: "Logout",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
</svg>

`,
          destination: "/auth/logout",
        }}
      />
    </ul>
  </aside>
  <div class="flex md:hidden flex-col mb-4 absolute z-20">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      on:click={() => (expandedNavbar = !expandedNavbar)}
      on:keyup={() => {}}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </div>
  {#if expandedNavbar}
    <div
      class="flex flex-col items-start justify-start  absolute top-0 left-0 h-screen min-w-[100vw] z-20  md:hidden gap-1 border-b-[1px] bg-black/25"
      transition:fade={{ duration: 200 }}
    >
      <div
        class="flex flex-col w-[70vh] h-full items-start justify-start bg-white p-5"
        transition:fly={{ x: -400 }}
      >
        <div class="flex flex-row items-center justify-between w-full">
          <a href="/" class="font-bold text-2xl text-emerald-400">Booking App</a
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="red"
            on:click={() => (expandedNavbar = !expandedNavbar)}
            on:keyup={() => {}}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div class="flex flex-col gap-2">
          <a
            href="/dashboard"
            on:click={() => (expandedNavbar = !expandedNavbar)}
            class="hover:text-emerald-400">Dashboard</a
          >
          <a
            href="/dashboard/profile"
            on:click={() => (expandedNavbar = !expandedNavbar)}
            class="hover:text-emerald-400">Profile</a
          >
          <a
            href="/dashboard/business"
            on:click={() => (expandedNavbar = !expandedNavbar)}
            class="hover:text-emerald-400">Business</a
          >
          <button
            on:click={() => {
              supabase.auth.signOut();
              expandedNavbar = !expandedNavbar;
            }}
            class="hover:text-emerald-400 w-fit"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  {/if}
  <div class="w-full md:p-5 h-fit md:h-screen md:overflow-scroll mt-10 md:mt-0">
    <slot />
  </div>
</div>
