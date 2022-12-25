<script lang="ts">
  import supabase from "$lib/db";
  export let data: any;

  $: ({ session } = data);

  let expandedNavbar: boolean = false;
  let dropdown: boolean = false;
</script>

<nav class="min-h-[64px] h-fit flex flex-col">
  <div class="flex flex-row items-center justify-between">
    <div class="w-[300px]">
      <a href="/" class="uppercase font-bold text-4xl text-emerald-400 w-fit"
        >Booking App</a
      >
    </div>
    <div />
    <div class="md:w-[70%] lg:w-[60%] hidden md:block">
      <div
        class="flex flex-row items-center rounded-lg border-[1px] overflow-hidden h-[32px] group"
      >
        <input
          type="text"
          class="w-full rounded-lg px-5 outline-none"
          placeholder="Search for a business"
        />
        <div
          class="w-[32px] h-full bg-black hover:bg-emerald-400 flex flex-row items-center justify-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5   h-5 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div
      class="w-[300px] hidden  md:flex flex-row justify-end items-center gap-4 relative"
    >
      {#if session}
        <a href="/dashboard" class="hover:text-emerald-400">Dashboard</a>
      {:else}
        <a
          href="/auth"
          class="border-[1px] border-emerald-400 bg-emerald-400 text-white hover:bg-emerald-300/50 hover:text-black px-5 p-1 rounded-[5px]"
          >Login</a
        >
      {/if}
      <div class="rounded-full w-[32px] h-[32px]">
        {#if session}
          <img
            src={session.user.user_metadata.avatar_url}
            alt="Profile"
            class="rounded-full w-[32px] h-[32px] cursor-pointer"
            on:click={() => (dropdown = !dropdown)}
            on:keyup={() => {}}
          />
        {/if}
      </div>
      {#if dropdown}
        <div class="absolute w-fit h-fit top-10">
          <div
            on:blur={() => (dropdown = false)}
            class="bg-white drop-shadow-lg rounded-lg shadow-lg w-full h-full"
          >
            <div class="flex flex-col gap-2 p-2" />
            <a href="/dashboard/profile" class="hover:text-emerald-400"
              >Profile</a
            >
            <a href="/dashboard/settings" class="hover:text-emerald-400"
              >Settings</a
            >
            <a
              href="/auth"
              on:click={async () => {
                await supabase.auth.signOut();
                dropdown = false;
              }}
              class="hover:text-emerald-400">Logout</a
            >
          </div>
        </div>
      {/if}
    </div>
    <div class="md:hidden relative">
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
  </div>
  {#if expandedNavbar}
    {#if session}
      <div
        class=" w-full h-fit flex flex-col gap-1 border-b-[1px]"
      >
        <a href="/dashboard" class="hover:text-emerald-400">Dashboard</a>
        <a href="/dashboard/profile" class="hover:text-emerald-400">Profile</a>
        <a href="/dashboard/settings" class="hover:text-emerald-400">Settings</a
        >
        <a
          href="/auth"
          on:click={async () => {
            await supabase.auth.signOut();
            dropdown = false;
          }}
          class="hover:text-emerald-400">Logout</a
        >
      </div>
    {:else}
      <div class=" w-full h-fit flex flex-col gap-1 border-b-[1px]">
        <a
          href="/auth"
          class="border-[1px] border-emerald-400 bg-emerald-400 text-white hover:bg-emerald-300/50 hover:text-black px-5 p-1 rounded-[5px]"
          >Login</a
        >
      </div>
    {/if}
  {/if}
</nav>
