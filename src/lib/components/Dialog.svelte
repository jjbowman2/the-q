<script lang="ts">
	import { clickOutside } from '$lib/utils/clickOutside';
	import { fade, fly } from 'svelte/transition';

	export let open: boolean;
	export let onClose: () => void;
</script>

{#if open}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center pt-28 items-start"
	>
		<div
			transition:fly={{ x: 0, y: 50, duration: 200 }}
			class="bg-white rounded-lg shadow-lg"
			use:clickOutside
			on:clickoutside={onClose}
		>
			<slot />
		</div>
	</div>
{/if}
