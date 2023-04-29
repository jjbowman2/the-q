<script lang="ts">
	import type { LayoutData } from '../../routes/$types';
	import SignOut from './SignOut.svelte';

	export let data: LayoutData;
	$: ({ session, supabase } = data);

	const handleSignIn = () => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: window.location.href }
		});
	};
</script>

<header class="container px-4 max-w-5xl mx-auto h-16 py-4 flex justify-between items-center">
	<a href="/"><img src="/logo.svg" alt="The Q Logo" /></a>
	{#if session}
		<SignOut {data} />
	{:else}
		<button type="button" class="text-zinc-500 hover:text-zinc-600" on:click={handleSignIn}
			>Login</button
		>
	{/if}
</header>
