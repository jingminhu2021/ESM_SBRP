FROM python:3.12.0-slim-bookworm
WORKDIR /usr/src/app
COPY . .
RUN ls -al
RUN python -m pip install --no-cache-dir -r requirements.txt
CMD [ "python", "./main.py" ]