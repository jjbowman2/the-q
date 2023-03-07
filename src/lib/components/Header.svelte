<script lang="ts">
	import { autoUpdate, computePosition, offset } from '@floating-ui/dom';
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from '../../routes/$types';
	import { clickOutside } from '../utils/clickOutside';
	let signOutButton: HTMLButtonElement;
	let popover: HTMLDivElement;
	let autoupdate: () => void | undefined;
	onMount(() => {
		autoupdate = autoUpdate(signOutButton, popover, async () => {
			const { x, y } = await computePosition(signOutButton, popover, {
				placement: 'bottom-end',
				middleware: [offset({ mainAxis: 4, crossAxis: 0 })]
			});
			popover.style.left = `${x}px`;
			popover.style.top = `${y}px`;
		});
	});
	onDestroy(() => {
		autoupdate && autoupdate();
	});

	export let data: LayoutData;
	$: ({ session, supabase } = data);
	const handleSignIn = () => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: window.location.href }
		});
	};
	const togglePopover = async () => {
		if (popover.style.opacity === '1') {
			hidePopover();
			return;
		}
		popover.style.opacity = '1';
		popover.style.pointerEvents = 'all';
		popover.style.transform = 'translateY(0)';
	};
	const hidePopover = () => {
		popover.style.opacity = '0';
		popover.style.pointerEvents = 'none';
		popover.style.transform = 'translateY(8px)';
	};
	const handleSignOut = () => {
		supabase.auth.signOut();
	};
</script>

<header class="h-16 py-4 flex justify-between items-center">
	<a href="/"><img src="/logo.svg" alt="The Q Logo" /></a>
	{#if session}
		<span use:clickOutside on:clickoutside={hidePopover}>
			<button
				bind:this={signOutButton}
				type="button"
				class="text-zinc-500 hover:text-zinc-600"
				on:click={togglePopover}
				>{session.user.user_metadata.name ?? session.user.user_metadata.full_name}</button
			>
			<div
				bind:this={popover}
				role="tooltip"
				class="w-max absolute top-0 left-0 rounded shadow transition-all opacity-0 translate-y-2 bg-white"
			>
				<button
					type="button"
					on:click={handleSignOut}
					class="px-12 py-4 hover:bg-gray-50 font-semibold text-red-400">Logout</button
				>
			</div>
		</span>
	{:else}
		<button type="button" class="text-zinc-500 hover:text-zinc-600" on:click={handleSignIn}
			>Login</button
		>
	{/if}
</header>
