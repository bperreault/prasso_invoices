# prasso_invoices
# Prasso_Invoicing

Prasso_Invoicing is a web-based tool designed for tracking and generating invoices from time entries. This project provides an interactive interface where users can manage time entries, select specific records for invoicing, and generate printable invoices with detailed time summaries. 

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Add and manage time entries**: Users can input, update, and delete time entries.
- **Select records for invoicing**: Checkbox functionality allows users to choose which records to include in an invoice.
- **Generate and print invoices**: Selected entries are displayed in a formatted table that can be opened in a new window and printed or saved as a PDF.
- **Calculate total duration**: The total time of selected entries is automatically calculated and displayed.

## Technologies Used
- **HTML**: Structure of the web page and table layout.
- **CSS**: Basic styling for table formatting.
- **JavaScript**: Core logic for data handling, user interaction, and print functionality.

## Getting Started
To use Prasso_Invoicing, use your Prasso site editor to create a site page. 
- Set the page wrapper to your chosen master page.
- Set the page template to TimeEntry
- Insert into the page description the code from file faxt_timetracking.htm

### Installation
```bash
git clone https://github.com/yourusername/Prasso_Invoicing.git
cd Prasso_Invoicing
```

Open the `index.html` file directly in your browser:
```bash
open index.html
```

## Usage
1. **Add Time Entries**: Use the form to input date, start time, end time, and a description.
2. **Select Entries**: Check the box in the last column of the table to include entries in an invoice.
3. **Generate Invoice**: Click the "Create Invoice" button to compile the selected entries into a formatted invoice table.
4. **Print or Save**: The invoice will be displayed in a new window where you can print it or save it as a PDF.

## How It Works
### Main Functions
- **appendTimeEntry(date, startTime, endTime, description, id)**:
  - Dynamically adds a new row to the time entries table.
- **invoiceSelected()**:
  - Collects selected rows, compiles them into an invoice table, opens a new window, and displays the table for printing.
- **calculateDuration(startTime, endTime)**:
  - Helper function to compute the duration between start and end times and format it as `HH:MM`.

### Code Snippet for Generating an Invoice Table:
```javascript
function invoiceSelected() {
    const selectedRecords = [];
    // Logic to gather selected entries
    // Create and display the table in a new window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><body>' + invoiceTable.outerHTML + '</body></html>');
    printWindow.document.close();
    printWindow.print();
}
```

## Contributing
Contributions are welcome! If you would like to contribute to Prasso_Invoicing:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or feedback, please reach out to [yourname@example.com].

---

*Happy invoicing with Prasso_Invoicing!*
