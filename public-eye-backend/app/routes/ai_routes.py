from flask import Blueprint, request, jsonify
from functools import wraps
import logging
import requests

from app.config import Config
from app.services.vision_service import VisionService
from app.services.supabase_service import SupabaseService
from app.utils.category_mapper import CategoryMapper

logger = logging.getLogger(__name__)

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

supabase_service = SupabaseService(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_KEY)
vision_service = VisionService()

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key != Config.API_KEY:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@ai_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Public Eye JA AI Service',
        'version': '1.0.0'
    }), 200

@ai_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = supabase_service.get_categories()
        return jsonify({'success': True, 'categories': categories}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@ai_bp.route('/process-image', methods=['POST'])
@require_api_key
def process_image():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No JSON data'}), 400
        
        report_id = data.get('report_id')
        image_url = data.get('image_url')
        
        if not report_id or not image_url:
            return jsonify({'success': False, 'error': 'Missing report_id or image_url'}), 400
        
        # Download image
        response = requests.get(image_url)
        if response.status_code != 200:
            return jsonify({'success': False, 'error': 'Failed to download image'}), 400
        
        image_data = response.content
        
        # Analyze with Vision API
        vision_result = vision_service.analyze_image(image_data)
        
        # Get categories
        categories = supabase_service.get_categories()
        if not categories:
            return jsonify({'success': False, 'error': 'No categories found'}), 500
        
        # Map to category
        mapper = CategoryMapper(categories)
        category_id, confidence, suggestions = mapper.find_best_match(vision_result['labels'])
        
        # Update report
        success = supabase_service.update_report_ai_data(
            report_id=report_id,
            category_id=category_id,
            confidence=confidence,
            ai_raw_data=vision_result
        )
        
        if not success:
            return jsonify({'success': False, 'error': 'Failed to update report'}), 500
        
        return jsonify({
            'success': True,
            'report_id': report_id,
            'category_id': category_id,
            'confidence': round(confidence, 2),
            'suggestions': suggestions,
            'requires_review': confidence < Config.AI_CONFIDENCE_THRESHOLD,
            'labels': vision_result['labels'][:10]
        }), 200
        
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500