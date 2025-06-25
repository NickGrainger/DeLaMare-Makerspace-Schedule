# UNR DeLaMare Library Makerspace Booking Display

This project is a digital booking grid and queue system designed for the UNR DeLaMare Library Makerspace. Its primary purpose is to visually display the schedule of makerspace machines and equipment on a TV screen within the Makerspace, helping users easily see availability and appointments.

## Features
- Displays a grid of Makerspace machines against time slots throughout the day.
- Time slots toggle between showing hours through 5 PM or 7 PM.
- Clickable grid cells that cycle through booking statuses (available, unavailable, appointment only, public event, class/private event).
- Reorderable queue list for managing active 3D print jobs.
- Ability to add new queue entries and clear the schedule grid.

## Future Plans
Eventually, this project will be enhanced to:
- Read booking data automatically from exported files from LibCal or directly from the LibCal Makerspace bookings webpage.
- Automatically update the display based on live Makerspace bookings. Requires conversion of importer.py to JSON data first, then integration to the .js and .html files

## Project Context
This project is developed specifically for the UNR DeLaMare Library Makerspace to provide a convenient, centralized digital display of machine availability and upcoming bookings. It will help Makerspace staff and users better coordinate use of resources.

---

### How to Run
1. Open `Schedule.html` in a modern web browser.
2. The booking grid and queue list will be displayed.
3. Use the toggle and interact with the grid and queue as needed.

---

### Technologies Used
- Vanilla JavaScript for interactivity
- HTML and CSS for layout and styling

---

### Contact
For questions or contributions, please contact the Makerspace staff at the University of Nevada, Reno.

---
