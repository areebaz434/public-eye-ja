from supabase import create_client, Client
from typing import Dict, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self, url: str, key: str):
        self.client: Client = create_client(url, key)
    
    def update_report_ai_data(self, report_id: str, category_id: Optional[str], 
                              confidence: float, ai_raw_data: Dict[str, Any]) -> bool:
        try:
            update_data = {
                'ai_raw_data': ai_raw_data,
                'ai_confidence': confidence,
                'updated_at': datetime.utcnow().isoformat()
            }
            
            if category_id:
                update_data['category_id'] = category_id
            
            from app.config import Config
            if confidence >= Config.AI_CONFIDENCE_THRESHOLD:
                update_data['status'] = 'approved'
                update_data['approved_at'] = datetime.utcnow().isoformat()
            
            self.client.table('reports').update(update_data).eq('id', report_id).execute()
            logger.info(f"Updated report {report_id} (confidence: {confidence:.2f}%)")
            return True
        except Exception as e:
            logger.error(f"Error updating report: {str(e)}")
            return False
    
    def get_categories(self) -> list:
        try:
            response = self.client.table('categories').select('*').eq('is_active', True).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching categories: {str(e)}")
            return []