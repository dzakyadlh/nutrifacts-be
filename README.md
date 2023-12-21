# Nutrifacts Backend

[![Node.js](https://img.shields.io/badge/Node.js-v14.17.5-green.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-v6.14.14-red.svg)](https://www.npmjs.com/)

#### Welcome to Nutrifacts, where scanning a barcode is the easiest step to a healthier you
This repository is the Capstone Project in [Bangkit Academy 2023](https://grow.google/intl/id_id/bangkit/?tab=machine-learning). This application aims to run from the Backend side of the Nutrifacts application.

## Our Team
| Name                            | Bangkit-ID    | Path               |
| -------------                   | ------------- | -------------      |
| Dzaky Adla Hikmatiyar           | A004BSY2088   | Mobile Development |
| Rangga Saputra                  | C171BSY3346   | Cloud Computing    |
| Ahmad Ryan Al Aqsha             | C208BSY4225   | Cloud Computing    |
| Mohamad Vikry Athari            | M004BSY1465   | Machine Learning   |
| Riefky Ichsan Baihaqi           | M010BSY1309   | Machine Learning   |
| Guntur Awaludin Saptadi         | M200BSY1914   | Machine Learning   |
## Installation

1. **Clone this repository:**

    ```bash
    git clone https://github.com/dzakyadlh/nutrifacts-be.git
    ```

2. **Move to the project directory:**

    ```bash
    cd nutrifacts-be
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```
## Usage

1. **Make sure the configuration on the database in the [connection.js](connection.js) file is as needed**
2. **Run the application:**

    ```bash
    npm run start
    ```

3. **Open the application in a browser:**

    ```
    http://localhost:3000
    ```
4. **You can also run the app in [Postman](https://www.postman.com/):**

    ```
    http://localhost:3000
    ```
5. **Because this project uses [Json Web Tokens](https://jwt.io/) to authenticate security, in order to access all existing routes, you must first log in to get a Token. in [Postman](https://www.postman.com/) do the following :**

- Signup by accessing the route `http://localhost:3000/user/signup` with the `POST` method if you do not have an account to log in.
![Signup](https://storage.googleapis.com/nutrifactsapp/photo_readme_github/readme_signup.PNG)
- After successful signup, login to generate an access token to the route `http://localhost:3000/user/login` with the `POST` method.
![login](https://storage.googleapis.com/nutrifactsapp/photo_readme_github/login_readme.PNG)
- After successfully logging in, the authentication token will be generated, you can use the token in the header section for authorization, in order to access all existing routes.
![success](https://storage.googleapis.com/nutrifactsapp/photo_readme_github/success_readme.PNG)

6. **You can now access the routes available on our Nutrifacts backend.** to see what routes are available please open the [routes](routes) folder

## Features

- Backend application using [Express Js](https://expressjs.com)
- Secure route authentication, using [Json Web Token](https://jwt.io/)
- Using [Express Generator](https://expressjs.com/en/starter/generator.html) to ease the folder structure

## Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file [LICENSE](LICENSE) untuk detailnya.

