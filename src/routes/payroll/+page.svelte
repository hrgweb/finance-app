<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import InputWrapper from '$lib/shared/input-wrapper.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { AMOUNT_POSITIVE, PERCENT_STR } from '$lib/const.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

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
		return grossSalary / 26 / 8; // 26=days, 8=hrs
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

	const COMPUTE_RENDER = true;

	let otInput = $state<HTMLInputElement>();
	let sssDeductionInput = $state<HTMLInputElement>();
	let pagibigDeductionInput = $state<HTMLInputElement>();
	let philhealthDeductionInput = $state<HTMLInputElement>();

	function netIncome(): number {
		return (
			Number($form.grossSalary) +
			Number(otInput?.value) -
			Number(sssDeductionInput?.value) -
			Number(pagibigDeductionInput?.value) -
			Number(philhealthDeductionInput?.value)
		);
	}

	function deductions(): number {
		return (
			Number(sssDeductionInput?.value) +
			Number(pagibigDeductionInput?.value) +
			Number(philhealthDeductionInput?.value)
		);
	}

	function overtimeNet(): number {
		return Number(otInput?.value);
	}

	let _deductions = $state(0);
	let _ot = $state(0);

	$effect(() => {
		form.update(($form) => {
			$form.ot = Number(otInput?.value);
			$form.sssDeduction = Number(sssDeductionInput?.value);
			$form.pagibigDeduction = Number(pagibigDeductionInput?.value);
			$form.philhealthDeduction = Number(philhealthDeductionInput?.value);
			return $form;
		});
		_deductions = deductions();
		_ot = overtimeNet();
		console.log('watching...');
	});

	$inspect(data);
</script>

<!-- <SuperDebug data={$form} /> -->

{#snippet compute(amount: number, show = true, positive = true, className = '')}
	<span class="w-[300px] pl-3 {className}">
		{#if show}
			{#if !positive}
				-
			{/if}
			<span>&#8369;</span>
			{amount?.toFixed(2)}
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
			<Input
				type="number"
				id="gross_salary"
				class="w-full"
				bind:value={$form.grossSalary}
				oninput={(e) => {
					const value = (e.target as HTMLInputElement).value;
					if (value.length <= 0) {
						form.update(($form) => {
							$form.grossSalary = 0;
							$form.ot = 0;
							$form.sssDeduction = 0;
							$form.pagibigDeduction = 0;
							$form.philhealthDeduction = 0;
							return $form;
						});
						_deductions = 0;
						_ot = 0;
						return;
					}

					form.update(($form) => {
						$form.ot = Number(otInput?.value);
						$form.sssDeduction = Number(sssDeductionInput?.value);
						$form.pagibigDeduction = Number(pagibigDeductionInput?.value);
						$form.philhealthDeduction = Number(philhealthDeductionInput?.value);
						return $form;
					});
					_deductions = deductions();
					_ot = overtimeNet();
				}}
			/>
		</InputWrapper>

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
				<input
					bind:this={otInput}
					type="hidden"
					value={(
						calcAddition({
							grossSalary: $form.grossSalary,
							percentage: $form.otPercentage
						}) * $form.otHrs
					).toFixed(2)}
				/>
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
				<Input type="number" id="sss" class="w-full" bind:value={$form.sssPercentage} />
				{@render compute(
					calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.sssPercentage
					}),
					COMPUTE_RENDER,
					!AMOUNT_POSITIVE
				)}
				<input
					bind:this={sssDeductionInput}
					type="hidden"
					value={calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.sssPercentage
					})}
				/>
			</InputWrapper>
			<InputWrapper
				label={`Pag-ibig ${PERCENT_STR}`}
				labelFor="pagibig"
				class="flex flex-row items-center px-0!"
				labelClass="w-[200px] max-w-[200px]"
			>
				<Input type="number" id="pagibig" class="w-full" bind:value={$form.pagibigPercentage} />
				{@render compute(
					calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.pagibigPercentage
					}),
					COMPUTE_RENDER,
					!AMOUNT_POSITIVE
				)}
				<input
					bind:this={pagibigDeductionInput}
					type="hidden"
					value={calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.pagibigPercentage
					})}
				/>
			</InputWrapper>
			<InputWrapper
				label={`PhilHealth ${PERCENT_STR}`}
				labelFor="philhealth"
				class="flex flex-row items-center px-0!"
				labelClass="w-[200px] max-w-[200px]"
			>
				<Input
					type="number"
					id="philhealth"
					class="w-full"
					bind:value={$form.philhealthPercentage}
				/>
				{@render compute(
					calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.philhealthPercentage
					}),
					COMPUTE_RENDER,
					!AMOUNT_POSITIVE
				)}
				<input
					bind:this={philhealthDeductionInput}
					type="hidden"
					value={calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.philhealthPercentage
					})}
				/>
			</InputWrapper>
		</div>

		<Separator class="bg-slate-300" />

		<footer>
			<div class="flex flex-col justify-between">
				<div class="flex justify-between">
					<span class="text-lg font-medium uppercase">Gross Income:</span>
					{@render compute(
						$form.grossSalary,
						COMPUTE_RENDER,
						AMOUNT_POSITIVE,
						'text-right text-lg font-medium'
					)}
				</div>
				<div class="flex justify-between">
					<span class="text-md font-medium uppercase">Deductions:</span>
					{@render compute(
						_deductions,
						COMPUTE_RENDER,
						!AMOUNT_POSITIVE,
						'text-right text-md font-medium'
					)}
				</div>
				<div class="flex justify-between">
					<span class="text-md font-medium uppercase">Overtime:</span>
					{@render compute(_ot, COMPUTE_RENDER, AMOUNT_POSITIVE, 'text-right text-md font-medium')}
				</div>
				<div class="flex justify-between pt-3">
					<span class="text-xl font-medium uppercase">Net Income:</span>
					{@render compute(
						netIncome(),
						COMPUTE_RENDER,
						AMOUNT_POSITIVE,
						'text-right text-xl font-medium'
					)}
				</div>
			</div>
		</footer>
	</form>
</div>
