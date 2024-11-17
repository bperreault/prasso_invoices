class TimeTracker {
    constructor(config) {
        this.config = config;
        this.timeForm = document.getElementById('timeForm');
        this.timeEntriesTable = document.getElementById('timeEntriesTable');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('entryDate').value = today;
            document.getElementById('startTime').focus();
        });
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);
        const diffMs = end - start;
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }

    isValidTimeRange(start, end) {
        const startDate = new Date(`1970-01-01T${start}`);
        const endDate = new Date(`1970-01-01T${end}`);
        return startDate < endDate;
    }

    async submitTimeEntry() {
        const formData = {
            team_id: this.config.teamId,
            entryDate: document.getElementById('entryDate').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            description: document.getElementById('description').value,
            return_json: document.getElementById('return_json').value,
            site_page_data_id: document.getElementById('site_page_data_id').value
        };

        if (!formData.entryDate || !formData.startTime || !formData.endTime) {
            alert('Please fill in all required fields');
            return;
        }

        if (!this.isValidTimeRange(formData.startTime, formData.endTime)) {
            alert('End time must be after start time');
            document.getElementById('startTime').focus();
            return;
        }

        try {
            const response = await fetch(`/site/${this.config.siteId}/${this.config.dataPageId}/sitePageDataPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('[name="_token"]').value
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                this.refreshTimeEntries(jsonResponse.data);
                this.clearForm();
            } else {
                alert('Error submitting data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    refreshTimeEntries(data) {
        const tbody = this.timeEntriesTable.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';

        const entries = JSON.parse(data);
        Object.values(entries).forEach(entry => {
            if (entry.display) {
                const data = JSON.parse(entry.display);
                this.appendTimeEntry(data.date, data.startTime, data.endTime, data.description, entry.id);
            }
        });
    }

    clearForm() {
        document.getElementById('startTime').value = '';
        document.getElementById('endTime').value = '';
        document.getElementById('description').value = '';
        document.getElementById('site_page_data_id').value = '';
    }

    appendTimeEntry(date, startTime, endTime, description, id) {
        const tbody = this.timeEntriesTable.getElementsByTagName('tbody')[0];
        const newRow = tbody.insertRow();

        const cells = {
            date: this.createInputCell(newRow, 'date', date),
            startTime: this.createInputCell(newRow, 'time', startTime),
            endTime: this.createInputCell(newRow, 'time', endTime),
            duration: newRow.insertCell(),
            description: this.createInputCell(newRow, 'text', description || ''),
            actions: this.createActionsCell(newRow, id),
            checkbox: this.createCheckboxCell(newRow, id)
        };

        cells.duration.textContent = this.calculateDuration(startTime, endTime);
    }

    createInputCell(row, type, value) {
        const cell = row.insertCell();
        cell.innerHTML = `<input type="${type}" value="${value}" onchange="timeTracker.updateTimeEntry(this)">`;
        return cell;
    }

    createActionsCell(row, id) {
        const cell = row.insertCell();
        cell.innerHTML = `
            <button onclick="timeTracker.deleteRow(${id}, this)">Delete</button>
            <button onclick="timeTracker.updateRow(${id}, this)">Update</button>
        `;
        return cell;
    }

    createCheckboxCell(row, id) {
        const cell = row.insertCell();
        cell.innerHTML = `<input type="checkbox" name="selectForInvoice" value="${id}">`;
        return cell;
    }

    async deleteRow(id, button) {
        if (!confirm('Are you sure you want to delete this entry?')) {
            return;
        }

        try {
            const response = await fetch(`/site/${this.config.siteId}/${this.config.dataPageId}/sitePageDataDelete/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-Token': document.querySelector('[name="_token"]').value
                }
            });

            if (response.ok) {
                const row = button.closest('tr');
                row.remove();
            } else {
                alert('Error deleting entry');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async updateRow(id, button) {
        const row = button.closest('tr');
        const data = {
            date: row.cells[0].querySelector('input').value,
            startTime: row.cells[1].querySelector('input').value,
            endTime: row.cells[2].querySelector('input').value,
            description: row.cells[4].querySelector('input').value,
            team_id: this.config.teamId,
            return_json: true
        };

        try {
            const response = await fetch(`/site/${this.config.siteId}/${this.config.dataPageId}/sitePageDataPut/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('[name="_token"]').value
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                this.refreshTimeEntries(jsonResponse.data);
            } else {
                alert('Error updating entry');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    updateTimeEntry(input) {
        const row = input.closest('tr');
        const startTime = row.cells[1].querySelector('input').value;
        const endTime = row.cells[2].querySelector('input').value;
        if (startTime && endTime) {
            row.cells[3].textContent = this.calculateDuration(startTime, endTime);
        }
    }

    selectAll(source) {
        const checkboxes = document.querySelectorAll('input[name="selectForInvoice"]');
        checkboxes.forEach(checkbox => checkbox.checked = source.checked);
    }

    deleteSelected() {
        const selectedCheckboxes = document.querySelectorAll('input[name="selectForInvoice"]:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Nothing was selected.');
            return;
        }
        selectedCheckboxes.forEach(checkbox => {
            this.deleteRow(checkbox.value, checkbox.closest('tr').querySelector('button'));
        });
    }

    invoiceSelected() {
        const selectedRecords = this.getSelectedTimeEntries();
        if (selectedRecords.length === 0) {
            alert('Nothing was selected.');
            return;
        }
    
        const result = this.createInvoiceTable(selectedRecords);
        const invoiceData = this.prepareInvoiceData(result.totalHours);
        this.displayInvoicePreview(result.table, invoiceData);
    }
    
    getSelectedTimeEntries() {
        const records = [];
        let totalDuration = 0;
        const rows = this.timeEntriesTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
        for (const row of rows) {
            const checkbox = row.querySelector('input[type="checkbox"][name="selectForInvoice"]');
            if (!checkbox?.checked) continue;
    
            const cells = row.getElementsByTagName('td');
            const duration = this.parseDuration(cells[3]);
            if (duration !== null) {
                totalDuration += duration;
                records.push({
                    date: cells[0].querySelector('input').value,
                    startTime: cells[1].querySelector('input').value,
                    endTime: cells[2].querySelector('input').value,
                    duration: cells[3].textContent.trim(),
                    description: cells[4].querySelector('input').value
                });
            }
        }
    
        return records;
    }
    
    parseDuration(durationCell) {
        const duration = durationCell.querySelector('input') ? 
            durationCell.querySelector('input').value.trim() : 
            durationCell.textContent.trim();
    
        if (!duration?.includes(':')) return null;
    
        const [hours, minutes] = duration.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
            console.warn('Invalid duration format:', duration);
            return null;
        }
    
        return (hours * 60) + minutes;
    }
    
    createInvoiceTable(records) {
        const table = document.createElement('table');
        table.border = '1';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                    <th>Description</th>
                </tr>
            </thead>
        `;
    
        const tbody = document.createElement('tbody');
        let totalDuration = 0;
    
        records.forEach(record => {
            const [hours, minutes] = record.duration.split(':').map(Number);
            totalDuration += (hours * 60) + minutes;
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.startTime}</td>
                <td>${record.endTime}</td>
                <td>${record.duration}</td>
                <td>${record.description}</td>
            `;
            tbody.appendChild(row);
        });
    
        const totalHours = (totalDuration / 60).toFixed(2);
        const footerRow = document.createElement('tr');
        footerRow.innerHTML = `
            <td colspan="3"><strong>Total Duration</strong></td>
            <td colspan="2">${totalHours} hours</td>
        `;
        tbody.appendChild(footerRow);
        table.appendChild(tbody);
    
        return { totalHours, table };
    }
    
    prepareInvoiceData(totalHours) {
        const currentDate = new Date();
        const dueDate = new Date(currentDate);
        dueDate.setDate(dueDate.getDate() + 15);
    
        return {
            date: currentDate.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            subtotal: (75 * totalHours).toFixed(2)
        };
    }
    
    displayInvoicePreview(invoiceTable, invoiceData) {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                   <title>${invoiceData.date} Comporium Invoice</title>
                   <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            background-color: #f5f5f5;
                        }
                        .invoice {
                            max-width: 800px;
                            margin: auto;
                            background: #fff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }
                        .header, .footer { text-align: center; margin-bottom: 20px; }
                        .details { width: 100%; margin-bottom: 20px; }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        th { background-color: #f2f2f2; }
                        .total { text-align: right; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="invoice">
                        <div class="header">
                            <h1>INVOICE</h1>
                            <p>Date: ${invoiceData.date}</p>
                            <p>Due Date: ${invoiceData.dueDate}</p>
                        </div>
                        <div class="details">
                            <p><strong>Issued To:</strong>Customer Name<br>123 Avenue Pkwy<br>City, SC 23232</p>
                            <p><strong>Pay To:</strong>Contractor Name<br>123 NW Street Ter.<br>City, SC 23111</p>
                        </div>
                        <div class="items">
                            ${invoiceTable.outerHTML}
                        </div>
                        <div class="total">
                            <p><strong>Total:</strong> $${invoiceData.subtotal}</p>
                        </div>
                        <div class="footer">
                            <p>Thank you!</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    placeInitialData(data) {
        // Iterate over all keys in the `data` object
        Object.keys(data).forEach(key => {
            // Check if the current item is an object and has a `display` property
            if (typeof data[key] === 'object' && data[key] !== null && 'display' in data[key]) {
                try {
                    // Parse the display data
                    const displayData = JSON.parse(data[key].display);
                    // If parsing successful, append the time entry
                    if (displayData) {
                        this.appendTimeEntry(
                            displayData.date,
                            displayData.startTime,
                            displayData.endTime,
                            displayData.description,
                            data[key].id
                        );
                    }
                } catch (error) {
                    console.error('Error parsing display data:', error);
                }
            }
        });
    }
}
