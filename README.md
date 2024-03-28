# ProjectPacer

## Overview

**ProjectPacer** is a web-based application crafted specifically for freelancers, aiming to enhance their productivity by providing a way to track time spent on various projects and tasks. The app integrates a timer with start, pause, and stop functionalities, invoicing based on tracked hours, and a motivational quotes feature to inspire users throughout their workday. Additionally, ProjectPacer allows users to add detailed comments to their time entries, ensuring a comprehensive understanding of tasks completed during each tracked period.

### Preview

![](preview.gif)


### Problem

Managing multiple projects and tasks can often lead to inefficiencies and inaccuracies in time tracking for freelancers, affecting overall productivity. The administrative burden of creating invoices and tracking their status further complicates the workflow. ProjectPacer addresses these challenges by offering a solution that not only simplifies time tracking and invoice management but also boosts motivation through curated inspirational quotes.

### User Profile

ProjectPacer is designed for a freelancer who needs an efficient tool for managing their time, generating invoices, and seeking motivation. This initial version focuses on single-user functionality.

### Features

- **Time Tracking with Comments:** Enables time tracking for tasks with the ability to add comments detailing work completed.

- **Time Entries Management:** Offers functionalities to view, edit, and select time entries for invoicing, including detailed comments.

- **Invoice Generation and Management:** Facilitates the creation of invoices from selected time entries, customization of invoice details, tracking of invoice statuses (draft, sent, paid, late), and the ability to export as PDF.

- **Motivational Quotes:** Displays real-time motivational quotes from a third-party API to inspire and support users during their work.

- **Data Export:** Allows users to export time tracking and invoice data for record-keeping and analysis.

## Implementation

### Installation
- Clone from GitHub the backend: https://github.com/abloper24/project-pacer-backend
- Set up your database with an .env file 
- Clone from GitHub the frontend: https://github.com/abloper24/project-pacer


### Tech Stack

- **Frontend:** React.js, SASS, and React Router.
- **Backend:** Node.js, Express for server-side logic, MySQL database for data storage.
- **Libraries:** jsPDF for PDF generation, axios for API requests.

### APIs

- Quotes on Design - https://quotesondesign.com/api/

### Sitemap

- **Timer Page:** Central hub for time tracking, viewing quotes, and adding comments to tasks.
- **Time Entries Page:** Allows management and review of all time entries and can select specific time entries to create invoice.
- **Invoices Page:** Handles the creation, review, and status management of invoices. You can click to download PDF file. 


### Data

- **Time Entries:** Enhanced to include start/end times, duration, task-specific comments, and invoicing status.
- **Clients:** Detailed with ID, associated time entries.

### Endpoints

#### **1. Clients**

- **GET `/clients`**: Get all clients.
- **POST `/clients`**: Add a new client.
- **GET `/clients/:id`**: Get client by ID.
- **PATCH `/clients/:id`**: Edit client by ID.
- **DELETE `/clients/:id`**: Delete client by ID.
- **GET `/clients/:id/timers`**: Get all entries related to client with ID.

```jsx
{
        clientid: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        address: '1234 Main St',
        phone: '604-441-1001',
    }
```

#### **2. Timers**

- **GET `/timers`**: Get all timers.
- **POST `/timers`**: Start a new timer.
- **GET `/timers/:id`**: Get timer details.
- **PATCH `/timers/:id`**: Edit timer details.
- **DELETE `/timers/:id`**: Delete timer details.

```jsx
{
    timerid: 1,
    starttime: '2024-02-01 08:00:00',
    endtime: '2024-02-01 10:00:00',
    duration: 7200,
    description: 'Project A kickoff meeting',
    clientid: 1,
  }
```


### Auth

ProjectPacer only supports a single user without authentication.

## Roadmap

- Create client
    - React project with routes and boilerplate pages
- Create server
    - Express project with routing
- Create MySQL Database with seed data
- Feature: Time Tracker (basic requirements: start, pause and reset)
- Feature: Time entries page & post time entries 
- Feature: Time Tracker with Comments (ability to add comments to time entry)
- Feature: Deleting capability 
- Front-End Design of Time Tracker 
- Feature: Invoicing  
- Front-End Design of Invoicing
- Feature: PDF Exporting
- Bug Fixes
- Demo Day
