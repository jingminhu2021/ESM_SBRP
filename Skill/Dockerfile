FROM python:3.11.4-slim-bookworm
WORKDIR /usr/src/app
COPY . .
RUN ls -al
RUN python -m pip install --no-cache-dir -r requirements.txt
CMD [ "python", "./skill.py" ]