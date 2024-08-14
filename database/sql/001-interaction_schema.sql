CREATE TABLE IF NOT EXISTS application.interaction
(
    id character varying(36) NOT NULL,
    application_id character varying(36) NOT NULL,
    name character varying(255) NOT NULL,
    company character varying(36) COLLATE pg_catalog."default" NOT NULL,
    job_title text COLLATE pg_catalog."default",
    type character varying(30),
    notes text,
    rating int,
    interaction_timestamp timestamptz,
	deleted_timestamp timestamptz,
    CONSTRAINT interaction_pkey PRIMARY KEY (id)
)