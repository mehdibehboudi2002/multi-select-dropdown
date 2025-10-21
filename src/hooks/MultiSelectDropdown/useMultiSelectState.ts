import { useState, useMemo, useEffect, useRef } from "react";
import { DropdownOption } from "../../components/MultiSelectDropdown/MultiSelectDropdown.types";

interface UseMultiSelectStateResult {
  selectedIds: string[];
  handleSelectionChange: (newSelectedIds: string[]) => void;
  handleAddOption: (newOption: DropdownOption) => void;
}

const STORAGE_KEY_OPTIONS = "multi-select-dropdown-options";
const STORAGE_KEY_SELECTED = "multi-select-dropdown-selected";
const STORAGE_KEY_HISTORY = "multi-select-dropdown-history";

export const useMultiSelectState = (
  defaultOptions: DropdownOption[] = [],
  initialSelectedIds: string[] = [],
  singleSelection = false
): [DropdownOption[], UseMultiSelectStateResult] => {
  // Load from localStorage or use default values
  const singleSelectionRef = useRef(singleSelection);
  const [options, setOptions] = useState<DropdownOption[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_OPTIONS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.length > 0 ? parsed : defaultOptions;
      } catch {
        return defaultOptions;
      }
    }
    return defaultOptions;
  });

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_SELECTED);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialSelectedIds;
      }
    }
    return initialSelectedIds;
  });

  const [selectionHistory, setSelectionHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialSelectedIds;
      }
    }
    return initialSelectedIds;
  });

  // Save to localStorage 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SELECTED, JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(selectionHistory));
  }, [selectionHistory]);

const handleAddOption = (newOption: DropdownOption) => {
  setOptions((prevOptions) => [...prevOptions, newOption]);

  setSelectedIds((prevSelected) => {
    let newSelectedIds: string[];

    if (singleSelectionRef.current) {
      // Replace previous selection in singleSelection mode
      newSelectedIds = [newOption.id];
    } else {
      newSelectedIds = [...prevSelected, newOption.id];
    }

    setSelectionHistory((prevHistory) => [...prevHistory, newOption.id]);
    return newSelectedIds;
  });
};


  const handleSelectionChange = (newSelectedIds: string[]) => {
    const prevSelectedIds = selectedIds;
    setSelectedIds(newSelectedIds);

    // Check which item was added or removed
    const addedId = newSelectedIds.find((id) => !prevSelectedIds.includes(id));
    const removedId = prevSelectedIds.find(
      (id) => !newSelectedIds.includes(id)
    );

    if (addedId) {
      setSelectionHistory((prevHistory) => [...prevHistory, addedId]);
    } else if (removedId) {
      setSelectionHistory((prevHistory) =>
        prevHistory.filter((id) => id !== removedId)
      );
    }
  };

  return [
    options,
    {
      selectedIds,
      handleSelectionChange,
      handleAddOption,
    },
  ];
};