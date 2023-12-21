# Nutrifacts Backend

[![Node.js](https://img.shields.io/badge/Node.js-v14.17.5-green.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-v6.14.14-red.svg)](https://www.npmjs.com/)

This repository is the Capstone Project in [Bangkit Academy 2023](https://grow.google/intl/id_id/bangkit/?tab=machine-learning). This application aims to run from the Backend side of the Nutrifacts application.
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
5. Because this project uses [Json Web Tokens](https://jwt.io/) to authenticate security, in order to access all existing routes, you must first log in to get a Token. in [Postman](https://www.postman.com/) do the following :
- Signup by accessing the route `http://localhost:3000/user/signup` with the `POST` method if you do not have an account to log in.
![Signup](https://storage.googleapis.com/nutrifactsapp/photo_readme_github/readme_signup.PNG)

      
## Features

- Cool features first.
- Attractive features second.
- Great features third.

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan ikuti langkah-langkah berikut:

1. Fork repositori ini.
2. Buat cabang fitur baru: `git checkout -b fitur-baru`
3. Lakukan perubahan dan commit: `git commit -m 'Menambahkan fitur baru'`
4. Push ke cabang fitur: `git push origin fitur-baru`
5. Buat pull request.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file [LICENSE](LICENSE) untuk detailnya.

