from __future__ import annotations

import logging
import uuid
from dateutil.parser import isoparse
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
        # Parse datetime if available
        timestamp_str = json_data.get('applied_timestamp')
        applied_timestamp = isoparse(timestamp_str) if timestamp_str else None

        return Application(
            application_id=json_data['id'] if 'id' in json_data else None,
            company=json_data.get('company'),
            link=json_data.get('link'),
            job_title=json_data.get('job_title'),
            applied_timestamp=applied_timestamp
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.application_id,
            'company': self.company,
            'link': self.link,
            'job_title': self.job_title,
            'applied_timestamp': str(self.applied_timestamp)
        }

    class Config:
        # This makes sure that UUIDs are serialized to strings in the output dict
        json_encoders = {
            uuid.UUID: str
        }
