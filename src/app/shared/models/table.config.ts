
export interface TableColumn {
    key: string;
    label: string;
    class?: string;
    formatter?: (value: any, row?: any) => string;
}