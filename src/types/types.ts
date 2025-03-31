export enum BreakPoints {
    sm = "sm",
    md = "md",
    lg = "lg",
    xl = "xl",
    "2xl" = "2xl"
}

// Define the Responsive type where "sm" is required and others are optional
export type Responsive = { sm: number } & { [key in Exclude<`${BreakPoints}`, "sm">]?: number };

// Define types for form and grid
export interface FormType {
    rows: number;
    columns: number;
    gap: number;
    responsive: Responsive;
}

export interface GridType {
    rows: number;
    columns: number;
    gap: number;
    rowSpan: number[];
    colSpan: number[];
}

export const columnDefault = 3;

export const defaultFormValue: FormType = {
    rows: 3,
    columns: columnDefault,
    gap: 10,
    responsive: { sm: 3 } // ✅ Corrected: BreakPoints.sm is "sm", which is a string
};