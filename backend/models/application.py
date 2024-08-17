from __future__ import annotations

import logging
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, Union
from pydantic import BaseModel, UUID4, AfterValidator
from utils import setup_logger


class Application(BaseModel):
    application_id: Optional[Union[UUID4, str]] = None
    company: str
    link: str
    job_title: str
    applied_timestamp: Optional[datetime] = None

    @staticmethod
    def from_json(json_data: Dict[str, Any]) -> 'Application':
        return Application(
            application_id=json_data['id'] if 'id' in json_data else None,
            company=json_data.get('company'),
            link=json_data.get('link'),
            job_title=json_data.get('job_title'),
            applied_timestamp=json_data.get('applied_timestamp')
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.application_id,
            'company': self.company,
            'link': self.link,
            'job_title': self.job_title,
            'applied_timestamp': self.applied_timestamp
        }

    class Config:
        # This makes sure that UUIDs are serialized to strings in the output dict
        json_encoders = {
            uuid.UUID: str
        }
