from flask import Flask
from flask_cors import CORS
import logging

from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    Config.validate()
    
    CORS(app, resources={
        r"/api/*": {
            "origins": Config.ALLOWED_ORIGINS,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-API-Key"]
        }
    })
    
    logging.basicConfig(level=logging.INFO)
    
    from app.routes.ai_routes import ai_bp
    app.register_blueprint(ai_bp)
    
    @app.route('/')
    def index():
        return {
            'service': 'Public Eye JA Backend',
            'version': '1.0.0',
            'status': 'running'
        }
    
    return app