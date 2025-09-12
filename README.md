## Pokedex App with Web Scraping and MongoDB Integration

A full-stack Pokémon database app built using Flask, BeautifulSoup, and MongoDB. The app scrapes Pokémon data from the Pokémon Database
website and stores it in a local MongoDB database. The back-end serves a RESTful API to retrieve and display detailed Pokémon information, 
including stats, types, abilities, moves, and more.


Note: The MongoDB database used in this project was populated using a web scraper application, which can be found here: https://github.com/Jibran-Som/Pokedex_Web_Scraper.git

## Technologies Used

- Back-End: Flask (Python)
- Scraping: BeautifulSoup (Python)
- Database: MongoDB (NoSQL)
- API: RESTful API with Flask
- Other Tools: Requests

## Features

- **MongoDB Integration:** Uses MongoDB to store and manage Pokémon data, enabling fast data retrieval.
- **RESTful API:** A Flask-powered REST API to access Pokémon data based on queries (search by name, type, etc.).
- **Detailed Pokémon Information:** Retrieves Pokédex entries and learnable moves for a richer experience.
- **Pagination & Filtering:** Supports efficient searching, filtering, and pagination for large datasets.
- **Unique ID Generation:** Handles Pokémon with alternative names or forms by creating unique identifiers.

## Setup Instructions

### Prerequisites

- **Python 3.x** installed
- **MongoDB** (local instance or MongoDB Atlas)



## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Note: Ensure that the Flask back-end is also running at http://localhost:5000 
so that the front-end can connect to the database.

