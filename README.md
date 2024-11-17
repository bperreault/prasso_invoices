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
- **HTML/CSS**: Structure and styling of the web interface
- **JavaScript (ES6+)**: Core application logic using modern JavaScript features
- **Alpine.js**: Lightweight JavaScript framework for reactivity
- **Material Icons**: UI icons for enhanced user experience
- **Prasso Framework**: Backend integration and data management

## Getting Started
To integrate Prasso_Invoicing into your Prasso site:

1. Add the required JavaScript files to your project:
   ```javascript
   /public/js/timeTracker.js
   ```

2. Create a new page in your Prasso site editor:
   - Set the page wrapper to your chosen master page
   - Set the page template to TimeEntry
   - Copy the content from `faxt_timetracking.htm` into the page description
   - Save the page and note the page ID
   - Update the page's "Where Value" field with the page ID

## Usage
1. **Add Time Entries**:
   - Select a date (defaults to today)
   - Enter start and end times
   - Provide a description of the work performed
   - Click "Add Time" to save the entry

2. **Manage Time Entries**:
   - View all uninvoiced time entries in the table
   - Edit or delete individual entries using action buttons
   - Select multiple entries for batch operations

3. **Generate Invoices**:
   - Select entries using checkboxes
   - Click the invoice icon (business) to generate an invoice. The invoice will be displayed in a new window where you can print it or save it as a PDF.
   - Use the delete icon to remove multiple entries at once

## How It Works
The application uses a `TimeTracker` class that manages all time tracking functionality:

### Core Features
- **Automatic Date Setting**: Automatically sets today's date for new entries
- **Duration Calculation**: Automatically calculates time duration between start and end times
- **Time Validation**: Ensures end time is after start time
- **Data Persistence**: Integrates with Prasso backend for data storage
- **Batch Operations**: Support for invoicing and deleting multiple entries

### Key Components
```javascript
class TimeTracker {
    // Handles form submission and data validation
    async submitTimeEntry() {
        // Validates and submits time entry data
    }

    // Calculates duration between times
    calculateDuration(startTime, endTime) {
        // Returns formatted duration as HH:MM
    }

    // Validates time entries
    isValidTimeRange(start, end) {
        // Ensures end time is after start time
    }
}
```

## Configuration
The TimeTracker requires a configuration object with:
- `teamId`: Your team identifier
- Additional Prasso-specific configuration parameters

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
