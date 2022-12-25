<script lang="ts">
    import supabase from '$lib/db'
  import type { AuthSession } from '@supabase/supabase-js';
  import { onMount } from 'svelte';
  
    let loading = false
    let email: string
    let password: string

    export let session: AuthSession;
  
    const handleLogin = async () => {
      try {
        loading = true
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        loading = false
        console.log('Supabase auth response', supabase.auth)
      }
    }

    const loginWithGoogle = async () => {
      try {
        loading = true
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
        if (error) throw error
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        loading = false
        console.log('Supabase auth response', supabase.auth)
      }
    }

    console.log(session)

  </script>
  
  <form class="row flex-center flex" on:submit|preventDefault="{handleLogin}">
    <div class="col-6 form-widget">
      <h1 class="header">Supabase + SvelteKit</h1>
      <button on:click|preventDefault={loginWithGoogle}>Sign in with Google</button>
      <div>
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value="{email}"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value="{password}"
          placeholder="Enter your password"
          required
        />
      </div>
      <div class="flex-center">
        <button class="button" type="submit" disabled="{loading}">
          {#if loading}
            <span class="spinner" />
          {:else}
            Sign in
          {/if}
        </button>
    </div>
  </form>