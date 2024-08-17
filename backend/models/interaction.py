from __future__ import annotations


import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, Union
from pydantic import BaseModel, UUID4, AfterValidator
from enum import Enum

class InteractionType(str, Enum):
    HIRING_MANAGER = 'HIRING_MANAGER'
    INITIAL_CONTACT = 'INITIAL_CONTACT'
    PHONE_SCREENING = 'PHONE_SCREENING'

class Interaction(BaseModel):
    interaction_id: Optional[Union[UUID4, str]] = None
    application_id: Union[UUID4, str] = None
    name: str
    company: str
    job_title: str
    interaction_type: InteractionType
    rating: int
    notes: Optional[str] = None
    interaction_timestamp: Optional[datetime] = None

    @staticmethod
    def from_json(json_data: Dict[str, Any]) -> 'Interaction':
        # Validate and convert interaction type
        interaction_type_str = json_data.get('type')
        if interaction_type_str not in InteractionType.__members__:
            raise TypeError('bad type')
        interaction_type = InteractionType(interaction_type_str)

        return Interaction(
            interaction_id=json_data['id'] if 'id' in json_data else None,
            application_id=json_data.get('application_id'),
            name=json_data.get('name'),
            company=json_data.get('company'),
            job_title=json_data.get('job_title'),
            interaction_type=interaction_type,
            rating=json_data.get('rating'),
            notes=json_data.get('notes'),
            applied_timestamp=json_data.get('interaction_timestamp')
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.interaction_id,
            'application_id': self.application_id,
            'name': self.name,
            'company': self.company,
            'job_title': self.job_title,
            'type': self.interaction_type.name,
            'rating': self.rating,
            'notes': self.notes,
            'interaction_timestamp': str(self.interaction_timestamp)
        }

    class Config:
        # This makes sure that UUIDs are serialized to strings in the output dict
        json_encoders = {
            uuid.UUID: str,
            InteractionType: str,
            datetime: lambda v: v.isoformat()  # Ensure datetime is serialized as ISO string
        }
