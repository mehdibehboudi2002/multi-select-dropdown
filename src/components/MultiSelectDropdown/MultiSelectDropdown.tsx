import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MultiSelectDropdownProps, DropdownOption, BaseMultiSelectDropdownProps } from './MultiSelectDropdown.types';
import { useMultiSelectState } from '../../hooks/MultiSelectDropdown/useMultiSelectState';

const BaseMultiSelectDropdown: React.FC<BaseMultiSelectDropdownProps> = ({
    options,
    selectedIds,
    onSelectionChange,
    onAddOption,
    placeholder = 'Select items...',
    searchPlaceholder = 'Search or type to add...',
    searchable = true,
    enableAdd = true,
    singleSelection = false,
    enableSelectAll = true,
    showCheckbox = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const filteredOptions = useMemo(() => {
        if (!searchable || !searchValue.trim()) return options;
        const searchLower = searchValue.toLowerCase();
        return options.filter(option =>
            option.label.toLowerCase().includes(searchLower)
        );
    }, [options, searchValue, searchable]);

    const canAdd = useMemo(() => {
        return searchable && enableAdd && searchValue.trim() !== '' && filteredOptions.length === 0;
    }, [searchValue, filteredOptions, searchable, enableAdd]);

    const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

    const allSelected = useMemo(() => {
        const relevantOptions = searchable && searchValue.trim() ? filteredOptions : options;
        return relevantOptions.length > 0 && relevantOptions.every(opt => selectedIds.includes(opt.id));
    }, [options, filteredOptions, selectedIds, searchValue, searchable]);

    const handleDropdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest('.chip') || target.closest('.chip-remove')) return;
        setIsOpen(prev => !prev);
    };

    const handleRemoveChip = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    };

    const handleItemClick = (id: string) => {
        if (singleSelection) {
            // If the same item is clicked again, just ignore 
            if (selectedIds.includes(id)) return;

            // Otherwise, select the new item and close the dropdown
            onSelectionChange([id]);
            setIsOpen(false);
        } else {
            if (selectedIds.includes(id)) {
                onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
            } else {
                onSelectionChange([...selectedIds, id]);
            }
        }

        if (searchable) {
            setSearchValue('');
        }
    };

    const handleSelectAll = () => {
        const relevantOptions = searchable && searchValue.trim() ? filteredOptions : options;
        if (allSelected) {
            onSelectionChange(selectedIds.filter(id => !relevantOptions.some(opt => opt.id === id)));
        } else {
            const newIds = Array.from(new Set([...selectedIds, ...relevantOptions.map(opt => opt.id)]));
            onSelectionChange(newIds);
        }
    };

    const handleAddClick = () => {
        if (canAdd && onAddOption) {
            const newOption: DropdownOption = {
                id: Date.now().toString(),
                label: searchValue.trim(),
            };
            onAddOption(newOption);
            setSearchValue('');
            searchInputRef.current?.focus();
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && canAdd) {
            e.preventDefault();
            handleAddClick();
        }
    };

    return (
        <div className={`multi-select-dropdown`} ref={dropdownRef}>
            <div className="dropdown-header" onClick={handleDropdownClick}>
                {selectedOptions.length === 0 && placeholder}
                <div className="selected-chips-container">
                    {selectedOptions.map(option => (
                        <div key={option.id} className="chip">
                            <span className="chip-label">
                                {option.label} {option.emoji}
                            </span>
                            <button
                                className="chip-remove"
                                onClick={(e) => handleRemoveChip(option.id, e)}
                                aria-label={`Remove ${option.label}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>


            {isOpen && (
                <div className="dropdown-menu">
                    {searchable && (
                        <div className="dropdown-search-section">
                            <div className="search-input-wrapper">
                                <span className="search-icon">🔍</span>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="search-input"
                                    placeholder={searchPlaceholder}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                                {enableAdd && (
                                    <button
                                        className={`add-icon-button ${canAdd ? 'enabled' : 'disabled'}`}
                                        onClick={handleAddClick}
                                        disabled={!canAdd}
                                        title={canAdd ? `Add "${searchValue}"` : 'Type to add new item'}
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {!singleSelection && enableSelectAll && (options.length > 0 || filteredOptions.length > 0) && (
                        <div
                            className="dropdown-item select-all-item"
                            onClick={handleSelectAll}
                        >
                            <input
                                type="checkbox"
                                className="select-all-checkbox"
                                checked={allSelected}
                                onChange={() => { }}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <span className="item-text">Select All</span>
                        </div>
                    )}

                    {filteredOptions.length > 0 ? (
                        <div className="options-list">
                            {filteredOptions.map(option => {
                                const isSelected = selectedIds.includes(option.id);
                                return (
                                    <div
                                        key={option.id}
                                        className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleItemClick(option.id)}
                                    >
                                        {showCheckbox && (
                                            <input
                                                type="checkbox"
                                                className="item-checkbox"
                                                checked={isSelected}
                                                onChange={() => { }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        )}
                                        <span className="item-text">
                                            {option.label} {option.emoji}
                                        </span>
                                        {isSelected && <span className="checkmark">✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    ) : searchValue.trim() && searchable ? (
                        <div className="no-results">
                            <span>No results found</span>
                            {enableAdd && <span className="hint">Press + or Enter to add "{searchValue}"</span>}
                        </div>
                    ) : !searchable && options.length === 0 ? (
                        <div className="no-results">
                            <span>No options available</span>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    defaultOptions = [],
    initialSelectedIds = [],
    placeholder,
    searchPlaceholder,
    searchable = true,
    enableAdd = true,
    singleSelection = false,
    enableSelectAll = true,
    showCheckbox = false,
}) => {
    const normalizedOptions: DropdownOption[] = useMemo(() => {
        if (defaultOptions.length === 0) return [];

        // Convert all options to objects if they’re plain strings
        let processedOptions: DropdownOption[];
        if (typeof defaultOptions[0] === 'object' && 'id' in defaultOptions[0]) {
            processedOptions = defaultOptions as DropdownOption[];
        } else {
            processedOptions = (defaultOptions as string[]).map((label, index) => ({
                id: (index + 1).toString(),
                label: label.trim(),
            }));
        }

        // Remove duplicates 
        const uniqueOptions = Array.from(
            new Map(
                processedOptions.map((opt) => [opt.label.toLowerCase(), opt])
            ).values()
        );

        return uniqueOptions;
    }, [defaultOptions]);


    const [options, { selectedIds, handleSelectionChange, handleAddOption }] =
        useMultiSelectState(normalizedOptions, initialSelectedIds, singleSelection);

    return (
        <BaseMultiSelectDropdown
            options={options}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
            onAddOption={searchable ? handleAddOption : undefined}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            searchable={searchable}
            enableAdd={searchable && enableAdd}
            singleSelection={singleSelection}
            enableSelectAll={enableSelectAll}
            showCheckbox={showCheckbox}
        />
    );
}

export default MultiSelectDropdown;