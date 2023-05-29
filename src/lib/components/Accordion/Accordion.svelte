<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { AccordionContext } from './types';
	let expanded = writable(false);

	// Function to toggle expansion
	function toggle() {
		expanded.update((value) => !value);
	}

	let context: AccordionContext = {
		expanded,
		toggle
	};
	setContext('accordion', context);
</script>

<slot />
