<script lang="ts">
	import type { LayoutData } from '../../routes/$types';

	export let data: LayoutData;
	const { session, supabase } = data;
	const handleSignIn = () => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: window.location.href }
		});
	};
	const handleSignOut = () => {
		supabase.auth.signOut();
	};
</script>

<header class="h-16 py-4 flex justify-between items-center">
	<a href="/"><img src="/logo.svg" alt="The Q Logo" /></a>
	{#if session}
		<button type="button" class="text-zinc-500 hover:text-zinc-600" on:click={handleSignOut}
			>{session.user.user_metadata.full_name}</button
		>
	{:else}
		<button type="button" class="text-zinc-500 hover:text-zinc-600" on:click={handleSignIn}
			>Login</button
		>
	{/if}
</header>
