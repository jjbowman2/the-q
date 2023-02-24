<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<div class="container px-4 max-w-5xl mx-auto">
	<Header />
	<slot />
</div>
