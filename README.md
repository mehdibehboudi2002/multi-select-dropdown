Multi-Select Dropdown Component

This is a reusable multi-select dropdown component I built using React, TypeScript, and SCSS.
The main idea was to create a flexible dropdown where users can pick multiple things, search easily, and even add new options on the fly. It meets all the main requirements: it's reusable, type-safe, and has that essential "click outside to close" logic.

🔧 Features
Multi-select and single-select modes
You can set it to let the user pick one item or many.

Search and filter
Quickly filter options by typing in the search box.

Add new items
If the searched option doesn’t exist, you can create a new one by pressing Enter or clicking the + button.

Select All / Deselect All
For multi-select mode, you can toggle all visible options at once.

Click outside to close
Clicking anywhere outside the dropdown will automatically close it.

Persistent data
Options and selected items are saved in localStorage, so they stay after page refresh.

Type-safe and reusable
Written completely in TypeScript with a clean, modular structure.

Responsive and smooth animations
Works well on desktop and mobile, with simple open/close transitions.

🧩 Project Structure
src/
├── components/
│   └── MultiSelectDropdown/
│       ├── MultiSelectDropdown.tsx
│       ├── MultiSelectDropdown.types.ts
│       └── MultiSelectDropdown.scss
├── hooks/
│   └── MultiSelectDropdown/
│       └── useMultiSelectState.ts
└── App.tsx


MultiSelectDropdown.tsx – main component logic and UI

useMultiSelectState.ts – custom React hook to handle all dropdown state and localStorage persistence

MultiSelectDropdown.types.ts – shared TypeScript interfaces

MultiSelectDropdown.scss – component styling

🚀 Getting Started
1. Install dependencies
npm install

2. Run the development server
npm start

💡 Usage Method
You can easily import MultiSelectDropdown.tsx and use it even without passing any props and use the default version, but you can also use in many different cases by passing the different props:

⚙️ Props
Prop	                Type	                        Default	                    Description
defaultOptions	        string[] or DropdownOption[]	[]	                        Initial list of options
initialSelectedIds	    string[]	                    []	                        IDs of pre-selected items
placeholder	            string	                        'Select items...'           Placeholder text for header
searchPlaceholder	    string	                        'Search or type to add...'	Placeholder inside search box
searchable	            boolean	                         true	                    Enables search input
enableAdd	            boolean	                         true	                    Allows adding new items
singleSelection	        boolean	                         false	                    Enables single-select mode
enableSelectAll	        boolean	                         true	                    Adds a “Select All” option
showCheckbox	        boolean	                         false	                    Shows checkboxes next to options


🧠 How It Works
The component uses a custom hook called useMultiSelectState, which handles:
Managing the list of available options
Adding and removing items dynamically
Remembering selected items
Saving everything in localStorage
When you type in the search box:
It filters the list of options in real time.
If no match is found, it shows a hint to add a new one.
Pressing Enter or clicking the + button adds the new item instantly.
The dropdown closes when clicking outside or clicking on the own selectbox field while is opened.
In single-select mode, selecting an item also closes the dropdown immediately.

🎨 Styling
The styles are written in SCSS and designed to look clean and modern.
It includes:
Subtle hover and focus effects
Smooth dropdown open/close animation
Custom scrollbars for scrollable elements
Fully responsive layout

🧭 Notes
When you add a new item, it’s automatically selected.
In single-select mode, clicking the already selected item won’t unselect it.
The search is case-insensitive.
Selections are saved locally, so they stay after reload.
The dropdown can handle both string arrays and object arrays as input.

🛠️ Things I'd Improve Next
Validations while adding new options
Keyboard navigation (arrow keys, Enter, Esc)
Async loading for large datasets
Improved accessibility and ARIA roles

🧰 Tech Stack
React 19.2.0
TypeScript 4.9.5
SCSS (Sass) 1.93.2

✨ Summary
This component was built as part of a front-end task focusing on reusability, clean code, and user experience.
It’s easy to plug into any React project, supports both single and multiple selections, and lets users add their own custom options by the props dynamically.