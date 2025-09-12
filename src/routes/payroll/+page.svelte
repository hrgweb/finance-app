<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import InputWrapper from '$lib/shared/input-wrapper.svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { AMOUNT_POSITIVE, PERCENT_STR } from '$lib/const.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { PayrollSchema } from '$lib/objects.js';

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

	function netIncome(form: PayrollSchema): number {
		return (
			Number(form.grossSalary) +
			Number(form.totalOvertime) -
			Number(form.sssEmployeeDeduction) -
			Number(form.pagibigEmployeeDeduction) -
			Number(form.philhealthEmployeeDeduction)
		);
	}

	function deductions(form: PayrollSchema): number {
		return (
			Number(form.sssEmployeeDeduction) +
			Number(form.pagibigEmployeeDeduction) +
			Number(form.philhealthEmployeeDeduction)
		);
	}

	function overtimeNet(form: PayrollSchema): number {
		return Number(form.ot);
	}

	$effect(() => {
		form.update(
			($form) => {
				$form.ot =
					calcAddition({
						grossSalary: $form.grossSalary,
						percentage: $form.otPercentage
					}) * $form.otHrs;
				$form.sssEmployeeDeduction =
					calcDeduction({
						grossSalary: $form.grossSalary,
						percentageDeduction: $form.sssPercentage
					}) / 2;
				$form.sssEmployerDeduction = $form.sssEmployeeDeduction * 2;
				$form.pagibigEmployeeDeduction = 200; // fixed
				$form.pagibigEmployerDeduction = 200; // fixed
				$form.philhealthEmployeeDeduction = calcDeduction({
					grossSalary: $form.grossSalary,
					percentageDeduction: $form.philhealthPercentage
				});
				$form.philhealthEmployerDeduction = $form.philhealthEmployeeDeduction;
				$form.totalDeductions = deductions($form);
				$form.totalOvertime = overtimeNet($form);
				$form.totalNetIncome = netIncome($form);
				console.log('effect form');
				return $form;
			},
			{ taint: false }
		);
		console.log('effect');
	});

	$inspect(data);
</script>

<SuperDebug data={$form} />

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

					// Gross salary empty then reset fields
					if (value.length <= 0) {
						form.update(
							($form) => {
								$form.grossSalary = 0;
								$form.ot = 0;
								$form.sssEmployeeDeduction = 0;
								$form.sssEmployerDeduction = 0;
								$form.pagibigEmployeeDeduction = 0;
								$form.pagibigEmployerDeduction = 0;
								$form.philhealthEmployeeDeduction = 0;
								$form.philhealthEmployerDeduction = 0;
								$form.totalDeductions = 0;
								$form.totalOvertime = 0;
								$form.totalNetIncome = 0;
								return $form;
							},
							{ taint: false }
						);
						return;
					}

					form.update(
						($form) => {
							$form.ot =
								calcAddition({
									grossSalary: $form.grossSalary,
									percentage: $form.otPercentage
								}) * $form.otHrs;
							$form.sssEmployeeDeduction =
								calcDeduction({
									grossSalary: $form.grossSalary,
									percentageDeduction: $form.sssPercentage
								}) / 2;
							$form.sssEmployerDeduction = $form.sssEmployeeDeduction * 2;
							$form.pagibigEmployeeDeduction = 200; // fixed
							$form.pagibigEmployerDeduction = 200; // fixed
							$form.philhealthEmployeeDeduction = calcDeduction({
								grossSalary: $form.grossSalary,
								percentageDeduction: $form.philhealthPercentage
							});
							$form.philhealthEmployerDeduction = $form.philhealthEmployeeDeduction;
							$form.totalDeductions = deductions($form);
							$form.totalOvertime = overtimeNet($form);
							$form.totalNetIncome = netIncome($form);
							return $form;
						},
						{ taint: false }
					);
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
			</InputWrapper>
		</div>

		<!-- Deduction -->
		<div class="flex flex-col gap-3">
			<h3 class="text-md font-semibold">Deductions</h3>
			<InputWrapper
				label={`SSS ${PERCENT_STR}`}
				labelFor="sss"
				class="flex flex-row items-center px-0!"
				labelClass="w-[100px] max-w-[100px]"
			>
				<Input type="number" id="sss" class="w-full" bind:value={$form.sssPercentage} />
			</InputWrapper>
			<div class="flex items-center gap-12">
				<span
					>EE: {@render compute($form.sssEmployeeDeduction, COMPUTE_RENDER, !AMOUNT_POSITIVE)}</span
				>
				<span
					>ER: {@render compute($form.sssEmployerDeduction, COMPUTE_RENDER, !AMOUNT_POSITIVE)}</span
				>
			</div>

			<br />

			<InputWrapper
				label={`Pag-ibig ${PERCENT_STR}`}
				labelFor="pagibig"
				class="flex flex-row items-center px-0!"
				labelClass="w-[100px] max-w-[100px]"
			>
				<div class="flex items-center gap-6">
					<span
						>EE: {@render compute(
							$form.pagibigEmployeeDeduction,
							COMPUTE_RENDER,
							!AMOUNT_POSITIVE
						)}</span
					>
					<span
						>ER: {@render compute(
							$form.pagibigEmployerDeduction,
							COMPUTE_RENDER,
							!AMOUNT_POSITIVE
						)}</span
					>
				</div></InputWrapper
			>

			<br />

			<InputWrapper
				label={`PhilHealth ${PERCENT_STR}`}
				labelFor="philhealth"
				class="flex flex-row items-center px-0!"
				labelClass="w-[100px] max-w-[100px]"
			>
				<Input
					type="number"
					id="philhealth"
					class="w-full"
					bind:value={$form.philhealthPercentage}
				/>
			</InputWrapper>
			<div class="flex items-center gap-12">
				<span
					>EE: {@render compute(
						$form.philhealthEmployeeDeduction,
						COMPUTE_RENDER,
						!AMOUNT_POSITIVE
					)}</span
				>
				<span
					>ER: {@render compute(
						$form.philhealthEmployerDeduction,
						COMPUTE_RENDER,
						!AMOUNT_POSITIVE
					)}</span
				>
			</div>
		</div>

		<Separator class="bg-slate-300" />

		<footer>
			<div class="flex flex-col justify-between">
				<div class="flex justify-between">
					<span class="w-[200px] text-lg font-medium uppercase">Gross Income:</span>
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
						$form.totalDeductions,
						COMPUTE_RENDER,
						!AMOUNT_POSITIVE,
						'text-right text-md font-medium'
					)}
				</div>
				<div class="flex justify-between">
					<span class="text-md font-medium uppercase">Overtime:</span>
					{@render compute(
						$form.totalOvertime,
						COMPUTE_RENDER,
						AMOUNT_POSITIVE,
						'text-right text-md font-medium'
					)}
				</div>
				<div class="flex justify-between pt-3">
					<span class="w-[200px] text-xl font-medium uppercase">Net Income:</span>
					{@render compute(
						$form.totalNetIncome,
						COMPUTE_RENDER,
						AMOUNT_POSITIVE,
						'text-right text-xl font-medium'
					)}
				</div>
			</div>
		</footer>
	</form>
</div>
