<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import InputWrapper from '$lib/shared/input-wrapper.svelte';
	import { page } from '$app/state';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { AMOUNT_POSITIVE, PERCENT_STR } from '$lib/const.js';

	let { data } = $props();

	const { form, errors, message, enhance } = superForm(data.form);

	function calcDeduction({
		grossSalary,
		percentageDeduction
	}: {
		grossSalary: number;
		percentageDeduction: number;
	}): number {
		return (grossSalary * percentageDeduction) / 100;
	}

	function getPerHourRate(grossSalary: number): number {
		return grossSalary / 30 / 8; // 30=days, 8=hrs
	}

	function calcAddition({
		grossSalary,
		percentage
	}: {
		grossSalary: number;
		percentage: number;
	}): number {
		return (getPerHourRate(grossSalary) * percentage) / 100;
	}

	// function computeOvertime({ grossSalary, hrs }: { grossSalary: number; hrs: number }): number {
	// 	return calcAddition({
	// 		grossSalary: $form.grossSalary,
	// 		percentage
	// 	})
	// }

	const COMPUTE_RENDER = true;

	$inspect(data);
</script>

<SuperDebug data={$form} />

{#snippet compute(amount: number, show = true, positive = true)}
	<span class="w-[200px] pl-3">
		{#if show}
			{#if !positive}
				-
			{/if}
			<span>&#8369;</span>
			{amount.toFixed(2)}
		{/if}
	</span>
{/snippet}

<div class="p-6">
	<h2 class="pb-6 text-center text-2xl font-semibold">Payroll</h2>

	<form class="space-y-6" action="">
		<InputWrapper
			label="Gross Salary"
			labelFor="gross_salary"
			class="flex flex-row px-0!"
			labelClass="w-[200px] max-w-[200px]"
		>
			<Input type="number" id="gross_salary" class="w-full" bind:value={$form.grossSalary} />
		</InputWrapper>

		<!-- <InputWrapper
			label="Night Differential"
			labelFor="night_diff"
			class="flex flex-row px-0!"
			labelClass="w-[200px] max-w-[200px]"
		>
			<Input type="number" id="night_diff" class="w-full" bind:value={$form.nightDiff} />
		</InputWrapper> -->

		<!-- Overtime -->
		<div class="flex flex-col gap-3">
			<h3 class="text-md font-semibold">Overtime</h3>
			<InputWrapper
				label={`Percentage ${PERCENT_STR}`}
				labelFor="ot_percentage"
				class="flex flex-row px-0!"
				labelClass="w-[200px] max-w-[200px]"
			>
				<Input type="number" id="ot_percentage" class="w-full" bind:value={$form.otPercentage} />
				{@render compute(
					calcAddition({
						grossSalary: $form.grossSalary,
						percentage: $form.otPercentage
					})
				)}
			</InputWrapper>
			<InputWrapper
				label="Hours"
				labelFor="ot_hrs"
				class="flex flex-row px-0!"
				labelClass="w-[200px] max-w-[200px]"
			>
				<Input type="number" id="ot_hrs" class="w-full" bind:value={$form.otHrs} />
				{@render compute(
					calcAddition({
						grossSalary: $form.grossSalary,
						percentage: $form.otPercentage
					}) * $form.otHrs
				)}
			</InputWrapper>
		</div>

		<!-- Deduction -->
		<div class="flex flex-col gap-3">
			<h3 class="text-md font-semibold">Deductions</h3>
			<InputWrapper
				label={`SSS ${PERCENT_STR}`}
				labelFor="sss"
				class="flex flex-row items-center px-0!"
				labelClass="w-[200px] max-w-[200px]"
			>
				<Input type="number" id="sss" class="w-full" bind:value={$form.sss} />
				{@render compute(
					calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.sss
					}),
					COMPUTE_RENDER,
					!AMOUNT_POSITIVE
				)}
			</InputWrapper>
			<InputWrapper
				label={`Pag-ibig ${PERCENT_STR}`}
				labelFor="pagibig"
				class="flex flex-row items-center px-0!"
				labelClass="w-[200px] max-w-[200px]"
			>
				<Input type="number" id="pagibig" class="w-full" bind:value={$form.pagibig} />
				{@render compute(
					calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.pagibig
					}),
					COMPUTE_RENDER,
					!AMOUNT_POSITIVE
				)}
			</InputWrapper>
			<InputWrapper
				label={`PhilHealth ${PERCENT_STR}`}
				labelFor="philhealth"
				class="flex flex-row items-center px-0!"
				labelClass="w-[200px] max-w-[200px]"
			>
				<Input type="number" id="philhealth" class="w-full" bind:value={$form.philhealth} />
				{@render compute(
					calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.philhealth
					}),
					COMPUTE_RENDER,
					!AMOUNT_POSITIVE
				)}
			</InputWrapper>
		</div>
	</form>
</div>
