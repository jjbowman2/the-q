declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:clickoutside'?: (event: MouseEvent) => void;
	}
}
