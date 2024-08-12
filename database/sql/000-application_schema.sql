CREATE SCHEMA IF NOT EXISTS application;

CREATE TABLE application.application (
    id VARCHAR(36) PRIMARY KEY,
    company VARCHAR(36) NOT NULL, -- Name now. UUID Later
    link TEXT,
    job_title TEXT,
    applied_timestamp TIMESTAMPTZ
)