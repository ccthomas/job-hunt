import json
from typing import Dict, Any, Optional

class Application:
    def __init__(self, id: Optional[str], company: str, link: str, job_title: str, applied_timestamp: str):
        self.id = id
        self.company = company
        self.link = link
        self.job_title = job_title
        self.applied_timestamp = applied_timestamp

    @staticmethod
    def from_json(json_data: Dict[str, Any]) -> 'Application':
        return Application(
            id=json_data['id'] if 'id' in json_data else None,
            company=json_data['company'],
            link=json_data.get('link'),
            job_title=json_data.get('job_title'),
            applied_timestamp=json_data.get('applied_timestamp')
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'company': self.company,
            'link': self.link,
            'job_title': self.job_title,
            'applied_timestamp': self.applied_timestamp
        }
