<script lang="ts">
  import supabase from "$lib/db";
  import { fade, fly, slide } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { onMount } from "svelte";

  $: ({ user } = data);

  const storageLink = 'https://yhddodgxhoeydxlrhmnq.supabase.co/storage/v1/object/public/business-images'

  let submitError: string;

  const categories: string[] = [
    "Beauty",
    "Business",
    "Education",
    "Entertainment",
    "Fitness",
    "Food",
    "Health",
    "Home",
    "Lifestyle",
    "Music",
    "Photography",
    "Religion",
    "Shopping",
    "Sports",
    "Technology",
    "Travel",
    "Other",
  ];

  let name: string = "";
  let description: string = "";
  let address: string = "";
  let city: string = "";
  let state: string = "";
  let zip: string = "";
  let phone: string = "";
  let email: string = "";
  let website: string = "";
  // let Hours: string = "";
  // let Services: string = "";
  let category: string = "";
  // let tags: string = "";
  let socials: object = {};
  // let Payment: string = "";

  let logoFiles: any;
  let coverImageFiles: any;
  let galleryImageFiles: any;
  let galleryImageArray: any[] = [];

  export let data: any;
  $: ({ session, business } = data);

  let step: number = 1;
  let stepError: boolean = false;

  function nextStep() {
    stepError = false;
    if (step === 1) {
      if (name && description && phone && email && category) {
        step = 2;
      } else {
        stepError = true;
      }
    } else if (step === 2) {
      // if (logoFiles && coverImageFiles) {
      submitBusiness();
    }
  }

  async function submitBusiness() {
    try {
      let logoLink: any;
      let coverImageLink: any;
      let galleryLinks: any[] = [];

      {
        const { data, error } = await supabase.storage
          .from("business-images")
          .upload(`${user.id}/logo.png`, logoFiles[0]);

        if (error) {
          console.log(error);
          return;
        }
        logoLink = `${storageLink}/${data?.path}`;
      }
      {
        const { data, error } = await supabase.storage
          .from("business-images")
          .upload(`${user.id}/coverImage.png`, coverImageFiles[0]);

        if (error) {
          console.log(error);
          return;
        }

        coverImageLink = `${storageLink}/${data?.path}`;
      }
      {
        for (let i = 0; i < galleryImageArray.length; i++) {
          const { data, error } = await supabase.storage
            .from("business-images")
            .upload(
              `${user.id}/gallery/${galleryImageArray[i].name}`,
              galleryImageArray[i]
            );

          if (error) console.log(error);

          galleryLinks = [
            ...galleryLinks,
            `${storageLink}/${data?.path}`,
          ];
        }
      }

      const { data, error } = await supabase.from("businesses").insert([
        {
          name,
          description: description,
          address: address,
          city: city,
          state: state,
          zip: zip,
          phone: phone,
          email: email,
          website: website,
          // Hours,
          // Services,
          category: category,
          // tags,
          logo: logoLink,
          coverImage: coverImageLink,
          gallery: galleryLinks,
          socials: socials,
          owner_id: session.user.id,
          // Payment,
        },
      ]);

      if (error) {
        console.log(error);
      } else {
        window.location.href = "/dashboard/business";
      }
    } catch (error) {
      console.log(error);
    }
  }
</script>

