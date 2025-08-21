# Use an official Python runtime as a parent image.
# python:3.11-slim is a good choice for being relatively small and modern.
FROM python:3.11-slim

# Set the working directory in the container to /app
WORKDIR /app

# Install system dependencies that might be needed by some Python packages
# (e.g., build-essential for compiling, psycopg2 for postgres drivers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first to leverage Docker's layer caching.
# The layer will only be rebuilt if requirements.txt changes.
COPY ./requirements.txt /app/requirements.txt

# Install the Python dependencies
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

# Copy the rest of your application's code into the container
COPY ./app /app/app

# Expose port 8000 to allow communication with the app
EXPOSE 8000

# Command to run the Uvicorn server when the container starts.
# This is the entry point for your FastAPI application.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
