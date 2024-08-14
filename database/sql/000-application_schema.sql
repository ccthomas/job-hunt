CREATE TABLE IF NOT EXISTS application.application
(
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    company character varying(36) COLLATE pg_catalog."default" NOT NULL,
    link text COLLATE pg_catalog."default",
    job_title text COLLATE pg_catalog."default",
    applied_timestamp timestamptz,
	deleted_timestamp timestamptz,
    CONSTRAINT application_pkey PRIMARY KEY (id)
)