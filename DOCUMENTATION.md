# Lilly Technical Challenge Documentation Template

This document explains how I approached the challenge.

---
## Approach
I completed the challenge in a **backend → basic UI → full functionality → UI/UX polish** sequence.

1. **Finished the backend task first**  
   I reviewed all existing endpoints and implemented the missing optional part:  
   the `/average-price` endpoint, which calculates the average of all valid medicine prices. 
   This ensured the backend was complete, stable, and ready to support the UI.

2. **Built the HTML and JS structure**  
   I created the initial layout in `index.html` and implemented basic data fetching from the backend in `script.js`.

   After the basic UI worked, I added:
   - Create functionality  
   - Delete functionality  
   - Inline Edit & Save (turning a row into editable mode)  
   - Cancel edit & row state restoration  
   - Safe handling of missing values (`N/A`)  

   This made the app fully interactive and connected every backend endpoint with a real UI action.

3. **Fixed layout and completed full CSS design**  
   With all functionality working, I redesigned the entire interface using a soft palette in `style.css`
   I worked out spacing, structure, shadows, borders, input styles, button styles, and responsiveness.

This top-down approach let me focus first on correctness, then on functionality, then on design and polish.

---
## Objectives - Innovative Solutions

### Inline Editing Functionality

Clicking “Edit” transforms a row into an editable form:
- Price becomes an input box
- Buttons become Save / Cancel
- Only one row can be edited at a time
- Cancelling restores original state
- Saving calls /update

This is handled in openEditRow() in script.js

---
## Problems Faced

### **1. Incorrect command order in `start.bat`**=

### **2. Medicines without names or IDs**
Another challenge was that the dataset contains medicines that:
- Have **no name**
- Have **invalid or missing prices**
- Have **no IDs** (so they cannot be uniquely identified)

Since the backend only identifies medicines by name, this created problems:

- Medicines without names cannot be edited or deleted, because `/update` and `/delete` rely on `name` as the identifier.
- Multiple medicines could theoretically have the same name, making them indistinguishable.
- Showing an empty name in the frontend breaks the UI layout and user understanding.

I addressed this by:
- Displaying `"N/A"` in the table when the name is missing.
- Ensuring that frontend actions do not crash if the name is empty.

---
## Evaluation

### What went well:
- Smooth integration between backend and frontend
- Clean inline editing feature
- Robust handling of missing values
- Designed interface
- Completed optional averaging endpoint

### What I would improve:
- Add sorting and filtering to the table
- Validate input fields with custom UI messages instead of browser defaults