# SurveyGenie Frontend

## This is the frontend for the SurveyGenie application built with React. Follow these steps to set up and run the project on your local machine.

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn (package managers)

## Setup Instructions

1. Clone the Repository
   Start by cloning the repository to your local machine:

```bash
git clone <repo-url>
cd surveyGenie_frontend
```

- you can skip this step if you already did it for the backend api

2.  Install Dependencies
    Install the necessary dependencies using npm or yarn:

```bash
npm install
```

or

```bash
yarn install
```

3. Environment Variables
   You will need to set up environment variables for the application to function correctly. Create a .env file in the root directory of the project with the following content:

```bash

REACT_APP_API_URL="http://localhost:3001" # URL of your backend API
REACT_APP_OTHER_ENV_VAR="your-value" # Any other environment variables you need
```

- REACT_APP_API_URL: The base URL for your backend API. Adjust this to point to your API server.
- REACT_APP_OTHER_ENV_VAR: Any other environment variables required for your application.

4. Running the Development Server
   To start the development server, run:

```bash
npm run dev
```

This will start the development server on http://localhost:3001 (or the port specified in your configuration).

5. Running Tests
   To run the test suite, use the following command:

```bash
npm test
```

or

```bash
npm run coverage
```

This will execute the test cases defined in your project.

7. To connect with the backend api, ensure that the back dependencies are installed and the api server is up and running.