{#if stepError}
  <div
    class="bg-red-100
    border border-red-400 text-red-700 rounded fixed top-5 right-5 flex flex-col"
    role="alert"
    transition:fly
  >
    <div class="flex relative w-full h-full">
      <button
        class="w-fit text-red absolute -top-2 -left-2 bg-white rounded-full"
        on:click={() => {
          stepError = false;
        }}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <div class="px-4 py-3">
        <span class="block sm:inline">All fields must be filled out</span>
      </div>
    </div>
  </div>
{/if}

{#if submitError}
  <div
    class="bg-red-100
    border border-red-400 text-red-700 rounded fixed top-5 right-5 flex flex-col"
    role="alert"
    transition:fly
  >
    <div class="flex relative w-full h-full">
      <button
        class="w-fit text-red absolute -top-2 -left-2 bg-white rounded-full"
        on:click={() => {
          submitError = "";
        }}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <div class="px-4 py-3">
        <span class="block sm:inline">{submitError}</span>
      </div>
    </div>
  </div>
{/if}

{#if !business}
  <div class="bg-white rounded-lg p-5 md:w-10/12 md:mx-auto">
    <h1 class="font-semibold text-lg">Create your business</h1>
    <p class="text-sm">Create your business to start accepting bookings</p>
    <div class="flex flex-row gap-2 mt-4">
      <button
        class={`w-full border-b-[2px] pb-2 transition duration-500 rounded-b-[5px] cursor-pointer ${
          step > 0 ? "border-b-emerald-400" : "border-b-slate-100 text-gray-400"
        }`}
        on:click={() => {
          step = 1;
        }}
      >
        Step 1
      </button>
      <button
        class={`w-full border-b-[2px] pb-2 transition duration-500 rounded-b-[5px]  ${
          name && description && address && phone && email && website
            ? "border-b-emerald-400 "
            : "border-b-slate-100 text-gray-400 cursor-not-allowed"
        }`}
        on:click={() => {
          if (name && description && address && phone && email && website) {
            step = 2;
          }
        }}
      >
        Step 2
      </button>
    </div>
  </div>
  {#if step == 1}
    <div
      class="w-full h-fit bg-white rounded-lg mt-4 p-5 overflow-scroll md:w-10/12 md:mx-auto"
      transition:fly={{ x: -200, delay: 250, duration: 300, easing: quintOut }}
    >
      <div class="w-full h-fit bg-white rounded-lg  flex flex-col gap-4">
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">Name *</h1>
          <input
            type="text"
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="Name"
            bind:value={name}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">Description *</h1>
          <textarea
            class="w-full h-20 rounded-lg border border-gray-300 p-2 resize-none"
            placeholder="Description"
            bind:value={description}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">Address *</h1>
          <input
            type="text"
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="Address"
            bind:value={address}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">City *</h1>
          <input
            type="text"
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="City"
            bind:value={city}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">State *</h1>
          <input
            type="text"
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="State"
            bind:value={state}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">Zip *</h1>
          <input
            type="text"
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="Zip"
            bind:value={zip}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">Phone Number *</h1>
          <input
            type="text"
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="Phone Number"
            bind:value={phone}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">Email *</h1>
          <input
            type="text"
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="Email"
            bind:value={email}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">Website</h1>
          <input
            type="text"
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="Website
                "
            bind:value={website}
          />
        </div>
        <div class="w-full h-fit bg-white rounded-lg">
          <h1 class="font-semibold text-base">Category *</h1>
          <select
            class="w-full h-10 rounded-lg border border-gray-300 p-2"
            placeholder="Category"
            bind:value={category}
          >
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>
        <div class="w-full flex flex-row gap-1 text-white">
          <button class="w-full bg-red-400 hover:bg-red-500 p-1 rounded-[5px]"
            >Cancel</button
          >
          <button
            class="w-full bg-emerald-400 hover:bg-emerald-500 p-1 rounded-[5px]"
            on:click={() => nextStep()}>Next</button
          >
        </div>
      </div>
    </div>
  {/if}
  {#if step == 2}
    <div
      class="w-full h-fit bg-white rounded-lg mt-4 p-5 overflow-scroll md:w-10/12 md:mx-auto"
      transition:fly={{ x: -200, delay: 250, duration: 300, easing: quintOut }}
    >
      <h1 class="font-medium text-base">Add Images for your business</h1>
      <div class="w-full h-fit bg-white rounded-lg mt-4">
        <div class="w-full h-fit bg-white rounded-lg  flex flex-col gap-2">
          <div class="w-full h-fit bg-white rounded-lg">
            <h1 class="font-medium text-base">Logo</h1>
            <input
              type="file"
              class="hidden"
              placeholder="Logo"
              id="logoInput"
              accept="image/*"
              bind:files={logoFiles}
            />
            {#if logoFiles}
              <div
                class="w-full h-[256px] border-[1px] flex flex-row items-center justify-center cursor-pointer hover:bg-slate-100 overflow-hidden"
                on:mousedown={() =>
                  document.getElementById("logoInput")?.click()}
              >
                <img
                  src={URL.createObjectURL(logoFiles[0])}
                  alt="company logo"
                  class=""
                />
              </div>
            {:else}
              <div
                class="w-full h-[256px] border-[1px] flex flex-row items-center justify-center cursor-pointer hover:bg-slate-100"
                on:mousedown={() =>
                  document.getElementById("logoInput")?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            {/if}
          </div>
          <div class="w-full h-fit bg-white rounded-lg">
            <h1 class="font-medium text-base">Cover Image</h1>
            <input
              type="file"
              class="hidden"
              placeholder="Cover Image"
              id="coverImageInput"
              accept="image/*"
              bind:files={coverImageFiles}
            />
            {#if coverImageFiles}
              <div
                class="w-full h-[256px] border-[1px] flex flex-row items-center justify-center cursor-pointer hover:bg-slate-100 overflow-hidden"
                on:mousedown={() =>
                  document.getElementById("coverImageInput")?.click()}
              >
                <img
                  src={URL.createObjectURL(coverImageFiles[0])}
                  alt="company logo"
                  class=""
                />
              </div>
            {:else}
              <div
                class="w-full h-[256px] border-[1px] flex flex-row items-center justify-center cursor-pointer hover:bg-slate-100"
                on:mousedown={() =>
                  document.getElementById("coverImageInput")?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            {/if}
          </div>
          <div class="w-full h-fit bg-white rounded-lg">
            <h1 class="font-medium text-base">Additional Images</h1>

            <input
              type="file"
              class="w-full h-10 rounded-lg border border-gray-300 p-2 hidden"
              placeholder="Gallery"
              id="galleryInput"
              accept="image/*"
              multiple
              bind:files={galleryImageFiles}
              on:change={() => {
                galleryImageArray = [
                  ...galleryImageArray,
                  galleryImageFiles[0],
                ];
              }}
            />

            <div class="flex flex-row gap-2">
              <div
                class="w-[128px] h-[128px] border-[1px] flex flex-row items-center justify-center cursor-pointer hover:bg-slate-100 overflow-hidden"
                on:mousedown={() =>
                  document.getElementById("galleryInput")?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="flex flex-row gap-2">
                {#each galleryImageArray as image (image)}
                  <div class="w-[128px] h-[128px] bg-white rounded-lg">
                    <img src={URL.createObjectURL(image)} alt="preview" />
                  </div>
                {/each}
              </div>
            </div>
          </div>
          <div class="w-full flex flex-row">
            <button class="w-full">Cancel</button>
            <button class="w-full" on:click={() => nextStep()}>Sumbit</button>
          </div>
        </div>
      </div>
    </div>
  {/if}
{:else}
  <div>
    <h1>You already have a business</h1>
  </div>
{/if}
