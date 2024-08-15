import json
from typing import Dict, Any, Optional
from enum import Enum

class InteractionType(str, Enum):
    HIRING_MANAGER = 'HIRING_MANAGER'
    INITIAL_CONTACT = 'INITIAL_CONTACT'
    PHONE_SCREENING = 'PHONE_SCREENING'

class Interaction:
    def __init__(
            self,
            id: Optional[str],
            application_id: str,
            name: str,
            company: str,
            job_title: str,
            type: InteractionType,
            rating: int,
            notes: str,
            interaction_timestamp: str
        ):
        self.id = id
        self.application_id = application_id
        self.name = name
        self.company = company
        self.job_title = job_title
        self.type = type
        self.rating = rating
        self.notes = notes
        self.interaction_timestamp = interaction_timestamp

    @staticmethod
    def from_json(json_data: Dict[str, Any]) -> 'Interaction':
        try:
            interaction_type = InteractionType(json_data['type'])
        except ValueError:
            raise ValueError(f"Invalid interaction type: {json_data['type']}")

        return Interaction(
            id=json_data.get('id'),
            application_id=json_data['application_id'],
            name=json_data['name'],
            company=json_data['company'],
            job_title=json_data['job_title'],
            type=interaction_type,
            rating=json_data['rating'],
            notes=json_data['notes'],
            interaction_timestamp=json_data['interaction_timestamp']
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'application_id': self.application_id,
            'name': self.name,
            'company': self.company,
            'job_title': self.job_title,
            'type': self.type,
            'rating': self.rating,
            'notes': self.notes,
            'interaction_timestamp': self.interaction_timestamp
        }
