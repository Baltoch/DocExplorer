FROM node:21.6.2
RUN apt update && \
    apt-get install -y tesseract-ocr=5.3.0-2
RUN tesseract -v