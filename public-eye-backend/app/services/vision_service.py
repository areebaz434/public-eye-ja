from google.cloud import vision
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class VisionService:
    def __init__(self):
        self.client = vision.ImageAnnotatorClient()
    
    def analyze_image(self, image_data: bytes) -> Dict[str, Any]:
        try:
            image = vision.Image(content=image_data)
            response = self.client.label_detection(image=image)
            labels = response.label_annotations
            
            if response.error.message:
                raise Exception(response.error.message)
            
            detected_labels = [
                {
                    'description': label.description,
                    'score': round(label.score * 100, 2),
                    'topicality': round(label.topicality * 100, 2)
                }
                for label in labels
            ]
            
            detected_labels.sort(key=lambda x: x['score'], reverse=True)
            
            logger.info(f"Detected {len(detected_labels)} labels")
            
            return {
                'labels': detected_labels,
                'label_count': len(detected_labels),
                'top_label': detected_labels[0] if detected_labels else None
            }
        except Exception as e:
            logger.error(f"Error analyzing image: {str(e)}")
            raise