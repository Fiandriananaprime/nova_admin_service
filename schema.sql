-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE seller_application_status AS ENUM (
    'not_submitted',
    'pending',
    'approved',
    'rejected'
);

CREATE TYPE business_type AS ENUM (
    'individual',
    'company'
);

CREATE TYPE seller_document_type AS ENUM (
    'identity',
    'business_registration',
    'tax_document',
    'bank_account'
);

CREATE TYPE document_review_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TYPE application_review_action AS ENUM (
    'approved',
    'rejected'
);


-- ============================================================
-- SELLER APPLICATIONS
-- ============================================================

CREATE TABLE seller_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    applicant_user_id UUID,

    status seller_application_status NOT NULL DEFAULT 'not_submitted',

    submitted_at TIMESTAMPTZ(6),
    verified_at TIMESTAMPTZ(6),

    comments TEXT,

    store_name TEXT,
    location TEXT,

    business_type business_type,

    tax_id TEXT,
    registration_number TEXT,

    approved_at TIMESTAMPTZ(6),
    approved_by_admin_id UUID,

    rejection_reason TEXT,

    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);


-- ============================================================
-- SELLER APPLICATION DOCUMENTS
-- ============================================================

CREATE TABLE seller_application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL,

    type seller_document_type NOT NULL,

    status document_review_status NOT NULL DEFAULT 'pending',

    file_url TEXT,

    uploaded_at TIMESTAMPTZ(6) NOT NULL DEFAULT now(),

    rejection_reason TEXT,

    CONSTRAINT fk_seller_application_documents_application
        FOREIGN KEY (application_id)
        REFERENCES seller_applications(id)
        ON DELETE CASCADE
);


-- ============================================================
-- SELLER APPLICATION REVIEWS
-- ============================================================

CREATE TABLE seller_application_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL,

    admin_id UUID NOT NULL,

    action application_review_action NOT NULL,

    reason TEXT,

    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT now(),

    CONSTRAINT fk_seller_application_reviews_application
        FOREIGN KEY (application_id)
        REFERENCES seller_applications(id)
        ON DELETE CASCADE
);


-- ============================================================
-- PLATFORM SETTINGS
-- Singleton
-- ============================================================

CREATE TABLE platform_settings (
    id BOOLEAN PRIMARY KEY DEFAULT true,

    platform_name TEXT,

    commission_rate DECIMAL(5, 2),

    default_delivery_fee DECIMAL(19, 4),

    maintenance_mode BOOLEAN,

    allow_new_registrations BOOLEAN,

    allow_new_seller_applications BOOLEAN,

    require_product_moderation BOOLEAN,

    require_seller_approval BOOLEAN,

    default_language TEXT,

    timezone TEXT,

    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);


-- ============================================================
-- PLATFORM EVENTS
-- ============================================================

CREATE TABLE platform_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    actor_id UUID,

    actor_name TEXT,

    actor_type TEXT NOT NULL,

    event_type TEXT NOT NULL,

    resource_type TEXT,

    resource_id TEXT,

    metadata JSONB NOT NULL DEFAULT '{}',

    ip_address TEXT,

    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);


-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    admin_id UUID NOT NULL,

    admin_name TEXT NOT NULL,

    action TEXT NOT NULL,

    resource TEXT NOT NULL,

    resource_id TEXT,

    metadata JSONB NOT NULL DEFAULT '{}',

    ip_address TEXT NOT NULL,

    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_seller_applications_status
    ON seller_applications (status, submitted_at DESC);

CREATE INDEX idx_seller_applications_applicant
    ON seller_applications (applicant_user_id);


CREATE INDEX idx_seller_application_documents_application
    ON seller_application_documents (application_id);

CREATE INDEX idx_seller_application_documents_status
    ON seller_application_documents (status);


CREATE INDEX idx_seller_application_reviews_application
    ON seller_application_reviews (application_id, created_at DESC);


CREATE INDEX idx_platform_events_created
    ON platform_events (created_at DESC);

CREATE INDEX idx_platform_events_actor
    ON platform_events (actor_type, actor_id, created_at DESC);

CREATE INDEX idx_platform_events_resource
    ON platform_events (resource_type, resource_id, created_at DESC);

CREATE INDEX idx_platform_events_event_type
    ON platform_events (event_type, created_at DESC);


CREATE INDEX idx_audit_logs_admin_date
    ON audit_logs (admin_id, created_at DESC);

CREATE INDEX idx_audit_logs_resource
    ON audit_logs (resource, resource_id, created_at DESC);