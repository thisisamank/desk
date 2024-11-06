# Desk: An offline Course Player

An offline course player designed to help you load and view your educational content in a distraction-free environment. This tool enhances the learning experience by allowing offline access to various formats like video, text, HTML, and PDF.

## Features

- **Access multiple content sources**: Supports various types of educational material.
- **Supports various formats**: View courses in video, text, HTML, PDF, and other formats locally.
- **Distraction-free experience**: Optimized for a focused learning environment to help you concentrate on the content without distractions.

## Getting Started

### Prerequisites

- Ensure that your educational content is organized and accessible in a local folder structure.
- Install [Node.js](https://nodejs.org/) and [Python](https://www.python.org/) if not already installed.

### Installation and Running

The project includes a `Makefile` to simplify the installation and running processes. Use the following commands:

1. **Install Dependencies**:
   ```bash
   make install
   ```
   This will install all necessary packages for both the frontend (`desk-ui`) and backend (`server`) components.

2. **Run the Application**:
   ```bash
   make run
   ```
   This command starts both the frontend (in development mode) and backend servers in the background, logging output to `desk-ui.log` and `server.log` respectively.

3. **Stop the Application**:
   ```bash
   make kill
   ```
   This stops both the frontend and backend processes.

## Usage

1. **Load Content**: Navigate to the `Load Content` section in the UI and select the materials you want to view.
2. **Navigation**: Use the sidebar or menu to switch between different modules or files within the content library.
3. **Distraction-Free Mode**: Toggle the distraction-free mode to focus on the content without UI interruptions.

## Logs

- Frontend logs are saved in `desk-ui.log`.
- Backend logs are saved in `server.log`.

## Contribution Guide

We welcome contributions to improve and expand the offline course player! Follow the steps below to contribute:

1. **Fork the repository**.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/thisisamank/desk.git
   ```
3. **Create a new branch**:
   ```bash
   git checkout -b feature-name
   ```
4. **Make your changes**.
5. **Commit your changes**:
   ```bash
   git commit -m "Add feature-name"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature-name
   ```
7. **Create a pull request**.

### Opening an Issue

If you encounter a bug or have a feature request, please open an issue on our GitHub repository. Provide as much detail as possible to help us address the issue effectively. Use the following template to ensure all necessary information is included:

1. **Describe the Issue**: Summarize the problem or feature request.
2. **Steps to Reproduce**: List any steps to reproduce the issue or details about the feature.
3. **Environment**: Provide details about your operating system, Node.js version, Python version, and browser (if applicable).
4. **Logs**: Paste relevant server and UI logs by using the format below:



**Happy Learning!**
