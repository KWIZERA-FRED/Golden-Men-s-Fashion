# Step 1: Use an official lightweight Python runtime as a parent image
FROM python:3.11-slim

# Step 2: Prevent Python from writing .pyc files to disk and ensure logs print immediately
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Step 3: Set the working directory inside the container to /app
WORKDIR /app

# Step 4: Install system dependencies needed to compile packages like PyMySQL / SQLAlchemy
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmariadb-dev \
    && rm -rf /var/lib/apt/lists/*

# Step 5: Copy only the requirements file first to take advantage of Docker caching
COPY requirements.txt .

# Step 6: Install the Python dependencies listed in your requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Step 7: Copy the rest of your backend source code into the container
COPY . .

# Step 8: Inform Docker that the container listens on port 5000 at runtime
EXPOSE 5000

# Step 9: Run the application using Gunicorn pointing to run.py's app instance
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]