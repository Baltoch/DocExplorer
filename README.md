# DocExplorer

DocExplorer is an open source AI powered PDF scanner generating the text and the metadata of documents from images.  

[![License](https://img.shields.io/github/license/Baltoch/DocExplorer)](https://github.com/Baltoch/DocExplorer)
[![GitHub issues](https://img.shields.io/github/issues/Baltoch/DocExplorer)](https://github.com/Baltoch/DocExplorer/issues)
[![GitHub stars](https://img.shields.io/github/stars/Baltoch/DocExplorer)](https://github.com/Baltoch/DocExplorer/stargazers)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## About

Lost in a jungle of documents? DocExplorer is there to help! By generating metadata for your pdf files, DocExplorer aims at making it easier for you to find your files whenever you need them.

## Features

Here's a list of DocExplorer's key features:

- Intelligent scanning
- Optical Character Recognition (OCR) to generate computer readable and editable text
- Metadata generation using Large Language Model (LLM)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Docker: Install Docker by following the instructions on the [official Docker documentation](https://docs.docker.com/get-docker/).

## Installation

1. Clone the repository:

    ```bash
    git clone --depth 1 --branch latest https://github.com/Baltoch/DocExplorer.git
    ```

2. Navigate to the project directory:

    ```bash
    cd DocExplorer
    ```

3. Run Docker Compose to build and start the services:

    ```bash
    docker-compose up -d
    ```

## Usage

The project is still in development. If you are interested in using it give a star to the repository. You can also [send an email](mailto:balthazar.lebreton@gmail.com) and we'll try to keep you updated. 

## Contributing

We welcome contributions from the community! If you'd like to contribute to DocExplorer, please follow these steps:

1. Fork the repository.
2. Create a new branch 

    ```bash
    git checkout -b feature/your-feature
    ```
3. Make your changes.
4. Commit your changes 

    ```bash
    git add .
    git commit -am 'Add some feature'
    ```
5. Push to the branch 

    ```bash
    git push origin feature/your-feature
    ```
6. Create a new Pull Request.

## License

This project is licensed under the [GNU Affero General Public License Version 3](https://github.com/Baltoch/DocExplorer/blob/main/LICENSE)

## Support

If you encounter any issues or have questions regarding DocExplorer, feel free to [open an issue](https://github.com/Baltoch/DocExplorer/issues) on GitHub.

Thank you for using DocExplorer! We hope you find it useful. Happy coding! 