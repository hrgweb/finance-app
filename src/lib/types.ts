export interface IItem {
	id: string | number;
	label: string;
	value: string;
}

export interface ICategory extends IItem {}
export interface IAccount extends IItem {}
export interface IPaymentType extends IItem {}
export interface IFrequency extends IItem {}
