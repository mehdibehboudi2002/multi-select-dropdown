export interface DropdownOption {
    id: string;
    label: string;
    emoji?: string;
}

export interface BaseMultiSelectDropdownProps {
    options: DropdownOption[];
    selectedIds: string[];
    onSelectionChange: (newSelectedIds: string[]) => void;
    onAddOption?: (newOption: DropdownOption) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    searchable?: boolean;
    enableAdd?: boolean;
    singleSelection?: boolean;
    enableSelectAll?: boolean;
    showCheckbox?: boolean;
}

export interface MultiSelectDropdownProps {
    defaultOptions?: string[] | DropdownOption[];
    initialSelectedIds?: string[];
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    enableAdd?: boolean;
    singleSelection?: boolean;
    enableSelectAll?: boolean;
    showCheckbox?: boolean;
}

// Helper type for conditional required props
export interface MultiSelectDropdownPropsSearchable extends Omit<MultiSelectDropdownProps, 'defaultOptions'> {
    searchable: true;
    defaultOptions?: string[] | DropdownOption[];
}

export interface MultiSelectDropdownPropsNonSearchable extends Omit<MultiSelectDropdownProps, 'defaultOptions' | 'searchable'> {
    searchable: false;
    defaultOptions: string[] | DropdownOption[]; // Required when searchable is false
}