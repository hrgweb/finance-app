<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { IItem } from '$lib/types';

	let {
		items,
		value = $bindable<string>(),
		onchange,
		class: className,
		triggerStr
	} = $props<{
		items: IItem[];
		value?: string;
		onchange?: (e: Event) => void;
		class?: string;
		triggerStr: string;
	}>();

	const triggerContent = $derived(items.find((i: IItem) => i.value === value)?.label ?? triggerStr);
</script>

<Select.Root type="single" bind:value onValueChange={onchange}>
	<Select.Trigger class="w-full {className}">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		{#each items as item (item.id)}
			<Select.Item value={item.value} label={item.label}>
				{item.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
