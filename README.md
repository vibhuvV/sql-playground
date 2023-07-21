# SQL-Playground

This is a dashboard where users can execute different queries and get data in tabular form. The data can be of as long as the user want and the application will not crash as it uses virtualization to only show data that is present on the screen. Users can download csv files and can also view their queries history.

## Dependencies

- React - Framework used
- Typescript - For type safety
- react-csv - For downloading CSV files
- react-virtual - For enabling virtual scroll in table
- tanstack/react-table - For enabling virtual scroll in table
- react-syntax-highlighter - For highlighting the SQL syntax
- react-ace - Code editor
- shadcn/ui - UI Library used because it provides us the ability to only install those components which we need in our application
- tailwindcss - For faster development

## Dev Dependencies

- ESlint - For linting
- Husky - pre-commit hook
- vite - bundler

## Features

- Write SQL queries and get data in tabular form.
- Get syntax highlighting for SQL queries
- View queries history. View what were the queries that were executed.
- View very large chunk of data without page getting crashed.
- Download CSV file for the data in the table

## How to Setup

Install `nvm` [Link](https://github.com/nvm-sh/nvm)

```bash
nvm use

yarn install

yarn dev
```

## Available commands

Run in development mode

```bash
  yarn dev
```

Create production build

```bash
  yarn build
```

Run ESLint linting

```bash
  yarn lint
```

Run Prettier formatting

```bash
  yarn format
```

Run TypeScript compiling

```bash
  yarn compile
```

Serve production build locally

```bash
  yarn preview
```

## Resources

- [Vite](https://github.com/vitejs/vite)
- [Airbnb JS Style Guide](https://github.com/airbnb/javascript)
- [Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [Husky](https://github.com/typicode/husky)
