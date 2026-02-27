FROM sagemath/sagemath:latest

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN sage -pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
