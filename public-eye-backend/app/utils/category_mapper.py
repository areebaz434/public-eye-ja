from typing import List, Dict, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class CategoryMapper:
    LABEL_MAPPINGS = {
        'Pothole': ['pothole', 'road damage', 'asphalt', 'crack', 'hole', 'road', 'street', 'highway', 'pavement damage' ],
        'Broken Streetlight': ['street light', 'streetlight', 'lamp', 'lighting'],
        'Illegal Dumping': ['garbage', 'trash', 'waste', 'dump', 'litter'],
        'Drainage Issue': ['drain', 'drainage', 'gutter', 'sewer', 'clogged', 'water', 'flooding'],
        'Overgrown Vegetation': ['vegetation', 'plant', 'tree', 'bush', 'overgrown'],
        'Graffiti': ['graffiti', 'vandalism', 'spray paint'],
        'Sidewalk Damage': ['sidewalk', 'walkway', 'footpath', 'pavement'],
        'Electrical Hazard': ['wire', 'cable', 'electrical', 'power line']
    }
    
    def __init__(self, categories: List[Dict]):
        self.categories = {cat['name']: cat for cat in categories}
    
    def find_best_match(self, vision_labels: List[Dict]) -> Tuple[Optional[str], float, List[Dict]]:
        category_scores = {}
        
        for category_name, keywords in self.LABEL_MAPPINGS.items():
            score = 0
            matching_labels = []
            
            for label in vision_labels:
                label_desc = label['description'].lower()
                label_score = label['score']
                
                for keyword in keywords:
                    if keyword.lower() in label_desc or label_desc in keyword.lower():
                        score += label_score * 1.2
                        matching_labels.append({'label': label['description'], 'score': label_score})
                        break
            
            if score > 0:
                category_scores[category_name] = {'score': score, 'matching_labels': matching_labels}
        
        if not category_scores:
            return None, 0.0, []
        
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1]['score'], reverse=True)
        best_category_name, best_data = sorted_categories[0]
        best_category = self.categories.get(best_category_name)
        
        if not best_category:
            return None, 0.0, []
        
        max_possible = sum(label['score'] for label in vision_labels[:3]) * 1.2
        confidence = min((best_data['score'] / max_possible) * 100, 100)
        
        suggestions = [
            {
                'category_id': self.categories[cat_name]['id'],
                'category_name': cat_name,
                'confidence': min((data['score'] / max_possible) * 100, 100),
                'matching_labels': data['matching_labels']
            }
            for cat_name, data in sorted_categories[:3]
            if cat_name in self.categories
        ]
        
        logger.info(f"Best match: {best_category_name} ({confidence:.2f}%)")
        return best_category['id'], confidence, suggestions