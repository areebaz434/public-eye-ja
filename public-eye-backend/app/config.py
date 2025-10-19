import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    
    # Supabase
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
    
    # Google Vision
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    # Security
    API_KEY = os.getenv('API_KEY')
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')
    
    # AI
    AI_CONFIDENCE_THRESHOLD = float(os.getenv('AI_CONFIDENCE_THRESHOLD', '70.0'))
    MAX_IMAGE_SIZE_MB = 5
    
    @staticmethod
    def validate():
        required = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'GOOGLE_APPLICATION_CREDENTIALS', 'API_KEY']
        missing = [var for var in required if not os.getenv(var)]
        if missing:
            raise EnvironmentError(f"Missing: {', '.join(missing)}")
        return True