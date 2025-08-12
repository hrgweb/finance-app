<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import type { Snippet } from 'svelte';

	let {
		label,
		labelFor,
		labelClass,
		children,
		class: className
	} = $props<{
		label: string;
		labelFor: string;
		labelClass?: string;
		children?: Snippet;
		class?: string;
	}>();
</script>

<div class="flex w-full flex-col gap-1 px-[24px] {className}">
	<Label class="text-[14px] {labelClass}" for={labelFor}>{label}</Label>
	{@render children?.()}
</div>
