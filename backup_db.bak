--
-- PostgreSQL database dump
--

\restrict T2aXMiZwrS3vb74MAI65rU6aS1JOBhS2WB1eN4fNBM3xBkygwcPV2U4WcoYpg6u

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS "user_roles_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS "translations_languageId_fkey";
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS "translations_keyId_fkey";
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS "sessions_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS "projects_createdBy_fkey";
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS "projects_contentTypeId_fkey";
ALTER TABLE IF EXISTS ONLY public.project_translations DROP CONSTRAINT IF EXISTS "project_translations_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public.project_translations DROP CONSTRAINT IF EXISTS "project_translations_languageId_fkey";
ALTER TABLE IF EXISTS ONLY public.project_images DROP CONSTRAINT IF EXISTS "project_images_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public.instagram_posts DROP CONSTRAINT IF EXISTS "instagram_posts_projectId_fkey";
ALTER TABLE IF EXISTS ONLY public.content_page_translations DROP CONSTRAINT IF EXISTS "content_page_translations_pageId_fkey";
ALTER TABLE IF EXISTS ONLY public.content_page_translations DROP CONSTRAINT IF EXISTS "content_page_translations_languageId_fkey";
ALTER TABLE IF EXISTS ONLY public.component_translations DROP CONSTRAINT IF EXISTS "component_translations_languageId_fkey";
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS "accounts_userId_fkey";
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public."user_roles_userId_key";
DROP INDEX IF EXISTS public."user_preferences_sessionId_key";
DROP INDEX IF EXISTS public."translations_languageId_idx";
DROP INDEX IF EXISTS public."translations_keyId_languageId_key";
DROP INDEX IF EXISTS public."translations_keyId_idx";
DROP INDEX IF EXISTS public.translation_keys_key_key;
DROP INDEX IF EXISTS public.translation_keys_category_idx;
DROP INDEX IF EXISTS public.social_integrations_platform_key;
DROP INDEX IF EXISTS public.site_settings_key_key;
DROP INDEX IF EXISTS public.sessions_token_key;
DROP INDEX IF EXISTS public."project_translations_projectId_languageId_key";
DROP INDEX IF EXISTS public.languages_code_key;
DROP INDEX IF EXISTS public."instagram_posts_projectId_key";
DROP INDEX IF EXISTS public."instagram_posts_instagramId_key";
DROP INDEX IF EXISTS public."cookie_consents_sessionId_key";
DROP INDEX IF EXISTS public.content_types_name_key;
DROP INDEX IF EXISTS public.content_pages_slug_key;
DROP INDEX IF EXISTS public."content_page_translations_pageId_languageId_key";
DROP INDEX IF EXISTS public."component_translations_pageBuilderId_languageId_idx";
DROP INDEX IF EXISTS public."component_translations_componentId_pageBuilderId_languageId_key";
DROP INDEX IF EXISTS public."component_translations_componentId_idx";
DROP INDEX IF EXISTS public."analytics_events_sessionId_idx";
DROP INDEX IF EXISTS public."analytics_events_pagePath_idx";
DROP INDEX IF EXISTS public."analytics_events_eventType_idx";
DROP INDEX IF EXISTS public."analytics_events_createdAt_idx";
DROP INDEX IF EXISTS public."accounts_accountId_key";
ALTER TABLE IF EXISTS ONLY public.verifications DROP CONSTRAINT IF EXISTS verifications_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.user_preferences DROP CONSTRAINT IF EXISTS user_preferences_pkey;
ALTER TABLE IF EXISTS ONLY public.translations DROP CONSTRAINT IF EXISTS translations_pkey;
ALTER TABLE IF EXISTS ONLY public.translation_keys DROP CONSTRAINT IF EXISTS translation_keys_pkey;
ALTER TABLE IF EXISTS ONLY public.social_integrations DROP CONSTRAINT IF EXISTS social_integrations_pkey;
ALTER TABLE IF EXISTS ONLY public.site_settings DROP CONSTRAINT IF EXISTS site_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS projects_pkey;
ALTER TABLE IF EXISTS ONLY public.project_translations DROP CONSTRAINT IF EXISTS project_translations_pkey;
ALTER TABLE IF EXISTS ONLY public.project_images DROP CONSTRAINT IF EXISTS project_images_pkey;
ALTER TABLE IF EXISTS ONLY public.languages DROP CONSTRAINT IF EXISTS languages_pkey;
ALTER TABLE IF EXISTS ONLY public.instagram_posts DROP CONSTRAINT IF EXISTS instagram_posts_pkey;
ALTER TABLE IF EXISTS ONLY public.cookie_consents DROP CONSTRAINT IF EXISTS cookie_consents_pkey;
ALTER TABLE IF EXISTS ONLY public.content_types DROP CONSTRAINT IF EXISTS content_types_pkey;
ALTER TABLE IF EXISTS ONLY public.content_pages DROP CONSTRAINT IF EXISTS content_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.content_page_translations DROP CONSTRAINT IF EXISTS content_page_translations_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.component_translations DROP CONSTRAINT IF EXISTS component_translations_pkey;
ALTER TABLE IF EXISTS ONLY public.analytics_events DROP CONSTRAINT IF EXISTS analytics_events_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS accounts_pkey;
DROP TABLE IF EXISTS public.verifications;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.user_preferences;
DROP TABLE IF EXISTS public.translations;
DROP TABLE IF EXISTS public.translation_keys;
DROP TABLE IF EXISTS public.social_integrations;
DROP TABLE IF EXISTS public.site_settings;
DROP TABLE IF EXISTS public.sessions;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.project_translations;
DROP TABLE IF EXISTS public.project_images;
DROP TABLE IF EXISTS public.languages;
DROP TABLE IF EXISTS public.instagram_posts;
DROP TABLE IF EXISTS public.cookie_consents;
DROP TABLE IF EXISTS public.content_types;
DROP TABLE IF EXISTS public.content_pages;
DROP TABLE IF EXISTS public.content_page_translations;
DROP TABLE IF EXISTS public.contact_messages;
DROP TABLE IF EXISTS public.component_translations;
DROP TABLE IF EXISTS public.analytics_events;
DROP TABLE IF EXISTS public.accounts;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_events (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "pagePath" text NOT NULL,
    "pageTitle" text,
    referrer text,
    "userAgent" text,
    language text,
    country text,
    "ipAddress" text,
    "eventType" text DEFAULT 'pageview'::text NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: component_translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.component_translations (
    id text NOT NULL,
    "componentId" text NOT NULL,
    "pageBuilderId" text NOT NULL,
    "languageId" text NOT NULL,
    "fieldPath" text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "projectType" text NOT NULL,
    message text NOT NULL,
    "privacyAccepted" boolean DEFAULT true NOT NULL,
    "marketingConsent" boolean DEFAULT false NOT NULL,
    read boolean DEFAULT false NOT NULL,
    replied boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: content_page_translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_page_translations (
    id text NOT NULL,
    "pageId" text NOT NULL,
    "languageId" text NOT NULL,
    title text NOT NULL,
    content jsonb NOT NULL
);


--
-- Name: content_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_pages (
    id text NOT NULL,
    slug text NOT NULL,
    published boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: content_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_types (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    fields jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: cookie_consents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cookie_consents (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    essential boolean DEFAULT true NOT NULL,
    analytics boolean DEFAULT false NOT NULL,
    marketing boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: instagram_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.instagram_posts (
    id text NOT NULL,
    "instagramId" text NOT NULL,
    "imageUrl" text NOT NULL,
    caption text NOT NULL,
    "postedAt" timestamp(3) without time zone NOT NULL,
    "syncedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "projectId" text
);


--
-- Name: languages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.languages (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: project_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_images (
    id text NOT NULL,
    "projectId" text,
    "originalUrl" text NOT NULL,
    "thumbnailUrl" text NOT NULL,
    alt text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: project_translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_translations (
    id text NOT NULL,
    "projectId" text NOT NULL,
    "languageId" text NOT NULL,
    title text NOT NULL,
    description jsonb NOT NULL,
    materials text[]
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id text NOT NULL,
    "contentTypeId" text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    published boolean DEFAULT true NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    category text NOT NULL,
    description text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: social_integrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.social_integrations (
    id text NOT NULL,
    platform text NOT NULL,
    "displayName" text NOT NULL,
    config jsonb NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: translation_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.translation_keys (
    id text NOT NULL,
    key text NOT NULL,
    category text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.translations (
    id text NOT NULL,
    "keyId" text NOT NULL,
    "languageId" text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_preferences (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    language text DEFAULT 'nl'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id text NOT NULL,
    "userId" text NOT NULL,
    role text NOT NULL,
    permissions jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verifications (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
HPA1mniFGLXN27z1W97SbUUix4bRhZeR	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	credential	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	\N	\N	\N	\N	\N	\N	9e670ef23d83583c5919f1f87cb3ccb9:a4a47a41a414500b6cca19713b455d9a454a0d908a7d4aa550269237fe789e3e36b95f39f21fb17edf568d410a58a5c0ddb71a04e32c7419b16068d837126a78	2025-11-07 10:06:24.81	2025-11-07 10:06:24.81
\.


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_events (id, "sessionId", "pagePath", "pageTitle", referrer, "userAgent", language, country, "ipAddress", "eventType", metadata, "createdAt") FROM stdin;
cmhoqg8nn00007r6yw1qs6692	session_1762511129141_qn5u54idp	/projects	Projects | Portfolio	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 10:48:45.779
cmhoqiwhl00017r6ybzhmqi1s	session_1762511129141_qn5u54idp	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 10:50:49.978
cmhoqj3nu00027r6yeg5uzipb	session_1762511129141_qn5u54idp	/about	Over Ons	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 10:50:59.275
cmhoqjbic00037r6ywy1m1qsx	session_1762511129141_qn5u54idp	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 10:51:09.443
cmhoql2s600047r6yvc9woaf1	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 10:52:31.446
cmhoqpzbb00057r6y3ie3v1ot	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 10:56:20.232
cmhoqq7r300067r6yvb6nlwfh	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 10:56:31.168
cmhoqsbjp00077r6ykia6ojhd	session_1762511129141_qn5u54idp	/projects	Projects | Portfolio	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 10:58:09.397
cmhor3izc00087r6yw7oq6o99	session_1762511129141_qn5u54idp	/projects	Projects | Portfolio	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:06:52.249
cmhor3kmi00097r6ym2db5vke	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:06:54.378
cmhor4bm3000a7r6yxggee1ig	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:07:29.354
cmhor6ptx000b7r6y4ba6t4q7	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:09:21.094
cmhor9wbr000c7r6y9lquvw9d	session_1762511129141_qn5u54idp	/projects	Projects | Portfolio	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:11:49.478
cmhora3ys000d7r6y5cdqw0xu	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:11:59.381
cmhorxf2g000e7r6ygt9wofqf	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:30:06.856
cmhoryr2i00007rmp6bjmubnc	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:31:09.067
cmhorz7wq00017rmphb9q2nlq	session_1762511129141_qn5u54idp	/projects	Projects | Portfolio	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:31:30.89
cmhorzcss00027rmpogrwnxgv	session_1762511129141_qn5u54idp	/about	Over Ons	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:31:37.228
cmhorzeq800037rmp2l1vwxb8	session_1762511129141_qn5u54idp	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:31:39.728
cmhorzs0500047rmpeuq06f5k	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:31:56.934
cmhorzt6400057rmpho2a86m9	session_1762511129141_qn5u54idp	/about	Over Ons	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:31:58.444
cmhorzuht00067rmpczwreado	session_1762511129141_qn5u54idp	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:32:00.162
cmhorzvmo00077rmplce1t0lj	session_1762511129141_qn5u54idp	/about	Over Ons	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:32:01.633
cmhorzxe700087rmpvtn911h0	session_1762511129141_qn5u54idp	/projects	Projects | Portfolio	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:32:03.919
cmhorzz1900097rmpcpijm8st	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 11:32:06.046
cmhowmg99000a7rmp9ug31g5w	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 13:41:33.261
cmhown2fv000b7rmpojm7z6z0	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 13:42:02.012
cmhowodxo000c7rmpck0b0dq0	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 13:43:03.565
cmhowohb7000d7rmpu7x8beji	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 13:43:07.939
cmhoworci000e7rmptk4yey2r	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 13:43:20.947
cmhowqon1000f7rmpc5s496zi	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 13:44:50.749
cmhowy2oo000g7rmpwpr59gx9	session_1762511129141_qn5u54idp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 13:50:35.544
cmhpg3q33000v7rmp7da7znqo	session_1762523525168_4wo5fo8xo	/terms	404: This page could not be found.	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 22:46:51.855
cmhpg3ujb000w7rmp9zwf5ov5	session_1762523525168_4wo5fo8xo	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-07 22:46:57.616
cmhrjmlon000b7r0mz1octk2k	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:01:03.815
cmhrjo93x000c7r0mto8t3soz	session_1762680746159_wr9eydbrp	/projects	Projects | Portfolio	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:02:20.83
cmhrjodza000d7r0mybujgy61	session_1762680746159_wr9eydbrp	/about	Over Ons	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:02:27.143
cmhrjofyx000e7r0mkxov6zdm	session_1762680746159_wr9eydbrp	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:02:29.722
cmhrjokvu000f7r0mkradra9o	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:02:36.089
cmhrjopo3000g7r0m3xkgq4l6	session_1762680746159_wr9eydbrp	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:02:42.291
cmhrjoq84000h7r0mja1p4igy	session_1762680746159_wr9eydbrp	/about	Over Ons	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:02:43.012
cmhrjoqpe000i7r0mwqqf87by	session_1762680746159_wr9eydbrp	/projects	Projects | Portfolio	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:02:43.633
cmhrjoqy8000j7r0m85e6os59	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/login	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:02:43.952
cmhrl2aji000k7r0miru7gswj	session_1762680746159_wr9eydbrp	/projects	Projects | Portfolio	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:41:15.487
cmhrlcw4d000l7r0mlkqgn5zv	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:49:30.013
cmhrlcya8000m7r0me4e1vuk9	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/", "projectId": "cmhoq5ad1000b7rvzh403k1eb", "projectTitle": "Salontafel Zebrano"}	2025-11-09 10:49:32.816
cmhrld48k000n7r0my5npp026	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/", "projectId": "cmhoq5acf00017rvzagq3yi08", "projectTitle": "Tafel Es (Zoniënwoud)"}	2025-11-09 10:49:40.533
cmhrld6pj000o7r0mrn422yt4	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/", "projectId": "cmhoq5ae8001c7rvz86awe0kj", "projectTitle": "Salontafel Notelaar"}	2025-11-09 10:49:43.735
cmhrld9ix000p7r0m267mdao3	session_1762680746159_wr9eydbrp	/projects	Projects | Portfolio	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:49:47.386
cmhrldafj000q7r0mkjphqsxo	session_1762680746159_wr9eydbrp	/projects	Projects | Portfolio	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/projects", "projectId": "cmhoq5ae8001c7rvz86awe0kj", "projectTitle": "Salontafel Notelaar"}	2025-11-09 10:49:48.559
cmhrldee4000r7r0mdjp3pkmy	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:49:53.691
cmhrleknk000s7r0m6aoc3kyy	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:50:48.465
cmhrlmngf000t7r0m5qzg50bn	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/", "projectId": "cmhoq5acf00017rvzagq3yi08", "projectTitle": "Tafel Es (Zoniënwoud)"}	2025-11-09 10:57:05.343
cmhrlmx2l000u7r0mecoec05y	session_1762680746159_wr9eydbrp	/projects	Projects | Portfolio	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:57:17.805
cmhrlmy48000v7r0mu5crjzt2	session_1762680746159_wr9eydbrp	/projects	Projects | Portfolio	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/projects", "projectId": "cmhoq5ae8001c7rvz86awe0kj", "projectTitle": "Salontafel Notelaar"}	2025-11-09 10:57:19.161
cmhrlp6j9000y7r0msouplk4p	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 10:59:03.381
cmhrmh2a3000z7r0mdnha3v5q	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 11:20:44.236
cmhrmm5fa00107r0mv6xulj1r	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 11:24:41.59
cmhrmmvcq00117r0mem3imuae	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 11:25:15.195
cmhrmotbo00127r0m7oxd0oeu	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 11:26:45.877
cmhrmoxd500137r0m5ufpb3og	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 11:26:51.114
cmhrmp2da00147r0mb72ldtff	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 11:26:57.599
cmhrmp78f00157r0mzlphmlbm	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 11:27:03.903
cmhronvuv00167r0my5kuux3b	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 12:22:01.735
cmhrosk5a00177r0miekhlsw5	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 12:25:39.838
cmhroum9v00187r0m9sw3vp71	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 12:27:15.907
cmhrow0hi00197r0mcmjhfcrg	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 12:28:20.981
cmhrqazk0001a7r0m4us7fga7	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 13:07:59.233
cmhrqcbsy001b7r0ml4eoju2x	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 13:09:01.762
cmhrqd2l1001c7r0m1exkjh0o	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 13:09:36.469
cmhruek0s00007r0ayfshwgfi	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin/analytics	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 15:02:44.187
cmhrufw5800017r0a39vjety6	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin/analytics	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 15:03:46.557
cmhrw5lm200007rrmotmioys8	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 15:51:45.579
cmhrw5raw00017rrm6x40rky9	session_1762680746159_wr9eydbrp	/login	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 15:51:52.952
cmhrwak6v00027rrmgmn91kmi	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 15:55:37.015
cmhrwg78r00037rrmv7azf2bs	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:00:00.172
cmhrwl5r000047rrmuqwnpk0o	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:03:51.517
cmhrwl7hs00057rrmp6ojszxp	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/", "projectId": "cmhoq5ae8001c7rvz86awe0kj", "projectTitle": "Salontafel Notelaar"}	2025-11-09 16:03:53.776
cmhrwlhct00067rrmcaj2n3fq	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/", "projectId": "cmhoq5ae8001c7rvz86awe0kj", "projectTitle": "Salontafel Notelaar"}	2025-11-09 16:04:06.558
cmhrwmfwg00077rrmqbre1804	session_1762680746159_wr9eydbrp	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:04:51.328
cmhrwmml500087rrmpwjhkdrp	session_1762680746159_wr9eydbrp	/settings/projects	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:04:59.993
cmhrx8epd00097rrmv8tb4cze	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:21:56.21
cmhrx8hz2000a7rrm05e7zuy4	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/", "projectId": "cmhoq5adl000t7rvzjs2d2608", "projectTitle": "Tafels Thelma"}	2025-11-09 16:22:00.446
cmhrxbuwo000c7rrmxi2djbw6	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:24:37.177
cmhrxcnfx000d7rrme2q8zabk	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:25:14.157
cmhrxct0g000e7rrmiihu12xo	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:25:21.376
cmhrxdjnw000g7rrmyh3ly92v	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:25:55.916
cmhrxhftt000i7rrmey1rtxnp	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 16:28:57.57
cmhs198kj00007r63plqilu45	session_1762680746159_wr9eydbrp	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 18:14:33.363
cmhs2bxj400017riqrj2i8y0u	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 18:44:38.656
cmhs2n3f200037riqzrq9iy2z	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 18:53:19.498
cmhs2v1u900057riq1sicw0k9	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 18:59:30.705
cmhs2w9vh00067riqfby36gkf	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:00:27.772
cmhs2wmic00087riq0li1gtho	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:00:44.148
cmhs2xde3000a7riq97k1mxwr	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:01:18.987
cmhs2xmq8000b7riqrnwm5ykt	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:01:31.088
cmhs2xq8n000c7riq8r9mtbqy	session_1762713869019_qy426f1ji	/projects/2	Project Not Found	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:01:35.64
cmhs2xtrh000d7riqo0ue5jal	session_1762713869019_qy426f1ji	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:01:40.205
cmhs2xwe2000e7riq8cll3b2s	session_1762713869019_qy426f1ji	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/projects", "projectId": "cmhoq5ae8001c7rvz86awe0kj", "projectTitle": "Salontafel Notelaar"}	2025-11-09 19:01:43.611
cmhs2y24a000f7riqwtqarco3	session_1762713869019_qy426f1ji	/projects/2	Project Not Found	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:01:51.035
cmhs2y2ts000g7riqyslhkm4g	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:01:51.953
cmhs2y3vo000h7riq9wzjwih2	session_1762713869019_qy426f1ji	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:01:53.316
cmhs2y5rt000i7riqzwixdp60	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:01:55.77
cmhs2zyw0000j7riqn6v9bqbi	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin/page-builder	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:03:20.161
cmhs3053i000l7riqpvj0htid	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/admin/page-builder	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:03:28.206
cmhs3b3po000m7riq3cr18wdy	session_1762713869019_qy426f1ji	/projects	Projects | Portfolio	http://localhost:3020/admin/page-builder	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:11:59.609
cmhs3i41f000n7riqwwmw2l6v	session_1762713869019_qy426f1ji	/projects	Projects | Portfolio	http://localhost:3020/admin/page-builder	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:17:26.643
cmhs3nbnc000o7riqezjwdvce	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:21:29.785
cmhs3nm3m000q7riq2lnkd8i7	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:21:43.328
cmhs3o83r000r7riqncpuxs1i	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:22:11.847
cmhs3rt8t000u7riq0mem2m20	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:24:59.214
cmhs3sldt000v7riqldk14tgo	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:25:35.682
cmhs3ud24000w7riqwon10kkp	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:26:58.205
cmhs48xz1000x7riqqhldfikw	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:38:18.494
cmhs4axg1000y7riqh572g19t	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:39:51.121
cmhs4ew3b00117riq7w4fqsaj	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:42:55.99
cmhs4hbnz00137riqaodhrmjh	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:44:49.487
cmhs4iyvb00147riqt7s31gur	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:46:06.216
cmhs4tw1400157riqgqyi6c3f	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 19:54:35.752
cmhs5n69400167riq3wwqyu6j	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 20:17:22.025
cmhs6f8ks00177riqxuicrlx6	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 20:39:11.4
cmhs6jam800187riqhg1wypuc	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 20:42:20.672
cmhs6qivs00197riqq5ib8aq6	session_1762713869019_qy426f1ji	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 20:47:57.977
cmhs6qlf1001a7riq6l9l4h6v	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 20:48:01.261
cmhs6zbgg001b7riq0mnubg0f	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 20:54:48.257
cmhs7quby001c7riqhksjtipn	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:16:12.431
cmhs7uzvp001d7riq3uyvzzx8	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:19:26.246
cmhs7vp6700007rc5z9ajbi6i	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:19:59.024
cmhs7wbtk00017rc5uvmtb21s	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:20:28.377
cmhs7xats00037rc5zfwt67hu	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:21:13.745
cmhs822lq00047rc5wg08oenx	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:24:56.367
cmhs84g5000057rc512kyubs2	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:26:47.22
cmhs8hz2w00067rc51b37zr2m	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:37:18.296
cmhs8ncfs00077rc5s798bhel	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:41:28.888
cmhs8tv8000007rfyqp5vgpcd	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:46:33.168
cmhs930e400027rfyxd1wnixf	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:53:39.772
cmhs94all00037rfy8p3bww3g	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 21:54:39.658
cmhs9gj0500047rfyvns8dlot	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 22:04:10.421
cmhs9h91e00057rfydwoinw59	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 22:04:44.162
cmhs9vyve00067rfy1gcayb36	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 22:16:10.827
cmhsa1b7f00077rfys0fugqk8	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 22:20:20.091
cmhsab0ga00087rfyoyem62lg	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 22:27:52.715
cmhsbt6f100097rfyfiycmkls	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 23:09:59.869
cmhsc56dz000b7rfyiodpqzkd	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 23:19:19.703
cmhsccqzf000d7rfyrbyd91mw	session_1762713869019_qy426f1ji	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-09 23:25:12.984
cmhsw3m6v00027retp1b1ijer	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 08:37:59.192
cmhsw8qs800037retvdsxw3ei	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 08:41:58.424
cmhswkcv400047ret169oq7q0	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 08:51:00.256
cmhswn3y300057retivmh0ftv	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 08:53:08.668
cmhswqxz600077retplag0nxn	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 08:56:07.554
cmhswvm9r000b7ret1mxbyjco	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 08:59:45.664
cmhsx0hxr000d7ret9ja2w3r5	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 09:03:33.327
cmhsxiumt000e7ret9dzdqelk	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 09:17:49.589
cmht0m8z0000o7retlmdt1p2o	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:44:26.988
cmht0n3gq000r7ret6zad12yc	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:45:06.506
cmht0n9da000s7ret6pgia6qa	session_1762762435769_q5qkoh6yk	/about		\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:45:14.158
cmht0naxs000t7ret872ypw7w	session_1762762435769_q5qkoh6yk	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:45:16.19
cmht0nbwi000u7retmbyir56b	session_1762762435769_q5qkoh6yk	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/projects", "projectId": "cmhoq5ae8001c7rvz86awe0kj", "projectTitle": "Salontafel Notelaar"}	2025-11-10 10:45:17.443
cmht0neow000v7retjqeldg83	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:45:21.056
cmht0uknm000y7ret9zw2xxiz	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:50:55.375
cmht0v4ef000z7reta9s9266r	session_1762762435769_q5qkoh6yk	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:51:20.968
cmht0v74s00107ret5vtdlnte	session_1762762435769_q5qkoh6yk	/about		\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:51:24.508
cmht0v8nd00117retuo56owaf	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:51:26.473
cmht107cl00127retzlcbs4pc	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:55:18.067
cmht108f500137retm6z4cq0d	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:55:19.458
cmht10wze00147retx2e6nu2m	session_1762762435769_q5qkoh6yk	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:55:51.29
cmht11lb100157retv673q2xf	session_1762762435769_q5qkoh6yk	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	project_view	{"source": "/projects", "projectId": "cmhoq5adw00137rvzfi7qdqy6", "projectTitle": "Bed Frame"}	2025-11-10 10:56:22.814
cmht11yz500167retepbtmd0p	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 10:56:40.529
cmht1igpa00177retunt81tmk	session_1762762435769_q5qkoh6yk	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 11:09:29.998
cmht1l2ct00197retr1gocevu	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 11:11:31.371
cmht4d30j00027r6lhs21wbss	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 12:29:17.827
cmht5a8q300037r6ljo0wpw2c	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 12:55:04.876
cmht5floq00047r6le8aco1s7	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 12:59:14.954
cmht5nwfa00057r6lfloml6ra	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 13:05:42.086
cmhteahuc00077r6lzlmmjokd	session_1762762435769_q5qkoh6yk	/projects	Projects | Portfolio	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 17:07:13.236
cmhtean4o00087r6laygxmkgg	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 17:07:20.088
cmhtefemm000a7r6lnxq7yb48	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 17:11:02.351
cmhtgflt5000b7r6lwnzxuyv6	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:07:10.889
cmhtgg4mr000c7r6l3pdffte0	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:07:35.284
cmhtgm5ox000d7r6lkimzfdyf	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/contact	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:12:16.388
cmhtgmg7r000e7r6lwf2ltl9w	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/contact	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:12:30.231
cmhtgsh7w000f7r6lcuvfcf1n	session_1762762435769_q5qkoh6yk	/about	Over Ons	http://localhost:3020/contact	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:17:11.468
cmhtgsifu000g7r6lajuqu2mu	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/contact	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:17:13.051
cmhtgyvj7000h7r6lo8poszlx	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/contact	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:22:09.956
cmhth0h04000i7r6lapoi0pic	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	http://localhost:3020/contact	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:23:24.436
cmhth1133000j7r6lie6jggun	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	http://localhost:3020/contact	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:23:50.464
cmhth1gaj000k7r6lpb9osine	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:24:10.171
cmhth1wfg000l7r6lsbgwlej6	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:24:31.084
cmhth3ulf000m7r6lrzk9k206	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:26:02.018
cmhth4ne4000n7r6louhtbjp7	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:26:39.339
cmhth5jv7000o7r6lntmltjzg	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:27:21.428
cmhth6dv3000p7r6l4f9ospfe	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:28:00.303
cmhth6zdi000q7r6lbtbzk1j0	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:28:28.182
cmhth8ei5000r7r6lr0fg2no0	session_1762762435769_q5qkoh6yk	/contact	Portfolio | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:29:34.364
cmhthn2ak000s7r6lr9beolqz	session_1762762435769_q5qkoh6yk	/	Exceptional Craftsmanship | Custom Artisan Work	\N	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	en-US	\N	::ffff:127.0.0.1	pageview	{}	2025-11-10 18:40:58.46
\.


--
-- Data for Name: component_translations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.component_translations (id, "componentId", "pageBuilderId", "languageId", "fieldPath", value, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, name, email, "projectType", message, "privacyAccepted", "marketingConsent", read, replied, "createdAt") FROM stdin;
cmhoostbu00117refbzg5wlj2	Jan Janssen	jan.janssen@example.be	Eettafel op maat	Hallo, ik zou graag een offerte willen voor een op maat gemaakte eettafel voor mijn eetkamer. De ruimte is ongeveer 4x5 meter en ik ben geïnteresseerd in een combinatie van staal en eikenhout. Kunnen we een afspraak maken om de mogelijkheden te bespreken?	t	f	f	f	2025-11-05 10:02:33.206
cmhoostbz00127refvlt306v6	Marie Verstraeten	marie.verstraeten@example.be	Boekenkast	Goedemiddag, ik ben op zoek naar een boekenkast die perfect past in mijn woonkamer. Ik heb een muur van 3 meter breed en zou graag een ontwerp willen dat zowel functioneel als esthetisch is. Kunt u me meer informatie geven over uw werkwijze en prijzen?	t	f	t	f	2025-11-02 10:02:33.206
cmhoostc100137refbvayfutw	Tom De Vries	tom.devries@example.be	Wandmeubel	Beste, ik heb jullie werk gezien op Instagram en ben erg onder de indruk. Ik zou graag een wandmeubel willen laten maken voor mijn woonkamer. Het moet een combinatie zijn van open en gesloten opbergruimte. Kunnen we een afspraak maken om dit te bespreken?	t	f	t	t	2025-10-31 10:02:33.206
cmhoostc300147refspet2eqn	Sophie Peeters	sophie.peeters@example.be	Bureautafel	Hallo, ik werk thuis en ben op zoek naar een bureautafel die op maat gemaakt is voor mijn thuiskantoor. De ruimte is beperkt (2x2 meter) dus ik heb iets nodig dat efficiënt gebruik maakt van de ruimte. Kunnen jullie me helpen?	t	f	f	f	2025-11-06 10:02:33.206
cmhoostc600157reff2p8e1y8	Pieter Van Der Berg	pieter.vandenberg@example.be	Keukenmeubel	Goedemiddag, ik ben bezig met een keukenrenovatie en ben op zoek naar een uniek keukenmeubel dat als eiland kan dienen. Ik ben geïnteresseerd in een combinatie van staal en terrazzo. Kunnen we een afspraak maken om de mogelijkheden te bespreken?	t	f	f	f	2025-11-07 07:02:33.206
\.


--
-- Data for Name: content_page_translations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.content_page_translations (id, "pageId", "languageId", title, content) FROM stdin;
cmhoosta8000q7refcbkbhwup	cmhoosta1000o7reffqqdoos9	cmhoost5m00007refpcjkkep3	Over Ons	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Wij maken elegante en functionele meubels die afgestemd zijn op mensen die ze dagdagelijks gebruiken. Alle meubels worden in huis ontworpen en handgemaakt in onze werkplaats. We voeren zoveel mogelijk zelf uit zodat de meubels precies worden zoals we ze willen hebben. Onze geliefkoosde materialen zijn staal en hout van een duurzame oorsprong. Maar als een ontwerp nog wat extras vraagt schromen we niet om te werken met materialen zoals glas, terrazzo en messing.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Elk ontwerp wordt tot in het kleinste detail afgewerkt. We testen onze meubels grondig op levensduurte en stabiliteit, want wij willen dat ze landurig gebruikt kunnen worden en men er jaren kan van genieten. Voor ons is het belangrijk dat bij het op maat ontwerpen er rekening gehouden wordt met de ruimte waar het werk terecht zal komen. Onze meubels zijn zowel een praktische als esthetische toevoeging aan de plaats waar ze zullen staan.", "type": "text"}]}]}
cmhoostai000s7refje9zaig8	cmhoosta1000o7reffqqdoos9	cmhoost6300017refg0dkno6u	À Propos	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Nous créons des meubles élégants et fonctionnels adaptés aux personnes qui les utilisent quotidiennement. Tous les meubles sont conçus en interne et fabriqués à la main dans notre atelier. Nous effectuons autant que possible nous-mêmes pour que les meubles soient exactement comme nous le souhaitons. Nos matériaux préférés sont l'acier et le bois d'origine durable. Mais si un design demande encore quelques extras, nous n'hésitons pas à travailler avec des matériaux comme le verre, le terrazzo et le laiton.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Chaque design est fini dans les moindres détails. Nous testons nos meubles en profondeur pour leur durabilité et leur stabilité, car nous voulons qu'ils puissent être utilisés pendant longtemps et que l'on puisse en profiter pendant des années. Pour nous, il est important que lors de la conception sur mesure, on tienne compte de l'espace où l'œuvre sera placée. Nos meubles sont à la fois un ajout pratique et esthétique à l'endroit où ils seront placés.", "type": "text"}]}]}
cmhoostaw000v7ref6p7r2504	cmhoostas000t7refj5wwckqa	cmhoost5m00007refpcjkkep3	Contact	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Neem contact met ons op voor vragen over onze meubels of voor een op maat gemaakte opdracht. We staan klaar om samen met u uw droommeubel te ontwerpen en te realiseren.", "type": "text"}]}]}
cmhoostb3000x7refkflppvuh	cmhoostas000t7refj5wwckqa	cmhoost6300017refg0dkno6u	Contact	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Contactez-nous pour des questions sur nos meubles ou pour une commande sur mesure. Nous sommes prêts à concevoir et réaliser votre meuble de rêve avec vous.", "type": "text"}]}]}
\.


--
-- Data for Name: content_pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.content_pages (id, slug, published, "updatedAt") FROM stdin;
cmhoosta1000o7reffqqdoos9	about	t	2025-11-07 10:02:33.145
cmhoostas000t7refj5wwckqa	contact	t	2025-11-07 10:02:33.172
\.


--
-- Data for Name: content_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.content_types (id, name, "displayName", fields, "isActive", "createdAt", "updatedAt") FROM stdin;
cmhoost6j00047ref6zxxkzf7	projects	Projecten	{"title": {"type": "string", "required": true}, "images": {"type": "images", "required": false}, "materials": {"type": "array", "required": false}, "description": {"type": "richtext", "required": true}}	t	2025-11-07 10:02:33.02	2025-11-07 10:02:33.02
cmhoost6q00057ref5xp065wa	services	Diensten	{"price": {"type": "string", "required": false}, "title": {"type": "string", "required": true}, "description": {"type": "richtext", "required": true}}	f	2025-11-07 10:02:33.026	2025-11-07 10:02:33.026
cmhoost6w00067ref9cgsvp3x	products	Producten	{"price": {"type": "string", "required": false}, "title": {"type": "string", "required": true}, "description": {"type": "richtext", "required": true}, "availability": {"type": "string", "required": false}}	f	2025-11-07 10:02:33.032	2025-11-07 10:02:33.032
\.


--
-- Data for Name: cookie_consents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cookie_consents (id, "sessionId", essential, analytics, marketing, "createdAt", "updatedAt") FROM stdin;
cmhopwi8c00007r2yfhtgrgvz	session_1762511129141_qn5u54idp	t	t	t	2025-11-07 10:33:25.068	2025-11-07 10:33:25.068
cmhp1ryrb000h7rmpd49lhza0	session_1762523525168_4wo5fo8xo	t	t	t	2025-11-07 16:05:48.599	2025-11-07 22:46:51.7
cmhrjmlf0000a7r0mk1a1ixp6	session_1762680746159_wr9eydbrp	t	t	t	2025-11-09 10:01:03.468	2025-11-09 10:01:03.468
cmhrlnx3a000w7r0m5p024cls	session_1762685876792_gz67ngk9v	t	f	f	2025-11-09 10:58:04.486	2025-11-09 10:58:33.255
cmhs2bx8n00007riqzjcbyxjz	session_1762713869019_qy426f1ji	t	t	t	2025-11-09 18:44:38.279	2025-11-09 18:44:38.279
cmhsc69kh000c7rfyznoo602n	session_1762730409009_go0yg6k38	t	f	f	2025-11-09 23:20:10.481	2025-11-09 23:20:10.481
cmhsw3lmw00017retk9jwqvdy	session_1762762435769_q5qkoh6yk	t	t	t	2025-11-10 08:37:58.473	2025-11-10 08:37:58.473
cmht23tp0001a7retvmdg6ans	session_1762773965541_7wh9n9nee	t	f	f	2025-11-10 11:26:06.612	2025-11-10 11:26:06.612
cmht5oxhg00067r6lxvoeqn3x	session_1762779988355_iu7bs3n46	t	f	f	2025-11-10 13:06:30.149	2025-11-10 13:06:30.149
cmhtec48c00097r6lr5vqoet2	session_1762794507896_sbgelohof	t	f	f	2025-11-10 17:08:28.908	2025-11-10 17:08:28.908
cmhtyeka100007rtipf9p8ek2	session_1762828211299_j7rud9zhh	t	f	f	2025-11-11 02:30:15.337	2025-11-11 02:30:15.337
cmhucqvb700017rtixo1257z7	session_1762852301275_6rs1ocgk6	t	f	f	2025-11-11 09:11:44.131	2025-11-11 09:11:44.131
cmhudsvp400007r2uohjwyfcr	session_1762853395763_r9cwardif	t	f	f	2025-11-11 09:41:17.56	2025-11-11 09:41:17.56
cmhudypl200017r2ur8q2ogwd	session_1762854344590_7784ir6yi	t	f	f	2025-11-11 09:45:49.574	2025-11-11 09:45:49.574
cmhvxvx5p00087ryvptk76x71	session_1762942760467_nmx9ckhho	t	f	f	2025-11-12 11:51:17.917	2025-11-12 11:51:17.917
cmhvzxv4p00097ryvpdgm34rp	session_1762948855307_1menlda3t	t	f	f	2025-11-12 12:48:47.834	2025-11-12 12:48:47.834
\.


--
-- Data for Name: instagram_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.instagram_posts (id, "instagramId", "imageUrl", caption, "postedAt", "syncedAt", "isActive", "projectId") FROM stdin;
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.languages (id, code, name, "isDefault", "isActive", "createdAt", "updatedAt") FROM stdin;
cmhoost5m00007refpcjkkep3	nl	Nederlands	t	t	2025-11-07 10:02:32.985	2025-11-07 10:02:32.985
cmhoost6300017refg0dkno6u	fr	Français	f	t	2025-11-07 10:02:33.004	2025-11-07 10:02:33.004
cmhoost6a00027refe06tfycd	en	English	f	f	2025-11-07 10:02:33.01	2025-11-07 10:02:33.01
cmhoost6f00037refvwcf8p8j	de	Deutsch	f	f	2025-11-07 10:02:33.015	2025-11-07 10:02:33.015
\.


--
-- Data for Name: project_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project_images (id, "projectId", "originalUrl", "thumbnailUrl", alt, "order", "createdAt") FROM stdin;
cmhoq5acf00057rvzvg8bwkeg	cmhoq5acf00017rvzagq3yi08	/uploads/1762957031782-Rein_jan2019-1-van-2-2web-b2.jpg	/uploads/thumbnails/thumb-1762957031782-Rein_jan2019-1-van-2-2web-b2.jpg	Tafel Es (Zoniënwoud)	1	2025-11-07 10:40:14.751
cmhoq5acf00067rvzo1u5kmx9	cmhoq5acf00017rvzagq3yi08	/uploads/1762957031943-Rein_jan2019-1-van-1-3.jpg	/uploads/thumbnails/thumb-1762957031943-Rein_jan2019-1-van-1-3.jpg	Tafel Es (Zoniënwoud)	2	2025-11-07 10:40:14.751
cmhoq5acf00077rvzdtmf3a0z	cmhoq5acf00017rvzagq3yi08	/uploads/1762957032094-Rein_jan2019-2-van-2-2.jpg	/uploads/thumbnails/thumb-1762957032094-Rein_jan2019-2-van-2-2.jpg	Tafel Es (Zoniënwoud)	3	2025-11-07 10:40:14.751
cmhoq5acf00087rvz4vdwo8jq	cmhoq5acf00017rvzagq3yi08	/uploads/1762957032213-Rein_jan2019-1-van-1-7.jpg	/uploads/thumbnails/thumb-1762957032213-Rein_jan2019-1-van-1-7.jpg	Tafel Es (Zoniënwoud)	4	2025-11-07 10:40:14.751
cmhoq5acf00097rvzkz13aomt	cmhoq5acf00017rvzagq3yi08	/uploads/1762957032360-Rein_jan2019-1-van-2-2.jpg	/uploads/thumbnails/thumb-1762957032360-Rein_jan2019-1-van-2-2.jpg	Tafel Es (Zoniënwoud)	5	2025-11-07 10:40:14.751
cmhoq5ad1000e7rvz98oig1jq	cmhoq5ad1000b7rvzh403k1eb	/uploads/1762957032480-rein-zebrano5a.jpg	/uploads/thumbnails/thumb-1762957032480-rein-zebrano5a.jpg	Salontafel Zebrano	0	2025-11-07 10:40:14.773
cmhoq5ad1000f7rvz8jpxtcln	cmhoq5ad1000b7rvzh403k1eb	/uploads/1762957032604-rein-zebrano5b.jpg	/uploads/thumbnails/thumb-1762957032604-rein-zebrano5b.jpg	Salontafel Zebrano	1	2025-11-07 10:40:14.773
cmhoq5ad1000g7rvzwhgsn55m	cmhoq5ad1000b7rvzh403k1eb	/uploads/1762957032738-rein-zebrano2.jpg	/uploads/thumbnails/thumb-1762957032738-rein-zebrano2.jpg	Salontafel Zebrano	2	2025-11-07 10:40:14.773
cmhoq5ad1000h7rvzp25efu9x	cmhoq5ad1000b7rvzh403k1eb	/uploads/1762957032852-rein-zebrano1.jpg	/uploads/thumbnails/thumb-1762957032852-rein-zebrano1.jpg	Salontafel Zebrano	3	2025-11-07 10:40:14.773
cmhoq5ad1000i7rvzihaj9mlr	cmhoq5ad1000b7rvzh403k1eb	/uploads/1762957032987-rein-zebrano3.jpg	/uploads/thumbnails/thumb-1762957032987-rein-zebrano3.jpg	Salontafel Zebrano	4	2025-11-07 10:40:14.773
cmhoq5ad1000j7rvzhvpl95yf	cmhoq5ad1000b7rvzh403k1eb	/uploads/1762957033116-rein-zebrano5.jpg	/uploads/thumbnails/thumb-1762957033116-rein-zebrano5.jpg	Salontafel Zebrano	5	2025-11-07 10:40:14.773
cmhoq5adb000o7rvzpelig3zr	cmhoq5adb000l7rvzvz8u2k6i	/uploads/1762957033240-Rein_jan2019-tafeltjeseika.jpg	/uploads/thumbnails/thumb-1762957033240-Rein_jan2019-tafeltjeseika.jpg	Bijzettafels glas, staal en eik	0	2025-11-07 10:40:14.783
cmhoq5adb000p7rvzw22thdxl	cmhoq5adb000l7rvzvz8u2k6i	/uploads/1762957033373-Rein_jan2019-tafeltjeseikb.jpg	/uploads/thumbnails/thumb-1762957033373-Rein_jan2019-tafeltjeseikb.jpg	Bijzettafels glas, staal en eik	1	2025-11-07 10:40:14.783
cmhoq5adb000q7rvzpz9s1i6j	cmhoq5adb000l7rvzvz8u2k6i	/uploads/1762957033495-Rein_jan2019-tafeltjeseik2.jpg	/uploads/thumbnails/thumb-1762957033495-Rein_jan2019-tafeltjeseik2.jpg	Bijzettafels glas, staal en eik	2	2025-11-07 10:40:14.783
cmhoq5adb000r7rvztpe0q6ep	cmhoq5adb000l7rvzvz8u2k6i	/uploads/1762957033629-Rein_jan2019-tafeltjeseik1.jpg	/uploads/thumbnails/thumb-1762957033629-Rein_jan2019-tafeltjeseik1.jpg	Bijzettafels glas, staal en eik	3	2025-11-07 10:40:14.783
cmhoq5adl000w7rvzxuusqna5	cmhoq5adl000t7rvzjs2d2608	/uploads/1762957033746-Rein_Art_Thelma_V1-8-van-11-web-a2.jpg	/uploads/thumbnails/thumb-1762957033746-Rein_Art_Thelma_V1-8-van-11-web-a2.jpg	Tafels Thelma	0	2025-11-07 10:40:14.793
cmhoq5adl000x7rvz77jbcybm	cmhoq5adl000t7rvzjs2d2608	/uploads/1762957033979-Rein_Art_Thelma_V1-8-van-11-web-b2.jpg	/uploads/thumbnails/thumb-1762957033979-Rein_Art_Thelma_V1-8-van-11-web-b2.jpg	Tafels Thelma	1	2025-11-07 10:40:14.793
cmhoq5adl000y7rvzz1dpirs0	cmhoq5adl000t7rvzjs2d2608	/uploads/1762957034204-Rein_Art_Thelma_V1-1-van-11.jpg	/uploads/thumbnails/thumb-1762957034204-Rein_Art_Thelma_V1-1-van-11.jpg	Tafels Thelma	2	2025-11-07 10:40:14.793
cmhoq5adl000z7rvze8u6rg0v	cmhoq5adl000t7rvzjs2d2608	/uploads/1762957034381-Rein_Art_Thelma_V1-4-van-11.jpg	/uploads/thumbnails/thumb-1762957034381-Rein_Art_Thelma_V1-4-van-11.jpg	Tafels Thelma	3	2025-11-07 10:40:14.793
cmhoq5adl00107rvzrkrm6jlw	cmhoq5adl000t7rvzjs2d2608	/uploads/1762957034512-Rein_Art_Thelma_V1-11-van-11.jpg	/uploads/thumbnails/thumb-1762957034512-Rein_Art_Thelma_V1-11-van-11.jpg	Tafels Thelma	4	2025-11-07 10:40:14.793
cmhoq5adl00117rvz70v3h60s	cmhoq5adl000t7rvzjs2d2608	/uploads/1762957034722-Rein_Art_Thelma_V1-6-van-11.jpg	/uploads/thumbnails/thumb-1762957034722-Rein_Art_Thelma_V1-6-van-11.jpg	Tafels Thelma	5	2025-11-07 10:40:14.793
cmhoq5adw00167rvzyox18m2g	cmhoq5adw00137rvzfi7qdqy6	/uploads/1762957034832-Rein_jan2019-bed-1a.jpg	/uploads/thumbnails/thumb-1762957034832-Rein_jan2019-bed-1a.jpg	Bed Frame	0	2025-11-07 10:40:14.805
cmhoq5adw00177rvz8jvo7hlf	cmhoq5adw00137rvzfi7qdqy6	/uploads/1762957035039-Rein_jan2019-bed-1b.jpg	/uploads/thumbnails/thumb-1762957035039-Rein_jan2019-bed-1b.jpg	Bed Frame	1	2025-11-07 10:40:14.805
cmhoq5adw00187rvziyrg0re4	cmhoq5adw00137rvzfi7qdqy6	/uploads/1762957035211-Rein_jan2019-bed-3.jpg	/uploads/thumbnails/thumb-1762957035211-Rein_jan2019-bed-3.jpg	Bed Frame	2	2025-11-07 10:40:14.805
cmhoq5adw00197rvzeus7hmwa	cmhoq5adw00137rvzfi7qdqy6	/uploads/1762957035387-Rein_jan2019-bed-2.jpg	/uploads/thumbnails/thumb-1762957035387-Rein_jan2019-bed-2.jpg	Bed Frame	3	2025-11-07 10:40:14.805
cmhoq5adw001a7rvz46vjso6g	cmhoq5adw00137rvzfi7qdqy6	/uploads/1762957035517-Rein_jan2019-bed-1.jpg	/uploads/thumbnails/thumb-1762957035517-Rein_jan2019-bed-1.jpg	Bed Frame	4	2025-11-07 10:40:14.805
cmhoq5ae8001f7rvzhoqnlgip	cmhoq5ae8001c7rvz86awe0kj	/uploads/1762957035678-Rein-notelaar1a.jpg	/uploads/thumbnails/thumb-1762957035678-Rein-notelaar1a.jpg	Salontafel Notelaar	0	2025-11-07 10:40:14.816
cmhoq5ae8001g7rvzkv5relvk	cmhoq5ae8001c7rvz86awe0kj	/uploads/1762957035885-Rein-notelaar1b.jpg	/uploads/thumbnails/thumb-1762957035885-Rein-notelaar1b.jpg	Salontafel Notelaar	1	2025-11-07 10:40:14.816
cmhrjjlf100077r0mw38sow0l	\N	/uploads/1762682323158-logo.png	/uploads/thumbnails/thumb-1762682323158-logo.jpg	logo	0	2025-11-09 09:58:43.501
cmhoq5acf00047rvzwfiekvp0	cmhoq5acf00017rvzagq3yi08	/uploads/1762957031628-Rein_jan2019-1-van-2-2web-a2.jpg	/uploads/thumbnails/thumb-1762957031628-Rein_jan2019-1-van-2-2web-a2.jpg	Tafel Es (Zoniënwoud)	0	2025-11-07 10:40:14.751
cmhoq5ae8001h7rvzjj0oceq4	cmhoq5ae8001c7rvz86awe0kj	/uploads/1762957036116-Rein-notelaar2.jpg	/uploads/thumbnails/thumb-1762957036116-Rein-notelaar2.jpg	Salontafel Notelaar	2	2025-11-07 10:40:14.816
cmhoq5ae8001i7rvzmhs1y4kw	cmhoq5ae8001c7rvz86awe0kj	/uploads/1762957036252-Rein-notelaar1.jpg	/uploads/thumbnails/thumb-1762957036252-Rein-notelaar1.jpg	Salontafel Notelaar	3	2025-11-07 10:40:14.816
cmhoq5ae8001j7rvzotvf5frj	cmhoq5ae8001c7rvz86awe0kj	/uploads/1762957036440-Rein-notelaar3.jpg	/uploads/thumbnails/thumb-1762957036440-Rein-notelaar3.jpg	Salontafel Notelaar	4	2025-11-07 10:40:14.816
\.


--
-- Data for Name: project_translations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project_translations (id, "projectId", "languageId", title, description, materials) FROM stdin;
cmhoq5acf00037rvz5tn7xwx4	cmhoq5acf00017rvzagq3yi08	cmhoost5m00007refpcjkkep3	Tafel Es (Zoniënwoud)	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Een essenhouten tafel met onderstel uit volstalen buizen. Het hout komt uit het Zoniënwoud uit 1 boomstam. Twee delen zijn in spiegelbeeld opengevouwen met mooie natuurlijke contrasten. Het frame is behandeld door het op te warmen en met wax in te smeren zodat het staal zijn karakter behoudt.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ø 255x100x75 cm", "type": "text"}]}]}	{"Ø 255x100x75 cm"}
cmhoq5ad1000d7rvz0ibj6tn2	cmhoq5ad1000b7rvzh403k1eb	cmhoost5m00007refpcjkkep3	Salontafel Zebrano	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Een ovale salontafel met Zebrano blad. Vol stalen gebogen onderstel behandeld met wax en hitte om het karakter van het staal te bewaren.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ø 60x100x45cm", "type": "text"}]}]}	{"Ø 60x100x45cm"}
cmhoq5adb000n7rvzl7ro3qys	cmhoq5adb000l7rvzvz8u2k6i	cmhoost5m00007refpcjkkep3	Bijzettafels glas, staal en eik	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Zwart stalen onderstel met eikenblad en draadglas legger. Zwart stalen onderstel met eikenblad en stalen legger.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ø 75x45x74cm\\nØ 69x40x66,5cm", "type": "text"}]}]}	{"Ø 75x45x74cm","Ø 69x40x66,5cm"}
cmhoq5adl000v7rvzul8pg2dd	cmhoq5adl000t7rvzjs2d2608	cmhoost5m00007refpcjkkep3	Tafels Thelma	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Combinatie van 3 tafels met zwart gepoederlakt onderstel: Essenhouten tafel Bijzettafel met draadglazen bladen Bijzettafel met plaatstaal en draadglas leggers", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ø 80x160x75cm\\nØ 72x45x74cm\\nØ 69x40x65cm", "type": "text"}]}]}	{"Ø 80x160x75cm","Ø 72x45x74cm","Ø 69x40x65cm"}
cmhoq5adw00157rvzo32n9ttk	cmhoq5adw00137rvzfi7qdqy6	cmhoost5m00007refpcjkkep3	Bed Frame	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Frame gemaakt uit stalen onderdelen gecombineerd met Notelaar. Het bed is volledig demonteerbaar en wordt gemaakt op maat van de matras.", "type": "text"}]}]}	{}
cmhoq5ae8001e7rvz7py9cdqv	cmhoq5ae8001c7rvz86awe0kj	cmhoost5m00007refpcjkkep3	Salontafel Notelaar	{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "Notelaar tafelblad met zwevend blad. Onderstel gemaakt uit rechthoekig profiel, wit gepoederlakt.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "Ø 60x100x45cm", "type": "text"}]}]}	{"Ø 60x100x45cm"}
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, "contentTypeId", featured, published, "createdBy", "createdAt", "updatedAt") FROM stdin;
cmhoq5ae8001c7rvz86awe0kj	cmhoost6j00047ref6zxxkzf7	t	t	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	2025-11-07 10:40:14.816	2025-11-07 16:11:29.579
cmhoq5adw00137rvzfi7qdqy6	cmhoost6j00047ref6zxxkzf7	t	t	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	2025-11-07 10:40:14.805	2025-11-07 16:11:29.582
cmhoq5adl000t7rvzjs2d2608	cmhoost6j00047ref6zxxkzf7	t	t	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	2025-11-07 10:40:14.793	2025-11-07 16:11:30.946
cmhoq5adb000l7rvzvz8u2k6i	cmhoost6j00047ref6zxxkzf7	t	t	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	2025-11-07 10:40:14.783	2025-11-07 16:11:31.846
cmhoq5ad1000b7rvzh403k1eb	cmhoost6j00047ref6zxxkzf7	t	t	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	2025-11-07 10:40:14.773	2025-11-07 16:11:32.866
cmhoq5acf00017rvzagq3yi08	cmhoost6j00047ref6zxxkzf7	t	t	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	2025-11-07 10:40:14.751	2025-11-07 16:11:33.788
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
8kbpVG1gEt6CEL397shlK2lEg43xHvau	2025-11-14 10:06:24.817	0Ea3CpjHQkLbfO3dyLBSsraF1wp7m9Sy	2025-11-07 10:06:24.817	2025-11-07 10:06:24.817			cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP
bRkFYiUzuQMc0mQEn0ffxMSWawNbcKz4	2025-11-16 08:52:06.896	1OrK0SN8tsWlFC6feqzIyr90ATmlzm9Q	2025-11-07 10:26:11.147	2025-11-09 08:52:06.896	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP
zmHmHT9JNMLTGfHZK7xSXtcTND1kgaj6	2025-11-16 15:27:40.798	nUL3Hqi8hCTOfTMDluMaR6DJ3T1FmX7E	2025-11-09 15:27:40.799	2025-11-09 15:27:40.799	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP
FLyYIBUUPn5n1LZraYABQjsCXRtXzMWm	2025-11-19 10:19:27.532	PYHeTeQknes7S3tBUZ3MOMNma1U1xOLP	2025-11-09 09:33:10.936	2025-11-12 10:19:27.533	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP
uOQNig0q50OS082R1txcYLPZasJloqf5	2025-11-19 14:19:09.895	qqQ1l6s0fhzAz5jJeK4X2a6rWyjbfaBf	2025-11-12 14:19:09.898	2025-11-12 14:19:09.898	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (id, key, value, category, description, "updatedAt") FROM stdin;
cmhoost7900077ref1209iysc	site_title	{"en": "Rein Art Design", "fr": "Rein Art Design", "nl": "Rein Art Design"}	general	Site title in different languages	2025-11-07 10:02:33.045
cmhoost7l00087refqyb68stn	site_description	{"en": "Elegant and functional furniture handmade in our workshop", "fr": "Meubles élégants et fonctionnels fabriqués à la main dans notre atelier", "nl": "Elegante en functionele meubels handgemaakt in onze werkplaats"}	general	Site description in different languages	2025-11-07 10:02:33.057
cmhoost8h000d7refcha344ko	site_url	"https://www.reinartdesign.be/"	general	Site URL when deployed	2025-11-07 10:02:33.089
cmhoost8u000g7refushroap4	footer_copyright	"© {year} Rein Art Design. Designed with <3 by truyens.pro"	footer	Footer copyright text with year placeholder	2025-11-07 10:02:33.102
cmhoost91000i7ref5zqtnhxm	theme_colors	{"accent": "#666666", "primary": "#000000", "secondary": "#ffffff"}	theme	Primary theme colors	2025-11-07 10:02:33.11
cmhoost96000j7ref9qjmjhpu	analytics_enabled	false	privacy	Enable privacy-focused analytics	2025-11-07 10:02:33.114
cmhoost99000k7reflqlsgtin	cookie_banner_enabled	true	privacy	Show GDPR cookie consent banner	2025-11-07 10:02:33.118
cmhopwlq700017r2yu5rmkcc6	theme_settings	{"mode": "user-choice", "defaultTheme": "light", "allowUserToggle": true, "grayscaleImages": false, "scrollSnapEnabled": true}	appearance	Theme and appearance settings	2025-11-10 12:29:07.242
cmhvxmzd600007ryvlfkurfxx	contact_categories	["Woonkamermeubels", "Op maat gemaakte meubels"]	contact	Contact form project type categories	2025-11-12 11:44:20.874
cmht0m4ee000h7reteytl5hi5	business_settings	{"city": "Wilsele", "iban": "BE 92 0018 2117 7323", "address": "Bornestraat 285", "country": "België", "whatsapp": "", "legalName": "Rein Art Design BVBA", "vatNumber": "BE 0682 403 611", "postalCode": "3012", "companyName": "Rein Art Design", "companyOwner": "Rein De Keyser", "contactEmail": "contact@reinartdesign.be", "contactPhone": "+ 32 (0) 487 837 041", "businessHours": {"friday": {"open": "09:00", "close": "17:00", "closed": false}, "monday": {"open": "09:00", "close": "17:00", "closed": false}, "sunday": {"open": "09:00", "close": "17:00", "closed": true}, "tuesday": {"open": "09:00", "close": "17:00", "closed": false}, "saturday": {"open": "09:00", "close": "17:00", "closed": true}, "thursday": {"open": "09:00", "close": "17:00", "closed": false}, "wednesday": {"open": "09:00", "close": "17:00", "closed": false}}, "companyRegistration": ""}	company	Business information and company details	2025-11-12 11:44:20.913
cmhoost7s00097refzgwgpylh	company_name	"Rein Art Design"	company	Company name	2025-11-12 11:44:20.919
cmhoost82000a7refmqoc8oa1	company_owner	"Rein De Keyser"	company	Company owner name	2025-11-12 11:44:20.924
cmhoost8l000e7ref6szl7x3x	contact_email	"contact@reinartdesign.be"	contact	Primary contact email address	2025-11-12 11:44:20.927
cmhoost8p000f7ref9y8z0655	contact_phone	"+ 32 (0) 487 837 041"	contact	Primary contact phone number	2025-11-12 11:44:20.93
cmht0ljfm000f7retcxx5taw7	social_settings	{"tiktok": "", "twitter": "", "youtube": "", "facebook": "", "linkedin": "", "instagram": "https://www.instagram.com/reinartdesignbe/", "pinterest": "", "enableSharing": true}	social	Social media links and sharing settings	2025-11-10 10:45:02.095
cmhoost8x000h7refnpuioa89	instagram_url	"https://www.instagram.com/reinartdesignbe/"	social	Instagram profile URL	2025-11-10 10:45:02.104
cmhoost87000b7refer2azora	company_address	"Bornestraat 285\\n3012 Wilsele"	company	Company address	2025-11-12 11:44:20.934
cmhoost8c000c7refsrhsa4km	company_details	{"vat": "BE 0682 403 611", "iban": "BE 92 0018 2117 7323", "legalName": "Rein Art Design BVBA"}	company	Company legal details (IBAN, VAT, etc.)	2025-11-12 11:44:20.938
cmhp1p5dv00007rvqzw95ko5h	homepage_components	[{"id": "hero-1", "data": {"title": {"de": "Rein Art Design", "en": "Rein Art Design", "fr": "Rein Art Design", "nl": "Rein Art Design"}, "height": "screen", "gradient": "from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", "subtitle": {"de": "Elegante und funktionale Möbel handgefertigt in unserer Werkstatt", "en": "Elegant and functional furniture handmade in our workshop", "fr": "Meubles élégants et fonctionnels fabriqués à la main dans notre atelier", "nl": "Elegante en functionele meubels handgemaakt in onze werkplaats"}, "textColor": "#000000", "heroLayout": {"gap": 20, "contentWidth": "full", "textAlignment": "center", "verticalAlignment": "center", "horizontalAlignment": "center"}, "description": {"de": "Wir schaffen elegante und funktionale Möbel, die auf Menschen zugeschnitten sind, die sie täglich nutzen. Alle Möbel werden intern entworfen und in unserer Werkstatt handgefertigt. Unsere bevorzugten Materialien sind Stahl und Holz aus nachhaltiger Herkunft. Aber wenn ein Design noch etwas Extras erfordert, zögern wir nicht, mit Materialien wie Glas, Terrazzo und Messing zu arbeiten.", "en": "We create elegant and functional furniture tailored to people who use them daily. All furniture is designed in-house and handmade in our workshop. We prefer steel and wood from sustainable sources, but we don't hesitate to work with materials like glass, terrazzo, and brass when a design requires it.", "fr": "Nous créons des meubles élégants et fonctionnels adaptés aux personnes qui les utilisent quotidiennement. Tous les meubles sont conçus en interne et fabriqués à la main dans notre atelier. Nos matériaux préférés sont l'acier et le bois d'origine durable. Mais si un design demande encore quelques extras, nous n'hésitons pas à travailler avec des matériaux comme le verre, le terrazzo et le laiton.", "nl": "Wij maken elegante en functionele meubels die afgestemd zijn op mensen die ze dagdagelijks gebruiken. Alle meubels worden in huis ontworpen en handgemaakt in onze werkplaats. Onze geliefkoosde materialen zijn staal en hout van een duurzame oorsprong. Maar als een ontwerp nog wat extras vraagt schromen we niet om te werken met materialen zoals glas, terrazzo en messing."}, "heroElements": [{"id": "hero-1762682346992", "type": "logo", "order": 0, "logoAlt": {"nl": ""}, "logoUrl": "/uploads/1762682323158-logo.png", "visible": true, "logoWidth": 200}, {"id": "legacy-title", "type": "text", "order": 1, "content": {"de": "Rein Art Design", "en": "Rein Art Design", "fr": "Rein Art Design", "nl": "Rein Art Design"}, "visible": true, "fontSize": "7xl", "textType": "heading", "fontWeight": "bold"}, {"id": "legacy-subtitle", "type": "text", "order": 2, "content": {"de": "Elegante und funktionale Möbel handgefertigt in unserer Werkstatt", "en": "Elegant and functional furniture handmade in our workshop", "fr": "Meubles élégants et fonctionnels fabriqués à la main dans notre atelier", "nl": "Elegante en functionele meubels handgemaakt in onze werkplaats"}, "opacity": 90, "visible": true, "fontSize": "3xl", "textType": "subtitle", "fontWeight": "light"}, {"id": "legacy-primary-button", "type": "button", "order": 3, "visible": true, "buttonLink": "/projects", "buttonSize": "lg", "buttonText": {"de": "Projekte Ansehen", "en": "View Projects", "fr": "Voir les Projets", "nl": "Bekijk Projecten"}, "buttonVariant": "primary"}, {"id": "legacy-secondary-button", "type": "button", "order": 4, "visible": true, "buttonLink": "/contact", "buttonSize": "lg", "buttonText": {"de": "Kontakt Aufnehmen", "en": "Contact Us", "fr": "Nous Contacter", "nl": "Contact Opnemen"}, "buttonVariant": "secondary"}], "primaryButton": {"de": "Projekte Ansehen", "en": "View Projects", "fr": "Voir les Projets", "nl": "Bekijk Projecten"}, "backgroundType": "solid", "backgroundImage": "", "secondaryButton": {"de": "Kontakt Aufnehmen", "en": "Contact Us", "fr": "Nous Contacter", "nl": "Contact Opnemen"}, "backgroundOverlayOpacity": 46}, "type": "hero", "order": 0}, {"id": "features-1", "data": {"title": {"de": "Warum Rein Art Design Wählen", "en": "Why Choose Rein Art Design", "fr": "Pourquoi Choisir Rein Art Design", "nl": "Waarom Kiezen Voor Rein Art Design"}, "features": [{"icon": "layers", "title": {"de": "Premium Materialien", "en": "Premium Materials", "fr": "Matériaux Premium", "nl": "Premium Materialen"}, "iconColor": "#000000", "description": {"de": "Unsere bevorzugten Materialien sind Stahl und Holz aus nachhaltiger Herkunft. Aber wenn ein Design noch etwas Extras erfordert, zögern wir nicht, mit Materialien wie Glas, Terrazzo und Messing zu arbeiten.", "en": "We prefer steel and wood from sustainable sources, and we don't hesitate to work with materials like glass, terrazzo, and brass when a design requires it.", "fr": "Nos matériaux préférés sont l'acier et le bois d'origine durable. Mais si un design demande encore quelques extras, nous n'hésitons pas à travailler avec des matériaux comme le verre, le terrazzo et le laiton.", "nl": "Onze geliefkoosde materialen zijn staal en hout van een duurzame oorsprong. Maar als een ontwerp nog wat extras vraagt schromen we niet om te werken met materialen zoals glas, terrazzo en messing."}, "iconBgColor": "#b5835a"}, {"icon": "palette", "title": {"de": "In-House Design & Produktion", "en": "In-House Design & Production", "fr": "Conception et Production Internes", "nl": "In-Huis Ontwerp & Productie"}, "iconColor": "#000000", "description": {"de": "Alle Möbel werden intern entworfen und in unserer Werkstatt handgefertigt. Wir führen so viel wie möglich selbst aus, damit die Möbel genau so werden, wie wir sie haben wollen.", "en": "All furniture is designed in-house and handmade in our workshop. We do as much as possible ourselves so the furniture becomes exactly as we want it.", "fr": "Tous les meubles sont conçus en interne et fabriqués à la main dans notre atelier. Nous effectuons autant que possible nous-mêmes pour que les meubles soient exactement comme nous le souhaitons.", "nl": "Alle meubels worden in huis ontworpen en handgemaakt in onze werkplaats. We voeren zoveel mogelijk zelf uit zodat de meubels precies worden zoals we ze willen hebben."}, "iconBgColor": "#b5835a"}, {"icon": "shield", "title": {"de": "Langlebigkeit & Tests", "en": "Durability & Testing", "fr": "Durabilité & Tests", "nl": "Duurzaamheid & Testen"}, "iconColor": "#000000", "description": {"de": "Jedes Design wird bis ins kleinste Detail fertiggestellt. Wir testen unsere Möbel gründlich auf Langlebigkeit und Stabilität, denn wir möchten, dass sie lange genutzt werden können und man jahrelang Freude daran hat.", "en": "Each design is finished to the smallest detail. We thoroughly test our furniture for durability and stability, because we want them to be used for a long time and enjoyed for years.", "fr": "Chaque design est fini dans les moindres détails. Nous testons nos meubles en profondeur pour leur durabilité et leur stabilité, car nous voulons qu'ils puissent être utilisés pendant longtemps et que l'on puisse en profiter pendant des années.", "nl": "Elk ontwerp wordt tot in het kleinste detail afgewerkt. We testen onze meubels grondig op levensduurte en stabiliteit, want wij willen dat ze landurig gebruikt kunnen worden en men er jaren kan van genieten."}, "iconBgColor": "#b5835a"}], "subtitle": {"de": "Qualität und Langlebigkeit in jedem Stück", "en": "Quality and durability in every piece", "fr": "Qualité et durabilité dans chaque pièce", "nl": "Kwaliteit en duurzaamheid in elk stuk"}, "backgroundColor": "white"}, "type": "features", "order": 2}, {"id": "gallery-1", "data": {"title": {"de": "Ausgewählte Projekte", "en": "Featured Projects", "fr": "Projets en Vedette", "nl": "Uitgelichte Projecten"}, "layout": "grid", "columns": 4, "maxItems": 8, "subtitle": {"de": "Entdecken Sie unsere maßgeschneiderten Möbel", "en": "Discover our custom-made furniture", "fr": "Découvrez nos meubles sur mesure", "nl": "Ontdek onze op maat gemaakte meubels"}, "useCarousel": true, "showFeatured": true, "backgroundColor": "gray-50"}, "type": "gallery", "order": 3}, {"id": "cta-1", "data": {"title": {"de": "Bereit für Ihr Maßgeschneidertes Möbel?", "en": "Ready for Your Custom-Made Furniture?", "fr": "Prêt pour Votre Meuble sur Mesure?", "nl": "Klaar voor Uw Op Maat Gemaakte Meubel?"}, "description": {"de": "Kontaktieren Sie uns für Fragen zu unseren Möbeln oder für eine maßgeschneiderte Bestellung. Wir sind bereit, gemeinsam mit Ihnen Ihr Traummöbel zu entwerfen und zu realisieren.", "en": "Contact us for questions about our furniture or for a custom-made order. We are ready to design and realize your dream furniture together with you.", "fr": "Contactez-nous pour toute question sur nos meubles ou pour une commande personnalisée. Nous sommes prêts à travailler avec vous pour concevoir et réaliser le mobilier de vos rêves.", "nl": "Neem contact met ons op voor vragen over onze meubels of voor een op maat gemaakte opdracht. We staan klaar om samen met u uw droommeubel te ontwerpen en te realiseren."}, "ctaButtonLink": "/contact", "primaryButton": {"de": "Kontakt Aufnehmen", "en": "Contact Us", "fr": "Nous Contacter", "nl": "Contact Opnemen"}, "secondaryButton": {"de": "Projekte Ansehen", "en": "View Projects", "fr": "Voir les Projets", "nl": "Bekijk Projecten"}}, "type": "cta", "order": 4}, {"id": "component-1762717201488-0osi9tryi", "data": {"showcaseTitle": {"fr": "Projet en Vedette", "nl": "Uitgelicht Project"}, "showcaseLayout": "full-image", "backgroundColor": "#ffffff", "showcaseImageAlt": {"fr": "Image du projet", "nl": "Project afbeelding"}, "showcaseImageUrl": "/uploads/1762957036116-Rein-notelaar2.jpg", "showcaseSubtitle": {"fr": "Notre Création la Plus Récente", "nl": "Onze Meest Recente Creatie"}, "showcaseImageSize": "large", "showcaseProjectId": "", "showcaseButtonLink": "", "showcaseButtonText": {"fr": "Voir le Projet", "nl": "Bekijk Project"}, "showcaseDescription": {"fr": "Un bel exemple de notre savoir-faire et de notre attention aux détails.", "nl": "Een prachtig voorbeeld van ons vakmanschap en aandacht voor detail."}}, "type": "feature-showcase", "order": 4}, {"id": "component-1762717212558-1oiocsaew", "data": {"overlayTitle": {"fr": "Titre", "nl": "Titel"}, "overlayContent": {"fr": "Ajoutez votre contenu textuel ici...", "nl": "Voeg hier uw tekstinhoud toe..."}, "overlayImageAlt": {"fr": "Description de l'image", "nl": "Afbeelding beschrijving"}, "overlayImageUrl": "/uploads/1762957035387-Rein_jan2019-bed-2.jpg", "overlayPosition": "top-left", "overlaySubtitle": {"fr": "Sous-titre", "nl": "Ondertitel"}, "overlayBackground": "gradient", "overlayButtonLink": "/projects", "overlayButtonText": {"fr": "Plus d'Informations", "nl": "Meer Informatie"}, "overlayBackgroundOpacity": 97}, "type": "image-text-overlay", "order": 5}, {"id": "component-1762717436462-tpmey8ubq", "data": {"splitTitle": {"fr": "Titre", "nl": "Titel"}, "splitContent": {"fr": "Ajoutez votre contenu textuel ici...", "nl": "Voeg hier uw tekstinhoud toe..."}, "splitImageAlt": {"fr": "Description de l'image", "nl": "Afbeelding beschrijving"}, "splitImageUrl": "/uploads/1762957036440-Rein-notelaar3.jpg", "splitSubtitle": {"fr": "Sous-titre", "nl": "Ondertitel"}, "splitImageSide": "left", "backgroundColor": "#ffffff", "splitButtonLink": "/projects", "splitButtonText": {"fr": "Plus d'Informations", "nl": "Meer Informatie"}, "splitImageRatio": "50-50", "splitImageOverlay": false, "splitImageKenBurns": true, "splitImageParallax": false}, "type": "split-screen", "order": 6}, {"id": "component-1762763773671-gqiq5d1p3", "data": {"heroCarouselTitle": {"nl": "Maatwerk > Ikea"}, "heroCarouselImages": [{"id": "1762763784423", "alt": "Salontafel Notelaar", "src": "/uploads/1762957035678-Rein-notelaar1a.jpg"}, {"id": "1762763789644", "alt": "Salontafel Notelaar", "src": "/uploads/1762957035885-Rein-notelaar1b.jpg"}, {"id": "1762763790949", "alt": "Salontafel Zebrano", "src": "/uploads/1762957032480-rein-zebrano5a.jpg"}, {"id": "1762763792006", "alt": "Salontafel Zebrano", "src": "/uploads/1762957032604-rein-zebrano5b.jpg"}], "heroCarouselParallax": false, "heroCarouselSubtitle": {"nl": "Premium meubels voor liefhebbers van duurzame kwaliteit."}, "heroCarouselButtonLink": "/contact", "heroCarouselButtonText": {"nl": "Contacteer ons"}, "heroCarouselOverlayOpacity": 39}, "type": "hero-carousel", "order": 7}]	page_builder	Homepage page builder components	2025-11-12 14:17:16.63
\.


--
-- Data for Name: social_integrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.social_integrations (id, platform, "displayName", config, "isActive", "createdAt", "updatedAt") FROM stdin;
cmhoost9d000l7ref3rhy6htk	instagram	Instagram	{"userId": "", "profileUrl": "https://www.instagram.com/rein_art_design/", "accessToken": "", "refreshToken": "", "syncInterval": 3600000}	f	2025-11-07 10:02:33.121	2025-11-07 10:02:33.121
cmhoost9k000m7reffrjw8cc0	facebook	Facebook	{"pageId": "", "accessToken": ""}	f	2025-11-07 10:02:33.129	2025-11-07 10:02:33.129
cmhoost9q000n7ref572vw01i	twitter	Twitter	{"userId": "", "bearerToken": ""}	f	2025-11-07 10:02:33.134	2025-11-07 10:02:33.134
\.


--
-- Data for Name: translation_keys; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.translation_keys (id, key, category, description, "createdAt", "updatedAt") FROM stdin;
cmhopr09400007rlu9frpyl5p	button.submit	content	Submit button text	2025-11-07 10:29:08.489	2025-11-07 10:29:08.489
cmhopr09p00047rluzlxp8nvx	button.cancel	content	Cancel button text	2025-11-07 10:29:08.51	2025-11-07 10:29:08.51
cmhopr0a100087rlum653ux2i	button.save	content	Save button text	2025-11-07 10:29:08.521	2025-11-07 10:29:08.521
cmhopr0ag000c7rluvdz66cbz	button.delete	content	Delete button text	2025-11-07 10:29:08.537	2025-11-07 10:29:08.537
cmhopr0ay000g7rluyt9hyk44	button.edit	content	Edit button text	2025-11-07 10:29:08.555	2025-11-07 10:29:08.555
cmhopr0bb000k7rlu5vv377en	button.create	content	Create button text	2025-11-07 10:29:08.567	2025-11-07 10:29:08.567
cmhopr0bq000o7rlusqygw04r	button.add	content	Add button text	2025-11-07 10:29:08.582	2025-11-07 10:29:08.582
cmhopr0c0000s7rluax5ur0z3	button.close	content	Close button text	2025-11-07 10:29:08.592	2025-11-07 10:29:08.592
cmhopr0ch000w7rlus1u0e1bo	button.back	content	Back button text	2025-11-07 10:29:08.609	2025-11-07 10:29:08.609
cmhopr0cy00107rlu3xkdo52o	button.next	content	Next button text	2025-11-07 10:29:08.625	2025-11-07 10:29:08.625
cmhopr0db00147rlu2mxnyusx	button.previous	content	Previous button text	2025-11-07 10:29:08.64	2025-11-07 10:29:08.64
cmhopr0dv00187rlum3r4bttp	button.loading	content	Loading button text	2025-11-07 10:29:08.659	2025-11-07 10:29:08.659
cmhopr0ea001c7rlugifgla0r	button.saving	content	Saving button text	2025-11-07 10:29:08.675	2025-11-07 10:29:08.675
cmhopr0es001g7rlutv8xxufg	button.deleting	content	Deleting button text	2025-11-07 10:29:08.693	2025-11-07 10:29:08.693
cmhopr0f6001k7rluea2cvy5c	nav.home	content	Home navigation link	2025-11-07 10:29:08.706	2025-11-07 10:29:08.706
cmhopr0fl001o7rlue1dt1yuf	nav.projects	content	Projects navigation link	2025-11-07 10:29:08.722	2025-11-07 10:29:08.722
cmhopr0g2001s7rlup7ipca4w	nav.about	content	About navigation link	2025-11-07 10:29:08.739	2025-11-07 10:29:08.739
cmhopr0gj001w7rlu19zj84cj	nav.contact	content	Contact navigation link	2025-11-07 10:29:08.755	2025-11-07 10:29:08.755
cmhopr0gx00207rluprlf7rep	nav.services	content	Services navigation link	2025-11-07 10:29:08.769	2025-11-07 10:29:08.769
cmhopr0he00247rluff4vn89d	admin.dashboard	admin	Admin dashboard title	2025-11-07 10:29:08.787	2025-11-07 10:29:08.787
cmhopr0hv00287rlu54tr5dve	admin.projects	admin	Admin projects section	2025-11-07 10:29:08.803	2025-11-07 10:29:08.803
cmhopr0ib002c7rlu9am5ilii	admin.content	admin	Admin content section	2025-11-07 10:29:08.818	2025-11-07 10:29:08.818
cmhopr0is002g7rlu3uthewti	admin.messages	admin	Admin messages section	2025-11-07 10:29:08.836	2025-11-07 10:29:08.836
cmhopr0j5002k7rlu7tkltnqp	admin.settings	admin	Admin settings section	2025-11-07 10:29:08.849	2025-11-07 10:29:08.849
cmhopr0jm002o7rlu6d624wla	admin.translations	admin	Admin translations section	2025-11-07 10:29:08.866	2025-11-07 10:29:08.866
cmhopr0k2002s7rlu5xls8s3y	admin.pageBuilder	admin	Admin page builder section	2025-11-07 10:29:08.882	2025-11-07 10:29:08.882
cmhopr0kj002w7rluimt0x5pn	admin.gallery	admin	Admin gallery section	2025-11-07 10:29:08.899	2025-11-07 10:29:08.899
cmhopr0l500307rlu8jfnw783	admin.analytics	admin	Admin analytics section	2025-11-07 10:29:08.921	2025-11-07 10:29:08.921
cmhopr0lj00347rluk900rd4x	message.success	messages	Success message	2025-11-07 10:29:08.935	2025-11-07 10:29:08.935
cmhopr0ly00387rlunjmdulac	message.error	messages	Error message	2025-11-07 10:29:08.95	2025-11-07 10:29:08.95
cmhopr0mc003c7rluznt20xq8	message.loading	messages	Loading message	2025-11-07 10:29:08.964	2025-11-07 10:29:08.964
cmhopr0mm003g7rlunz15vyn4	message.noData	messages	No data available message	2025-11-07 10:29:08.974	2025-11-07 10:29:08.974
cmhopr0mx003k7rluf0bk9iml	form.name	forms	Name field label	2025-11-07 10:29:08.985	2025-11-07 10:29:08.985
cmhopr0na003o7rluq4vmzs1w	form.email	forms	Email field label	2025-11-07 10:29:08.998	2025-11-07 10:29:08.998
cmhopr0nm003s7rlu6wj6gb26	form.password	forms	Password field label	2025-11-07 10:29:09.01	2025-11-07 10:29:09.01
cmhopr0o2003w7rluhs748p18	form.message	forms	Message field label	2025-11-07 10:29:09.026	2025-11-07 10:29:09.026
cmhopr0oj00407rlu325qhzlb	form.required	forms	Required field indicator	2025-11-07 10:29:09.043	2025-11-07 10:29:09.043
cmhopr0p200447rluf90dox01	form.projectType	forms	Project type field label	2025-11-07 10:29:09.063	2025-11-07 10:29:09.063
cmhopr0pi00487rlu48bllpet	form.selectProjectType	forms	Select project type placeholder	2025-11-07 10:29:09.079	2025-11-07 10:29:09.079
cmhopr0px004c7rlu2pzmsiut	form.sendMessage	forms	Send message button	2025-11-07 10:29:09.094	2025-11-07 10:29:09.094
cmhopr0qe004g7rlufj99hcln	form.sending	forms	Sending message button	2025-11-07 10:29:09.11	2025-11-07 10:29:09.11
cmhopr0qs004k7rlu2ze5vzcz	form.messageSent	messages	Message sent successfully	2025-11-07 10:29:09.125	2025-11-07 10:29:09.125
cmhopr0r8004o7rluen5b72ac	form.thankYou	messages	Thank you message	2025-11-07 10:29:09.14	2025-11-07 10:29:09.14
cmhopr0rn004s7rlu96fxjyb1	form.sendAnother	forms	Send another message button	2025-11-07 10:29:09.155	2025-11-07 10:29:09.155
cmhopr0s0004w7rlu6a0otl4a	form.errorSending	messages	Error sending message	2025-11-07 10:29:09.168	2025-11-07 10:29:09.168
cmhopr0sg00507rlub7jtx6u1	form.tryAgain	forms	Try again link	2025-11-07 10:29:09.184	2025-11-07 10:29:09.184
cmhopr0sv00547rlu8b28wuk9	form.privacyAccept	forms	Privacy policy acceptance text	2025-11-07 10:29:09.199	2025-11-07 10:29:09.199
cmhopr0t900587rluca64knjn	form.marketingConsent	forms	Marketing consent text	2025-11-07 10:29:09.213	2025-11-07 10:29:09.213
cmhopr0tp005c7rluz5z4yjo3	form.dataProtection	forms	Data protection notice title	2025-11-07 10:29:09.23	2025-11-07 10:29:09.23
cmhopr0u6005g7rluvvuaz3qg	auth.signIn	admin	Sign in button	2025-11-07 10:29:09.247	2025-11-07 10:29:09.247
cmhopr0uk005k7rlu8vz51h3x	auth.signUp	admin	Sign up button	2025-11-07 10:29:09.26	2025-11-07 10:29:09.26
cmhopr0uz005o7rluefon45i4	auth.signOut	admin	Sign out button	2025-11-07 10:29:09.275	2025-11-07 10:29:09.275
cmhopr0vf005s7rlurhnx4zrv	auth.createAccount	admin	Create account title	2025-11-07 10:29:09.29	2025-11-07 10:29:09.29
cmhopr0vv005w7rlu8lx8a2k1	auth.welcome	admin	Welcome message	2025-11-07 10:29:09.307	2025-11-07 10:29:09.307
cmhopr0wc00607rlu1oje0m5s	auth.loggedInAs	admin	Logged in as text	2025-11-07 10:29:09.324	2025-11-07 10:29:09.324
cmhopr0ws00647rlu3nf23cpw	auth.alreadyHaveAccount	admin	Already have account text	2025-11-07 10:29:09.34	2025-11-07 10:29:09.34
cmhopr0xm00687rluob0yva8d	auth.noAccount	admin	Don't have account text	2025-11-07 10:29:09.371	2025-11-07 10:29:09.371
cmhopr0yc006c7rlujmth7p0e	nav.backToSite	content	Back to site link	2025-11-07 10:29:09.397	2025-11-07 10:29:09.397
cmhopr0z0006g7rlu2t0uu4o7	project.edit	admin	Edit project title	2025-11-07 10:29:09.42	2025-11-07 10:29:09.42
cmhopr0zd006k7rlum914t3en	project.create	admin	Create project title	2025-11-07 10:29:09.434	2025-11-07 10:29:09.434
cmhopr0zt006o7rlurqr8crte	project.basicSettings	admin	Basic settings section	2025-11-07 10:29:09.449	2025-11-07 10:29:09.449
cmhopr10e006s7rlucakpnohf	project.contentType	admin	Content type label	2025-11-07 10:29:09.47	2025-11-07 10:29:09.47
cmhopr10t006w7rlu32xyu1k8	project.selectContentType	admin	Select content type placeholder	2025-11-07 10:29:09.486	2025-11-07 10:29:09.486
cmhopr11a00707rluyjvtujvu	project.featured	admin	Featured checkbox label	2025-11-07 10:29:09.502	2025-11-07 10:29:09.502
cmhopr11r00747rlu91t37d35	project.published	admin	Published checkbox label	2025-11-07 10:29:09.519	2025-11-07 10:29:09.519
cmhopr12500787rlu84pqgiut	project.translations	admin	Translations section	2025-11-07 10:29:09.534	2025-11-07 10:29:09.534
cmhopr12i007c7rluuii66ga0	project.title	admin	Project title label	2025-11-07 10:29:09.547	2025-11-07 10:29:09.547
cmhopr12x007g7rlubd4hn3wc	project.titlePlaceholder	admin	Project title placeholder	2025-11-07 10:29:09.561	2025-11-07 10:29:09.561
cmhopr138007k7rlu5a439tav	project.description	admin	Project description label	2025-11-07 10:29:09.573	2025-11-07 10:29:09.573
cmhopr13o007o7rludwpwzbwu	project.descriptionPlaceholder	admin	Project description placeholder	2025-11-07 10:29:09.589	2025-11-07 10:29:09.589
cmhopr146007s7rluowx2o6rj	project.materials	admin	Materials label	2025-11-07 10:29:09.606	2025-11-07 10:29:09.606
cmhopr14i007w7rlu4x915qrj	project.materialsPlaceholder	admin	Materials placeholder	2025-11-07 10:29:09.618	2025-11-07 10:29:09.618
cmhopr14s00807rluw56knqtq	project.images	admin	Images section	2025-11-07 10:29:09.629	2025-11-07 10:29:09.629
cmhopr15100847rlu889maeur	project.update	admin	Update project button	2025-11-07 10:29:09.638	2025-11-07 10:29:09.638
cmhopr15g00887rluf3wl22pa	project.saving	admin	Saving project button	2025-11-07 10:29:09.653	2025-11-07 10:29:09.653
cmhopr15u008c7rluza8f7rfd	project.unknownLanguage	admin	Unknown language fallback	2025-11-07 10:29:09.667	2025-11-07 10:29:09.667
cmhopr16h008g7rluqcks88oq	nav.theme	content	Theme label	2025-11-07 10:29:09.689	2025-11-07 10:29:09.689
cmhopr16t008k7rlug7ivnnsc	nav.language	content	Language label	2025-11-07 10:29:09.701	2025-11-07 10:29:09.701
cmhopr17j008o7rlu9otr4n7g	footer.brand	content	Footer brand name	2025-11-07 10:29:09.727	2025-11-07 10:29:09.727
cmhopr18a008s7rlujsx47dag	footer.tagline	content	Footer tagline	2025-11-07 10:29:09.754	2025-11-07 10:29:09.754
cmhopr18p008w7rluwtp48ngr	footer.navigation	content	Footer navigation section title	2025-11-07 10:29:09.769	2025-11-07 10:29:09.769
cmhopr19200907rlujk37l68e	footer.legal	content	Footer legal section title	2025-11-07 10:29:09.782	2025-11-07 10:29:09.782
cmhopr19d00947rlu5rdrd85g	footer.privacyPolicy	content	Privacy policy link	2025-11-07 10:29:09.793	2025-11-07 10:29:09.793
cmhopr19x00987rlu9clr5oy5	footer.termsOfService	content	Terms of service link	2025-11-07 10:29:09.813	2025-11-07 10:29:09.813
cmhopr1ac009c7rluet1unfiw	footer.cookiePreferences	content	Cookie preferences link	2025-11-07 10:29:09.829	2025-11-07 10:29:09.829
cmhopr1at009g7rluvtw7a3yo	footer.allRightsReserved	content	All rights reserved text	2025-11-07 10:29:09.846	2025-11-07 10:29:09.846
cmhopr1b5009k7rluorrdt5pc	contact.title	content	Contact page title	2025-11-07 10:29:09.857	2025-11-07 10:29:09.857
cmhopr1bl009o7rluwwxrmgsg	contact.subtitle	content	Contact page subtitle	2025-11-07 10:29:09.871	2025-11-07 10:29:09.871
cmhopr1bz009s7rluk5uwjw6x	contact.sendMessage	content	Send us a message heading	2025-11-07 10:29:09.887	2025-11-07 10:29:09.887
cmhopr1cb009w7rlukwe8roi3	contact.contactInformation	content	Contact information heading	2025-11-07 10:29:09.9	2025-11-07 10:29:09.9
cmhopr1cp00a07rlu4t3cgduw	contact.email	content	Email label	2025-11-07 10:29:09.914	2025-11-07 10:29:09.914
cmhopr1d100a47rlurc1v80qb	contact.phone	content	Phone label	2025-11-07 10:29:09.926	2025-11-07 10:29:09.926
cmhopr1df00a87rlustui0cb2	contact.location	content	Location label	2025-11-07 10:29:09.939	2025-11-07 10:29:09.939
cmhopr1dt00ac7rluf616acjo	contact.businessHours	content	Business hours heading	2025-11-07 10:29:09.954	2025-11-07 10:29:09.954
cmhopr1e700ag7rlu1gniczri	contact.mondayFriday	content	Monday-Friday label	2025-11-07 10:29:09.967	2025-11-07 10:29:09.967
cmhopr1ep00ak7rluvh72ukvz	contact.saturday	content	Saturday label	2025-11-07 10:29:09.985	2025-11-07 10:29:09.985
cmhopr1f600ao7rlukvcgwbia	contact.sunday	content	Sunday label	2025-11-07 10:29:10.002	2025-11-07 10:29:10.002
cmhopr1fl00as7rluuda7dd2q	contact.closed	content	Closed label	2025-11-07 10:29:10.018	2025-11-07 10:29:10.018
cmhopr1g000aw7rlug1p4ofkj	contact.quickResponse	content	Quick response heading	2025-11-07 10:29:10.033	2025-11-07 10:29:10.033
cmhopr1gg00b07rlufctdg1w5	contact.quickResponseText	content	Quick response text	2025-11-07 10:29:10.048	2025-11-07 10:29:10.048
cmhopr1gx00b47rluhfzquvjn	contact.backToHome	content	Back to home link	2025-11-07 10:29:10.066	2025-11-07 10:29:10.066
cmhopr1hc00b87rlu2wxkf97d	content.pageSettings	admin	Page settings section	2025-11-07 10:29:10.081	2025-11-07 10:29:10.081
cmhopr1hu00bc7rlu67xzji0w	content.slug	admin	Slug label	2025-11-07 10:29:10.098	2025-11-07 10:29:10.098
cmhopr1ic00bg7rlu5ov23kvx	content.generateFromTitle	admin	Generate slug from title button	2025-11-07 10:29:10.116	2025-11-07 10:29:10.116
cmhopr1iq00bk7rlu3qz8znas	content.published	admin	Published checkbox	2025-11-07 10:29:10.131	2025-11-07 10:29:10.131
cmhopr1j200bo7rluj5rya0to	content.title	admin	Title label	2025-11-07 10:29:10.143	2025-11-07 10:29:10.143
cmhopr1jh00bs7rlucorjst05	content.titlePlaceholder	admin	Title placeholder	2025-11-07 10:29:10.158	2025-11-07 10:29:10.158
cmhopr1jx00bw7rluigp1l5pu	content.content	admin	Content label	2025-11-07 10:29:10.174	2025-11-07 10:29:10.174
cmhopr1ke00c07rluo1i9tv6n	content.contentPlaceholder	admin	Content placeholder	2025-11-07 10:29:10.191	2025-11-07 10:29:10.191
cmhopr1kr00c47rlu4wlvk76p	content.default	admin	Default language badge	2025-11-07 10:29:10.203	2025-11-07 10:29:10.203
cmhopr1l800c87rluj7ureh0t	content.preview	admin	Preview button	2025-11-07 10:29:10.22	2025-11-07 10:29:10.22
cmhopr1lm00cc7rlu73vpdv70	content.createPage	admin	Create page button	2025-11-07 10:29:10.234	2025-11-07 10:29:10.234
cmhopr1m000cg7rlugzqqax46	content.saveChanges	admin	Save changes button	2025-11-07 10:29:10.249	2025-11-07 10:29:10.249
cmhopr1mh00ck7rlu5ochbus4	content.editLanguage	admin	Edit language indicator	2025-11-07 10:29:10.266	2025-11-07 10:29:10.266
cmhopr1my00co7rlu7o9smww6	content.translateToAll	admin	Translate to all languages button	2025-11-07 10:29:10.282	2025-11-07 10:29:10.282
cmhopr1nc00cs7rlut5hd3421	admin.contentPages	admin	Content pages heading	2025-11-07 10:29:10.297	2025-11-07 10:29:10.297
cmhopr1nq00cw7rlupemf36nq	admin.manageContentPages	admin	Manage content pages description	2025-11-07 10:29:10.31	2025-11-07 10:29:10.31
cmhopr1o500d07rludaqc76qu	admin.newPage	admin	New page button	2025-11-07 10:29:10.326	2025-11-07 10:29:10.326
cmhopr1of00d47rluxodknptw	admin.searchPages	admin	Search pages placeholder	2025-11-07 10:29:10.335	2025-11-07 10:29:10.335
cmhopr1os00d87rlu7nrb2slb	admin.allLanguages	admin	All languages filter	2025-11-07 10:29:10.348	2025-11-07 10:29:10.348
cmhopr1p800dc7rlu2cpy61wr	admin.allStatus	admin	All status filter	2025-11-07 10:29:10.364	2025-11-07 10:29:10.364
cmhopr1pj00dg7rlucbk3fjgw	admin.published	admin	Published status	2025-11-07 10:29:10.376	2025-11-07 10:29:10.376
cmhopr1pu00dk7rlu7cyk9t3u	admin.unpublished	admin	Unpublished status	2025-11-07 10:29:10.386	2025-11-07 10:29:10.386
cmhopr1q600do7rluztrulmz7	admin.createProject	admin	Create project button	2025-11-07 10:29:10.398	2025-11-07 10:29:10.398
cmhopr1qh00ds7rlu271ifq3c	admin.searchProjects	admin	Search projects placeholder	2025-11-07 10:29:10.409	2025-11-07 10:29:10.409
cmhopr1qu00dw7rlul7qytdbe	admin.allProjects	admin	All projects filter	2025-11-07 10:29:10.422	2025-11-07 10:29:10.422
cmhopr1r800e07rlu3cd3l80b	admin.featured	admin	Featured status	2025-11-07 10:29:10.436	2025-11-07 10:29:10.436
cmhopr1rn00e47rluok5rsn0c	admin.notFeatured	admin	Not featured status	2025-11-07 10:29:10.451	2025-11-07 10:29:10.451
cmhopr1s200e87rlu7lpez189	admin.draft	admin	Draft status	2025-11-07 10:29:10.466	2025-11-07 10:29:10.466
cmhopr1sf00ec7rlu746do9yu	admin.project	admin	Project label	2025-11-07 10:29:10.48	2025-11-07 10:29:10.48
cmhopr1sw00eg7rluzsr4u93b	admin.status	admin	Status label	2025-11-07 10:29:10.497	2025-11-07 10:29:10.497
cmhopr1ta00ek7rluoztg2yv1	admin.images	admin	Images label	2025-11-07 10:29:10.51	2025-11-07 10:29:10.51
cmhopr1tr00eo7rlupzzj66me	admin.created	admin	Created label	2025-11-07 10:29:10.527	2025-11-07 10:29:10.527
cmhopr1u400es7rlusvktt7hs	admin.actions	admin	Actions label	2025-11-07 10:29:10.54	2025-11-07 10:29:10.54
cmhopr1uh00ew7rlu3k3so9kb	admin.noProjectsFound	admin	No projects found message	2025-11-07 10:29:10.553	2025-11-07 10:29:10.553
cmhopr1uw00f07rlu13drbwll	admin.translationsCount	admin	Translations count	2025-11-07 10:29:10.568	2025-11-07 10:29:10.568
cmhopr1va00f47rlu9yzkaq3j	admin.loading	admin	Loading text	2025-11-07 10:29:10.583	2025-11-07 10:29:10.583
cmhopr1vr00f87rlub0kldgtf	admin.loadingProjects	admin	Loading projects text	2025-11-07 10:29:10.599	2025-11-07 10:29:10.599
cmhopr1wb00fc7rlu0mpqh1ua	admin.error	admin	Error label	2025-11-07 10:29:10.619	2025-11-07 10:29:10.619
cmhopr1wp00fg7rlu3dpbiahf	admin.retry	admin	Retry button	2025-11-07 10:29:10.634	2025-11-07 10:29:10.634
cmhopr1x500fk7rlu0ejwtku0	projects.title	content	Projects page title	2025-11-07 10:29:10.65	2025-11-07 10:29:10.65
cmhopr1xl00fo7rluyaad38bi	projects.subtitle	content	Projects page subtitle	2025-11-07 10:29:10.665	2025-11-07 10:29:10.665
cmhopr1y200fs7rlunj9bhs34	projects.backToProjects	content	Back to projects button	2025-11-07 10:29:10.683	2025-11-07 10:29:10.683
\.


--
-- Data for Name: translations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.translations (id, "keyId", "languageId", value, "createdAt", "updatedAt") FROM stdin;
cmhopr09500027rluyfgs3tvs	cmhopr09400007rlu9frpyl5p	cmhoost5m00007refpcjkkep3	Verzenden	2025-11-07 10:29:08.489	2025-11-07 10:29:08.489
cmhopr09500037rlu2pcqbquk	cmhopr09400007rlu9frpyl5p	cmhoost6300017refg0dkno6u	Envoyer	2025-11-07 10:29:08.489	2025-11-07 10:29:08.489
cmhopr09p00067rluj7aadxhm	cmhopr09p00047rluzlxp8nvx	cmhoost5m00007refpcjkkep3	Annuleren	2025-11-07 10:29:08.51	2025-11-07 10:29:08.51
cmhopr09p00077rlu43mm09gc	cmhopr09p00047rluzlxp8nvx	cmhoost6300017refg0dkno6u	Annuler	2025-11-07 10:29:08.51	2025-11-07 10:29:08.51
cmhopr0a1000a7rluq3xvsfmz	cmhopr0a100087rlum653ux2i	cmhoost5m00007refpcjkkep3	Opslaan	2025-11-07 10:29:08.521	2025-11-07 10:29:08.521
cmhopr0a1000b7rlu2ovpigq9	cmhopr0a100087rlum653ux2i	cmhoost6300017refg0dkno6u	Enregistrer	2025-11-07 10:29:08.521	2025-11-07 10:29:08.521
cmhopr0ah000e7rlus2ra4m35	cmhopr0ag000c7rluvdz66cbz	cmhoost5m00007refpcjkkep3	Verwijderen	2025-11-07 10:29:08.537	2025-11-07 10:29:08.537
cmhopr0ah000f7rlu3ob38spv	cmhopr0ag000c7rluvdz66cbz	cmhoost6300017refg0dkno6u	Supprimer	2025-11-07 10:29:08.537	2025-11-07 10:29:08.537
cmhopr0ay000i7rluqlsuak5r	cmhopr0ay000g7rluyt9hyk44	cmhoost5m00007refpcjkkep3	Bewerken	2025-11-07 10:29:08.555	2025-11-07 10:29:08.555
cmhopr0ay000j7rlu6c6czo07	cmhopr0ay000g7rluyt9hyk44	cmhoost6300017refg0dkno6u	Modifier	2025-11-07 10:29:08.555	2025-11-07 10:29:08.555
cmhopr0bb000m7rlurdvr4a83	cmhopr0bb000k7rlu5vv377en	cmhoost5m00007refpcjkkep3	Aanmaken	2025-11-07 10:29:08.567	2025-11-07 10:29:08.567
cmhopr0bb000n7rluowsyv6s5	cmhopr0bb000k7rlu5vv377en	cmhoost6300017refg0dkno6u	Créer	2025-11-07 10:29:08.567	2025-11-07 10:29:08.567
cmhopr0bq000q7rlualdhztip	cmhopr0bq000o7rlusqygw04r	cmhoost5m00007refpcjkkep3	Toevoegen	2025-11-07 10:29:08.582	2025-11-07 10:29:08.582
cmhopr0bq000r7rlumbdh4smf	cmhopr0bq000o7rlusqygw04r	cmhoost6300017refg0dkno6u	Ajouter	2025-11-07 10:29:08.582	2025-11-07 10:29:08.582
cmhopr0c0000u7rludcn3rtwv	cmhopr0c0000s7rluax5ur0z3	cmhoost5m00007refpcjkkep3	Sluiten	2025-11-07 10:29:08.592	2025-11-07 10:29:08.592
cmhopr0c0000v7rlun6g63qmn	cmhopr0c0000s7rluax5ur0z3	cmhoost6300017refg0dkno6u	Fermer	2025-11-07 10:29:08.592	2025-11-07 10:29:08.592
cmhopr0ch000y7rlu8qcp7bqc	cmhopr0ch000w7rlus1u0e1bo	cmhoost5m00007refpcjkkep3	Terug	2025-11-07 10:29:08.609	2025-11-07 10:29:08.609
cmhopr0ch000z7rluqs3w0we1	cmhopr0ch000w7rlus1u0e1bo	cmhoost6300017refg0dkno6u	Retour	2025-11-07 10:29:08.609	2025-11-07 10:29:08.609
cmhopr0cy00127rlui9n60xbu	cmhopr0cy00107rlu3xkdo52o	cmhoost5m00007refpcjkkep3	Volgende	2025-11-07 10:29:08.625	2025-11-07 10:29:08.625
cmhopr0cy00137rlu8022qrlx	cmhopr0cy00107rlu3xkdo52o	cmhoost6300017refg0dkno6u	Suivant	2025-11-07 10:29:08.625	2025-11-07 10:29:08.625
cmhopr0dc00167rluo5an2h7r	cmhopr0db00147rlu2mxnyusx	cmhoost5m00007refpcjkkep3	Vorige	2025-11-07 10:29:08.64	2025-11-07 10:29:08.64
cmhopr0dc00177rluq1vity39	cmhopr0db00147rlu2mxnyusx	cmhoost6300017refg0dkno6u	Précédent	2025-11-07 10:29:08.64	2025-11-07 10:29:08.64
cmhopr0dv001a7rlu5cwvsdud	cmhopr0dv00187rlum3r4bttp	cmhoost5m00007refpcjkkep3	Laden...	2025-11-07 10:29:08.659	2025-11-07 10:29:08.659
cmhopr0dv001b7rlu46snmwhd	cmhopr0dv00187rlum3r4bttp	cmhoost6300017refg0dkno6u	Chargement...	2025-11-07 10:29:08.659	2025-11-07 10:29:08.659
cmhopr0eb001e7rlu8q83aw41	cmhopr0ea001c7rlugifgla0r	cmhoost5m00007refpcjkkep3	Opslaan...	2025-11-07 10:29:08.675	2025-11-07 10:29:08.675
cmhopr0eb001f7rluz22q3zz0	cmhopr0ea001c7rlugifgla0r	cmhoost6300017refg0dkno6u	Enregistrement...	2025-11-07 10:29:08.675	2025-11-07 10:29:08.675
cmhopr0et001i7rlufqkd59jm	cmhopr0es001g7rlutv8xxufg	cmhoost5m00007refpcjkkep3	Verwijderen...	2025-11-07 10:29:08.693	2025-11-07 10:29:08.693
cmhopr0et001j7rluvbokwwqm	cmhopr0es001g7rlutv8xxufg	cmhoost6300017refg0dkno6u	Suppression...	2025-11-07 10:29:08.693	2025-11-07 10:29:08.693
cmhopr0f6001m7rluosz0i5l8	cmhopr0f6001k7rluea2cvy5c	cmhoost5m00007refpcjkkep3	Home	2025-11-07 10:29:08.706	2025-11-07 10:29:08.706
cmhopr0f6001n7rluwphsr511	cmhopr0f6001k7rluea2cvy5c	cmhoost6300017refg0dkno6u	Accueil	2025-11-07 10:29:08.706	2025-11-07 10:29:08.706
cmhopr0fl001q7rlubmcexfo5	cmhopr0fl001o7rlue1dt1yuf	cmhoost5m00007refpcjkkep3	Projecten	2025-11-07 10:29:08.722	2025-11-07 10:29:08.722
cmhopr0fl001r7rluaiv7r8ze	cmhopr0fl001o7rlue1dt1yuf	cmhoost6300017refg0dkno6u	Projets	2025-11-07 10:29:08.722	2025-11-07 10:29:08.722
cmhopr0g3001u7rlu0nxndfmq	cmhopr0g2001s7rlup7ipca4w	cmhoost5m00007refpcjkkep3	Over	2025-11-07 10:29:08.739	2025-11-07 10:29:08.739
cmhopr0g3001v7rlux4e242ru	cmhopr0g2001s7rlup7ipca4w	cmhoost6300017refg0dkno6u	À propos	2025-11-07 10:29:08.739	2025-11-07 10:29:08.739
cmhopr0gj001y7rlukv01wr86	cmhopr0gj001w7rlu19zj84cj	cmhoost5m00007refpcjkkep3	Contact	2025-11-07 10:29:08.755	2025-11-07 10:29:08.755
cmhopr0gj001z7rlutatxdll4	cmhopr0gj001w7rlu19zj84cj	cmhoost6300017refg0dkno6u	Contact	2025-11-07 10:29:08.755	2025-11-07 10:29:08.755
cmhopr0gx00227rlu0u9o85c3	cmhopr0gx00207rluprlf7rep	cmhoost5m00007refpcjkkep3	Diensten	2025-11-07 10:29:08.769	2025-11-07 10:29:08.769
cmhopr0gx00237rluc0tpmwnm	cmhopr0gx00207rluprlf7rep	cmhoost6300017refg0dkno6u	Services	2025-11-07 10:29:08.769	2025-11-07 10:29:08.769
cmhopr0hf00267rlu09t77kbw	cmhopr0he00247rluff4vn89d	cmhoost5m00007refpcjkkep3	Dashboard	2025-11-07 10:29:08.787	2025-11-07 10:29:08.787
cmhopr0hf00277rlum2d4rkvj	cmhopr0he00247rluff4vn89d	cmhoost6300017refg0dkno6u	Tableau de bord	2025-11-07 10:29:08.787	2025-11-07 10:29:08.787
cmhopr0hv002a7rlulqk7ljfm	cmhopr0hv00287rlu54tr5dve	cmhoost5m00007refpcjkkep3	Projecten	2025-11-07 10:29:08.803	2025-11-07 10:29:08.803
cmhopr0hv002b7rlus2tkey19	cmhopr0hv00287rlu54tr5dve	cmhoost6300017refg0dkno6u	Projets	2025-11-07 10:29:08.803	2025-11-07 10:29:08.803
cmhopr0ib002e7rluy4tdy82i	cmhopr0ib002c7rlu9am5ilii	cmhoost5m00007refpcjkkep3	Inhoud	2025-11-07 10:29:08.818	2025-11-07 10:29:08.818
cmhopr0ib002f7rlu8scbnsub	cmhopr0ib002c7rlu9am5ilii	cmhoost6300017refg0dkno6u	Contenu	2025-11-07 10:29:08.818	2025-11-07 10:29:08.818
cmhopr0is002i7rluwhhktice	cmhopr0is002g7rlu3uthewti	cmhoost5m00007refpcjkkep3	Berichten	2025-11-07 10:29:08.836	2025-11-07 10:29:08.836
cmhopr0is002j7rlukrqdpyt3	cmhopr0is002g7rlu3uthewti	cmhoost6300017refg0dkno6u	Messages	2025-11-07 10:29:08.836	2025-11-07 10:29:08.836
cmhopr0j5002m7rluc72ycrui	cmhopr0j5002k7rlu7tkltnqp	cmhoost5m00007refpcjkkep3	Instellingen	2025-11-07 10:29:08.849	2025-11-07 10:29:08.849
cmhopr0j5002n7rlu7ehxl9wc	cmhopr0j5002k7rlu7tkltnqp	cmhoost6300017refg0dkno6u	Paramètres	2025-11-07 10:29:08.849	2025-11-07 10:29:08.849
cmhopr0jm002q7rlu8sivl7h6	cmhopr0jm002o7rlu6d624wla	cmhoost5m00007refpcjkkep3	Vertalingen	2025-11-07 10:29:08.866	2025-11-07 10:29:08.866
cmhopr0jm002r7rlul9p1p3fp	cmhopr0jm002o7rlu6d624wla	cmhoost6300017refg0dkno6u	Traductions	2025-11-07 10:29:08.866	2025-11-07 10:29:08.866
cmhopr0k2002u7rlu5l78lr6m	cmhopr0k2002s7rlu5xls8s3y	cmhoost5m00007refpcjkkep3	Pagina Bouwer	2025-11-07 10:29:08.882	2025-11-07 10:29:08.882
cmhopr0k2002v7rlupqdxvnq6	cmhopr0k2002s7rlu5xls8s3y	cmhoost6300017refg0dkno6u	Constructeur de pages	2025-11-07 10:29:08.882	2025-11-07 10:29:08.882
cmhopr0kj002y7rluk1boq7jj	cmhopr0kj002w7rluimt0x5pn	cmhoost5m00007refpcjkkep3	Galerij	2025-11-07 10:29:08.899	2025-11-07 10:29:08.899
cmhopr0kj002z7rluhiq6kml9	cmhopr0kj002w7rluimt0x5pn	cmhoost6300017refg0dkno6u	Galerie	2025-11-07 10:29:08.899	2025-11-07 10:29:08.899
cmhopr0l500327rluiz02lqpk	cmhopr0l500307rlu8jfnw783	cmhoost5m00007refpcjkkep3	Analyses	2025-11-07 10:29:08.921	2025-11-07 10:29:08.921
cmhopr0l500337rlua2f4a7jq	cmhopr0l500307rlu8jfnw783	cmhoost6300017refg0dkno6u	Analytiques	2025-11-07 10:29:08.921	2025-11-07 10:29:08.921
cmhopr0lj00367rlufpxqz2r4	cmhopr0lj00347rluk900rd4x	cmhoost5m00007refpcjkkep3	Succesvol!	2025-11-07 10:29:08.935	2025-11-07 10:29:08.935
cmhopr0lj00377rlu4qb19erl	cmhopr0lj00347rluk900rd4x	cmhoost6300017refg0dkno6u	Succès!	2025-11-07 10:29:08.935	2025-11-07 10:29:08.935
cmhopr0ly003a7rlu6fcc5kra	cmhopr0ly00387rlunjmdulac	cmhoost5m00007refpcjkkep3	Er is een fout opgetreden	2025-11-07 10:29:08.95	2025-11-07 10:29:08.95
cmhopr0ly003b7rlu9vqcxbal	cmhopr0ly00387rlunjmdulac	cmhoost6300017refg0dkno6u	Une erreur s'est produite	2025-11-07 10:29:08.95	2025-11-07 10:29:08.95
cmhopr0mc003e7rluecz7e7at	cmhopr0mc003c7rluznt20xq8	cmhoost5m00007refpcjkkep3	Laden...	2025-11-07 10:29:08.964	2025-11-07 10:29:08.964
cmhopr0mc003f7rlu2sroirtj	cmhopr0mc003c7rluznt20xq8	cmhoost6300017refg0dkno6u	Chargement...	2025-11-07 10:29:08.964	2025-11-07 10:29:08.964
cmhopr0mm003i7rluhjyt13ft	cmhopr0mm003g7rlunz15vyn4	cmhoost5m00007refpcjkkep3	Geen gegevens beschikbaar	2025-11-07 10:29:08.974	2025-11-07 10:29:08.974
cmhopr0mm003j7rlu8qqqfl9m	cmhopr0mm003g7rlunz15vyn4	cmhoost6300017refg0dkno6u	Aucune donnée disponible	2025-11-07 10:29:08.974	2025-11-07 10:29:08.974
cmhopr0mx003m7rlu1w1ux7st	cmhopr0mx003k7rluf0bk9iml	cmhoost5m00007refpcjkkep3	Naam	2025-11-07 10:29:08.985	2025-11-07 10:29:08.985
cmhopr0mx003n7rlufz5uf7rt	cmhopr0mx003k7rluf0bk9iml	cmhoost6300017refg0dkno6u	Nom	2025-11-07 10:29:08.985	2025-11-07 10:29:08.985
cmhopr0na003q7rludbmkcz1v	cmhopr0na003o7rluq4vmzs1w	cmhoost5m00007refpcjkkep3	E-mail	2025-11-07 10:29:08.998	2025-11-07 10:29:08.998
cmhopr0na003r7rlu4bblv749	cmhopr0na003o7rluq4vmzs1w	cmhoost6300017refg0dkno6u	E-mail	2025-11-07 10:29:08.998	2025-11-07 10:29:08.998
cmhopr0nm003u7rlu33lo3wo3	cmhopr0nm003s7rlu6wj6gb26	cmhoost5m00007refpcjkkep3	Wachtwoord	2025-11-07 10:29:09.01	2025-11-07 10:29:09.01
cmhopr0nm003v7rlu9oawyrz0	cmhopr0nm003s7rlu6wj6gb26	cmhoost6300017refg0dkno6u	Mot de passe	2025-11-07 10:29:09.01	2025-11-07 10:29:09.01
cmhopr0o2003y7rlu1cy8nqn9	cmhopr0o2003w7rluhs748p18	cmhoost5m00007refpcjkkep3	Bericht	2025-11-07 10:29:09.026	2025-11-07 10:29:09.026
cmhopr0o2003z7rlus5u1t4y9	cmhopr0o2003w7rluhs748p18	cmhoost6300017refg0dkno6u	Message	2025-11-07 10:29:09.026	2025-11-07 10:29:09.026
cmhopr0oj00427rluunpy7b1t	cmhopr0oj00407rlu325qhzlb	cmhoost5m00007refpcjkkep3	Verplicht	2025-11-07 10:29:09.043	2025-11-07 10:29:09.043
cmhopr0oj00437rlugs18cdku	cmhopr0oj00407rlu325qhzlb	cmhoost6300017refg0dkno6u	Requis	2025-11-07 10:29:09.043	2025-11-07 10:29:09.043
cmhopr0p300467rluaakclwmz	cmhopr0p200447rluf90dox01	cmhoost5m00007refpcjkkep3	Projecttype	2025-11-07 10:29:09.063	2025-11-07 10:29:09.063
cmhopr0p300477rlu129tj80y	cmhopr0p200447rluf90dox01	cmhoost6300017refg0dkno6u	Type de projet	2025-11-07 10:29:09.063	2025-11-07 10:29:09.063
cmhopr0pi004a7rlul6t4hrg8	cmhopr0pi00487rlu48bllpet	cmhoost5m00007refpcjkkep3	Selecteer een projecttype	2025-11-07 10:29:09.079	2025-11-07 10:29:09.079
cmhopr0pj004b7rluqcry6frn	cmhopr0pi00487rlu48bllpet	cmhoost6300017refg0dkno6u	Sélectionnez un type de projet	2025-11-07 10:29:09.079	2025-11-07 10:29:09.079
cmhopr0py004e7rlujzic9uyc	cmhopr0px004c7rlu2pzmsiut	cmhoost5m00007refpcjkkep3	Bericht verzenden	2025-11-07 10:29:09.094	2025-11-07 10:29:09.094
cmhopr0py004f7rluhf9mp87y	cmhopr0px004c7rlu2pzmsiut	cmhoost6300017refg0dkno6u	Envoyer le message	2025-11-07 10:29:09.094	2025-11-07 10:29:09.094
cmhopr0qe004i7rlug201cutd	cmhopr0qe004g7rlufj99hcln	cmhoost5m00007refpcjkkep3	Verzenden...	2025-11-07 10:29:09.11	2025-11-07 10:29:09.11
cmhopr0qe004j7rluxfvugf2c	cmhopr0qe004g7rlufj99hcln	cmhoost6300017refg0dkno6u	Envoi...	2025-11-07 10:29:09.11	2025-11-07 10:29:09.11
cmhopr0qt004m7rlummqygg82	cmhopr0qs004k7rlu2ze5vzcz	cmhoost5m00007refpcjkkep3	Bericht succesvol verzonden!	2025-11-07 10:29:09.125	2025-11-07 10:29:09.125
cmhopr0qt004n7rluot80ali3	cmhopr0qs004k7rlu2ze5vzcz	cmhoost6300017refg0dkno6u	Message envoyé avec succès!	2025-11-07 10:29:09.125	2025-11-07 10:29:09.125
cmhopr0r8004q7rlu46an5mka	cmhopr0r8004o7rluen5b72ac	cmhoost5m00007refpcjkkep3	Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.	2025-11-07 10:29:09.14	2025-11-07 10:29:09.14
cmhopr0r8004r7rluloo7o73r	cmhopr0r8004o7rluen5b72ac	cmhoost6300017refg0dkno6u	Merci pour votre message. Nous vous répondrons dans les plus brefs délais.	2025-11-07 10:29:09.14	2025-11-07 10:29:09.14
cmhopr0rn004u7rluguaqwja9	cmhopr0rn004s7rlu96fxjyb1	cmhoost5m00007refpcjkkep3	Nog een bericht verzenden	2025-11-07 10:29:09.155	2025-11-07 10:29:09.155
cmhopr0rn004v7rlu8gdqwhfq	cmhopr0rn004s7rlu96fxjyb1	cmhoost6300017refg0dkno6u	Envoyer un autre message	2025-11-07 10:29:09.155	2025-11-07 10:29:09.155
cmhopr0s0004y7rluluwu7c4d	cmhopr0s0004w7rlu6a0otl4a	cmhoost5m00007refpcjkkep3	Fout bij verzenden bericht	2025-11-07 10:29:09.168	2025-11-07 10:29:09.168
cmhopr0s0004z7rluffhz081n	cmhopr0s0004w7rlu6a0otl4a	cmhoost6300017refg0dkno6u	Erreur lors de l'envoi du message	2025-11-07 10:29:09.168	2025-11-07 10:29:09.168
cmhopr0sg00527rlucqjtz9ho	cmhopr0sg00507rlub7jtx6u1	cmhoost5m00007refpcjkkep3	Opnieuw proberen	2025-11-07 10:29:09.184	2025-11-07 10:29:09.184
cmhopr0sg00537rluyu8d0r6v	cmhopr0sg00507rlub7jtx6u1	cmhoost6300017refg0dkno6u	Réessayer	2025-11-07 10:29:09.184	2025-11-07 10:29:09.184
cmhopr0sv00567rluahg08dxy	cmhopr0sv00547rlu8b28wuk9	cmhoost5m00007refpcjkkep3	Ik accepteer het privacybeleid en ga akkoord met de verwerking van mijn persoonsgegevens voor het beantwoorden van mijn vraag. *	2025-11-07 10:29:09.199	2025-11-07 10:29:09.199
cmhopr0sv00577rlunzhi8kke	cmhopr0sv00547rlu8b28wuk9	cmhoost6300017refg0dkno6u	J'accepte la politique de confidentialité et j'accepte le traitement de mes données personnelles pour répondre à ma demande. *	2025-11-07 10:29:09.199	2025-11-07 10:29:09.199
cmhopr0t9005a7rluvtzyqisb	cmhopr0t900587rluca64knjn	cmhoost5m00007refpcjkkep3	Ik zou graag af en toe updates ontvangen over uw diensten en projecten (optioneel).	2025-11-07 10:29:09.213	2025-11-07 10:29:09.213
cmhopr0t9005b7rlu23z8edrl	cmhopr0t900587rluca64knjn	cmhoost6300017refg0dkno6u	J'aimerais recevoir occasionnellement des mises à jour sur vos services et projets (optionnel).	2025-11-07 10:29:09.213	2025-11-07 10:29:09.213
cmhopr0tp005e7rlu6oui51cm	cmhopr0tp005c7rluz5z4yjo3	cmhoost5m00007refpcjkkep3	Gegevensbescherming:	2025-11-07 10:29:09.23	2025-11-07 10:29:09.23
cmhopr0tp005f7rluawqkav5z	cmhopr0tp005c7rluz5z4yjo3	cmhoost6300017refg0dkno6u	Avis de protection des données:	2025-11-07 10:29:09.23	2025-11-07 10:29:09.23
cmhopr0u7005i7rlu6ls7ec4r	cmhopr0u6005g7rluvvuaz3qg	cmhoost5m00007refpcjkkep3	Inloggen	2025-11-07 10:29:09.247	2025-11-07 10:29:09.247
cmhopr0u7005j7rlu9usmdrw9	cmhopr0u6005g7rluvvuaz3qg	cmhoost6300017refg0dkno6u	Se connecter	2025-11-07 10:29:09.247	2025-11-07 10:29:09.247
cmhopr0uk005m7rlubj42g9hu	cmhopr0uk005k7rlu8vz51h3x	cmhoost5m00007refpcjkkep3	Registreren	2025-11-07 10:29:09.26	2025-11-07 10:29:09.26
cmhopr0uk005n7rluhdluenmo	cmhopr0uk005k7rlu8vz51h3x	cmhoost6300017refg0dkno6u	S'inscrire	2025-11-07 10:29:09.26	2025-11-07 10:29:09.26
cmhopr0uz005q7rluo3ci7uq2	cmhopr0uz005o7rluefon45i4	cmhoost5m00007refpcjkkep3	Uitloggen	2025-11-07 10:29:09.275	2025-11-07 10:29:09.275
cmhopr0uz005r7rlui1o8kx42	cmhopr0uz005o7rluefon45i4	cmhoost6300017refg0dkno6u	Se déconnecter	2025-11-07 10:29:09.275	2025-11-07 10:29:09.275
cmhopr0vg005u7rlu23z5pvlh	cmhopr0vf005s7rlurhnx4zrv	cmhoost5m00007refpcjkkep3	Account aanmaken	2025-11-07 10:29:09.29	2025-11-07 10:29:09.29
cmhopr0vg005v7rluh1a79pdn	cmhopr0vf005s7rlurhnx4zrv	cmhoost6300017refg0dkno6u	Créer un compte	2025-11-07 10:29:09.29	2025-11-07 10:29:09.29
cmhopr0vv005y7rlu29k2xuee	cmhopr0vv005w7rlu8lx8a2k1	cmhoost5m00007refpcjkkep3	Welkom!	2025-11-07 10:29:09.307	2025-11-07 10:29:09.307
cmhopr0vv005z7rlurbouf9vv	cmhopr0vv005w7rlu8lx8a2k1	cmhoost6300017refg0dkno6u	Bienvenue!	2025-11-07 10:29:09.307	2025-11-07 10:29:09.307
cmhopr0wc00627rlu7qnin5uy	cmhopr0wc00607rlu1oje0m5s	cmhoost5m00007refpcjkkep3	Ingelogd als:	2025-11-07 10:29:09.324	2025-11-07 10:29:09.324
cmhopr0wc00637rlu4ntrdrg1	cmhopr0wc00607rlu1oje0m5s	cmhoost6300017refg0dkno6u	Connecté en tant que:	2025-11-07 10:29:09.324	2025-11-07 10:29:09.324
cmhopr0ws00667rlu3zqpeita	cmhopr0ws00647rlu3nf23cpw	cmhoost5m00007refpcjkkep3	Heeft u al een account?	2025-11-07 10:29:09.34	2025-11-07 10:29:09.34
cmhopr0ws00677rluwleggz20	cmhopr0ws00647rlu3nf23cpw	cmhoost6300017refg0dkno6u	Vous avez déjà un compte?	2025-11-07 10:29:09.34	2025-11-07 10:29:09.34
cmhopr0xm006a7rluuzzgffm9	cmhopr0xm00687rluob0yva8d	cmhoost5m00007refpcjkkep3	Heeft u nog geen account?	2025-11-07 10:29:09.371	2025-11-07 10:29:09.371
cmhopr0xm006b7rlunqcgmpz8	cmhopr0xm00687rluob0yva8d	cmhoost6300017refg0dkno6u	Vous n'avez pas de compte?	2025-11-07 10:29:09.371	2025-11-07 10:29:09.371
cmhopr0yc006e7rlu180exoip	cmhopr0yc006c7rlujmth7p0e	cmhoost5m00007refpcjkkep3	Terug naar site	2025-11-07 10:29:09.397	2025-11-07 10:29:09.397
cmhopr0yc006f7rluv5mdq1ru	cmhopr0yc006c7rlujmth7p0e	cmhoost6300017refg0dkno6u	Retour au site	2025-11-07 10:29:09.397	2025-11-07 10:29:09.397
cmhopr0z0006i7rlun1wexigd	cmhopr0z0006g7rlu2t0uu4o7	cmhoost5m00007refpcjkkep3	Project bewerken	2025-11-07 10:29:09.42	2025-11-07 10:29:09.42
cmhopr0z0006j7rlunrn6pzl3	cmhopr0z0006g7rlu2t0uu4o7	cmhoost6300017refg0dkno6u	Modifier le projet	2025-11-07 10:29:09.42	2025-11-07 10:29:09.42
cmhopr0zd006m7rluq5lxwrv7	cmhopr0zd006k7rlum914t3en	cmhoost5m00007refpcjkkep3	Project aanmaken	2025-11-07 10:29:09.434	2025-11-07 10:29:09.434
cmhopr0zd006n7rlumjczubju	cmhopr0zd006k7rlum914t3en	cmhoost6300017refg0dkno6u	Créer un projet	2025-11-07 10:29:09.434	2025-11-07 10:29:09.434
cmhopr0zt006q7rlu0fkipmrc	cmhopr0zt006o7rlurqr8crte	cmhoost5m00007refpcjkkep3	Basisinstellingen	2025-11-07 10:29:09.449	2025-11-07 10:29:09.449
cmhopr0zt006r7rlus9nstqfw	cmhopr0zt006o7rlurqr8crte	cmhoost6300017refg0dkno6u	Paramètres de base	2025-11-07 10:29:09.449	2025-11-07 10:29:09.449
cmhopr10e006u7rlucch6izlq	cmhopr10e006s7rlucakpnohf	cmhoost5m00007refpcjkkep3	Inhoudstype	2025-11-07 10:29:09.47	2025-11-07 10:29:09.47
cmhopr10e006v7rlubl6w5q6v	cmhopr10e006s7rlucakpnohf	cmhoost6300017refg0dkno6u	Type de contenu	2025-11-07 10:29:09.47	2025-11-07 10:29:09.47
cmhopr10u006y7rlu57k3jmsv	cmhopr10t006w7rlu32xyu1k8	cmhoost5m00007refpcjkkep3	Selecteer inhoudstype	2025-11-07 10:29:09.486	2025-11-07 10:29:09.486
cmhopr10u006z7rluvixg3ehx	cmhopr10t006w7rlu32xyu1k8	cmhoost6300017refg0dkno6u	Sélectionnez le type de contenu	2025-11-07 10:29:09.486	2025-11-07 10:29:09.486
cmhopr11a00727rluanqc3p8p	cmhopr11a00707rluyjvtujvu	cmhoost5m00007refpcjkkep3	Uitgelicht	2025-11-07 10:29:09.502	2025-11-07 10:29:09.502
cmhopr11a00737rluym17q2fo	cmhopr11a00707rluyjvtujvu	cmhoost6300017refg0dkno6u	En vedette	2025-11-07 10:29:09.502	2025-11-07 10:29:09.502
cmhopr11r00767rlu40j063e6	cmhopr11r00747rlu91t37d35	cmhoost5m00007refpcjkkep3	Gepubliceerd	2025-11-07 10:29:09.519	2025-11-07 10:29:09.519
cmhopr11r00777rluyr5vgytb	cmhopr11r00747rlu91t37d35	cmhoost6300017refg0dkno6u	Publié	2025-11-07 10:29:09.519	2025-11-07 10:29:09.519
cmhopr125007a7rluro0flvrq	cmhopr12500787rlu84pqgiut	cmhoost5m00007refpcjkkep3	Vertalingen	2025-11-07 10:29:09.534	2025-11-07 10:29:09.534
cmhopr125007b7rluob8m6338	cmhopr12500787rlu84pqgiut	cmhoost6300017refg0dkno6u	Traductions	2025-11-07 10:29:09.534	2025-11-07 10:29:09.534
cmhopr12j007e7rlujhvkj7al	cmhopr12i007c7rluuii66ga0	cmhoost5m00007refpcjkkep3	Titel	2025-11-07 10:29:09.547	2025-11-07 10:29:09.547
cmhopr12j007f7rlukwvi6rni	cmhopr12i007c7rluuii66ga0	cmhoost6300017refg0dkno6u	Titre	2025-11-07 10:29:09.547	2025-11-07 10:29:09.547
cmhopr12x007i7rlua9ssxn02	cmhopr12x007g7rlubd4hn3wc	cmhoost5m00007refpcjkkep3	Projecttitel	2025-11-07 10:29:09.561	2025-11-07 10:29:09.561
cmhopr12x007j7rluhxfe5kyv	cmhopr12x007g7rlubd4hn3wc	cmhoost6300017refg0dkno6u	Titre du projet	2025-11-07 10:29:09.561	2025-11-07 10:29:09.561
cmhopr138007m7rluiu567hcx	cmhopr138007k7rlu5a439tav	cmhoost5m00007refpcjkkep3	Beschrijving	2025-11-07 10:29:09.573	2025-11-07 10:29:09.573
cmhopr139007n7rlumfnq1xp4	cmhopr138007k7rlu5a439tav	cmhoost6300017refg0dkno6u	Description	2025-11-07 10:29:09.573	2025-11-07 10:29:09.573
cmhopr13p007q7rlu6arverot	cmhopr13o007o7rludwpwzbwu	cmhoost5m00007refpcjkkep3	Projectbeschrijving	2025-11-07 10:29:09.589	2025-11-07 10:29:09.589
cmhopr13p007r7rluys9vjxp9	cmhopr13o007o7rludwpwzbwu	cmhoost6300017refg0dkno6u	Description du projet	2025-11-07 10:29:09.589	2025-11-07 10:29:09.589
cmhopr146007u7rlu0nepyk2w	cmhopr146007s7rluowx2o6rj	cmhoost5m00007refpcjkkep3	Materialen (gescheiden door komma's)	2025-11-07 10:29:09.606	2025-11-07 10:29:09.606
cmhopr146007v7rlup6m0us3a	cmhopr146007s7rluowx2o6rj	cmhoost6300017refg0dkno6u	Matériaux (séparés par des virgules)	2025-11-07 10:29:09.606	2025-11-07 10:29:09.606
cmhopr14i007y7rlu8czzdtl6	cmhopr14i007w7rlu4x915qrj	cmhoost5m00007refpcjkkep3	Hout, Metaal, Glas	2025-11-07 10:29:09.618	2025-11-07 10:29:09.618
cmhopr14i007z7rluzothmkha	cmhopr14i007w7rlu4x915qrj	cmhoost6300017refg0dkno6u	Bois, Métal, Verre	2025-11-07 10:29:09.618	2025-11-07 10:29:09.618
cmhopr14s00827rlujv1jvgmd	cmhopr14s00807rluw56knqtq	cmhoost5m00007refpcjkkep3	Afbeeldingen	2025-11-07 10:29:09.629	2025-11-07 10:29:09.629
cmhopr14s00837rlu3qup7gnv	cmhopr14s00807rluw56knqtq	cmhoost6300017refg0dkno6u	Images	2025-11-07 10:29:09.629	2025-11-07 10:29:09.629
cmhopr15200867rlupnw1yajh	cmhopr15100847rlu889maeur	cmhoost5m00007refpcjkkep3	Project bijwerken	2025-11-07 10:29:09.638	2025-11-07 10:29:09.638
cmhopr15200877rluqj8qzyd4	cmhopr15100847rlu889maeur	cmhoost6300017refg0dkno6u	Mettre à jour le projet	2025-11-07 10:29:09.638	2025-11-07 10:29:09.638
cmhopr15h008a7rlum8pxw5ug	cmhopr15g00887rluf3wl22pa	cmhoost5m00007refpcjkkep3	Opslaan...	2025-11-07 10:29:09.653	2025-11-07 10:29:09.653
cmhopr15h008b7rluwiv8ubq6	cmhopr15g00887rluf3wl22pa	cmhoost6300017refg0dkno6u	Enregistrement...	2025-11-07 10:29:09.653	2025-11-07 10:29:09.653
cmhopr15v008e7rluwtveri3p	cmhopr15u008c7rluza8f7rfd	cmhoost5m00007refpcjkkep3	Onbekende taal	2025-11-07 10:29:09.667	2025-11-07 10:29:09.667
cmhopr15v008f7rluz6c7lxi9	cmhopr15u008c7rluza8f7rfd	cmhoost6300017refg0dkno6u	Langue inconnue	2025-11-07 10:29:09.667	2025-11-07 10:29:09.667
cmhopr16h008i7rluaazh6vi9	cmhopr16h008g7rluqcks88oq	cmhoost5m00007refpcjkkep3	Thema	2025-11-07 10:29:09.689	2025-11-07 10:29:09.689
cmhopr16h008j7rlugifj1dfk	cmhopr16h008g7rluqcks88oq	cmhoost6300017refg0dkno6u	Thème	2025-11-07 10:29:09.689	2025-11-07 10:29:09.689
cmhopr16t008m7rluqj06ww4n	cmhopr16t008k7rlug7ivnnsc	cmhoost5m00007refpcjkkep3	Taal	2025-11-07 10:29:09.701	2025-11-07 10:29:09.701
cmhopr16t008n7rlu5qvg9bbj	cmhopr16t008k7rlug7ivnnsc	cmhoost6300017refg0dkno6u	Langue	2025-11-07 10:29:09.701	2025-11-07 10:29:09.701
cmhopr17k008q7rlu31g9uq8z	cmhopr17j008o7rlu9otr4n7g	cmhoost5m00007refpcjkkep3	Rein Art Design	2025-11-07 10:29:09.727	2025-11-07 10:29:09.727
cmhopr17k008r7rlupn34dh8f	cmhopr17j008o7rlu9otr4n7g	cmhoost6300017refg0dkno6u	Rein Art Design	2025-11-07 10:29:09.727	2025-11-07 10:29:09.727
cmhopr18a008u7rluqu1t4dh6	cmhopr18a008s7rlujsx47dag	cmhoost5m00007refpcjkkep3	Elegante en functionele meubels handgemaakt in onze werkplaats	2025-11-07 10:29:09.754	2025-11-07 10:29:09.754
cmhopr18a008v7rluojlqqz2c	cmhopr18a008s7rlujsx47dag	cmhoost6300017refg0dkno6u	Meubles élégants et fonctionnels fabriqués à la main dans notre atelier	2025-11-07 10:29:09.754	2025-11-07 10:29:09.754
cmhopr18p008y7rlulnpihwl7	cmhopr18p008w7rluwtp48ngr	cmhoost5m00007refpcjkkep3	Navigatie	2025-11-07 10:29:09.769	2025-11-07 10:29:09.769
cmhopr18p008z7rluiqhvgdyh	cmhopr18p008w7rluwtp48ngr	cmhoost6300017refg0dkno6u	Navigation	2025-11-07 10:29:09.769	2025-11-07 10:29:09.769
cmhopr19200927rluswkx775t	cmhopr19200907rlujk37l68e	cmhoost5m00007refpcjkkep3	Juridisch	2025-11-07 10:29:09.782	2025-11-07 10:29:09.782
cmhopr19200937rluwe7pra9f	cmhopr19200907rlujk37l68e	cmhoost6300017refg0dkno6u	Légal	2025-11-07 10:29:09.782	2025-11-07 10:29:09.782
cmhopr19e00967rluc48s8dpo	cmhopr19d00947rlu5rdrd85g	cmhoost5m00007refpcjkkep3	Privacybeleid	2025-11-07 10:29:09.793	2025-11-07 10:29:09.793
cmhopr19e00977rluy7e3om79	cmhopr19d00947rlu5rdrd85g	cmhoost6300017refg0dkno6u	Politique de confidentialité	2025-11-07 10:29:09.793	2025-11-07 10:29:09.793
cmhopr19x009a7rluannwwcxo	cmhopr19x00987rlu9clr5oy5	cmhoost5m00007refpcjkkep3	Servicevoorwaarden	2025-11-07 10:29:09.813	2025-11-07 10:29:09.813
cmhopr19x009b7rluca69qy9w	cmhopr19x00987rlu9clr5oy5	cmhoost6300017refg0dkno6u	Conditions d'utilisation	2025-11-07 10:29:09.813	2025-11-07 10:29:09.813
cmhopr1ac009e7rluurjajb8l	cmhopr1ac009c7rluet1unfiw	cmhoost5m00007refpcjkkep3	Cookievoorkeuren	2025-11-07 10:29:09.829	2025-11-07 10:29:09.829
cmhopr1ac009f7rlujjcmdpw9	cmhopr1ac009c7rluet1unfiw	cmhoost6300017refg0dkno6u	Préférences de cookies	2025-11-07 10:29:09.829	2025-11-07 10:29:09.829
cmhopr1at009i7rluicfx56j9	cmhopr1at009g7rluvtw7a3yo	cmhoost5m00007refpcjkkep3	Alle rechten voorbehouden.	2025-11-07 10:29:09.846	2025-11-07 10:29:09.846
cmhopr1at009j7rluxwka3c3a	cmhopr1at009g7rluvtw7a3yo	cmhoost6300017refg0dkno6u	Tous droits réservés.	2025-11-07 10:29:09.846	2025-11-07 10:29:09.846
cmhopr1b5009m7rluq6apujf3	cmhopr1b5009k7rluorrdt5pc	cmhoost5m00007refpcjkkep3	Neem contact op	2025-11-07 10:29:09.857	2025-11-07 10:29:09.857
cmhopr1b5009n7rlu9fi54gif	cmhopr1b5009k7rluorrdt5pc	cmhoost6300017refg0dkno6u	Contactez-nous	2025-11-07 10:29:09.857	2025-11-07 10:29:09.857
cmhopr1bl009q7rlut36p8d2l	cmhopr1bl009o7rluwwxrmgsg	cmhoost5m00007refpcjkkep3	Neem contact met ons op voor vragen over onze meubels of voor een op maat gemaakte opdracht. We staan klaar om samen met u uw droommeubel te ontwerpen en te realiseren.	2025-11-07 10:29:09.871	2025-11-07 10:29:09.871
cmhopr1bl009r7rlu7w6rb2dz	cmhopr1bl009o7rluwwxrmgsg	cmhoost6300017refg0dkno6u	Contactez-nous pour des questions sur nos meubles ou pour une commande sur mesure. Nous sommes prêts à concevoir et réaliser votre meuble de rêve avec vous.	2025-11-07 10:29:09.871	2025-11-07 10:29:09.871
cmhopr1bz009u7rluzlhpeoz5	cmhopr1bz009s7rluk5uwjw6x	cmhoost5m00007refpcjkkep3	Stuur ons een bericht	2025-11-07 10:29:09.887	2025-11-07 10:29:09.887
cmhopr1bz009v7rluaggt5rln	cmhopr1bz009s7rluk5uwjw6x	cmhoost6300017refg0dkno6u	Envoyez-nous un message	2025-11-07 10:29:09.887	2025-11-07 10:29:09.887
cmhopr1cb009y7rlulka7ik5d	cmhopr1cb009w7rlukwe8roi3	cmhoost5m00007refpcjkkep3	Contactgegevens	2025-11-07 10:29:09.9	2025-11-07 10:29:09.9
cmhopr1cb009z7rlul4xujenm	cmhopr1cb009w7rlukwe8roi3	cmhoost6300017refg0dkno6u	Informations de contact	2025-11-07 10:29:09.9	2025-11-07 10:29:09.9
cmhopr1cp00a27rlus1kc3aao	cmhopr1cp00a07rlu4t3cgduw	cmhoost5m00007refpcjkkep3	E-mail	2025-11-07 10:29:09.914	2025-11-07 10:29:09.914
cmhopr1cp00a37rlu9noplymo	cmhopr1cp00a07rlu4t3cgduw	cmhoost6300017refg0dkno6u	E-mail	2025-11-07 10:29:09.914	2025-11-07 10:29:09.914
cmhopr1d200a67rlub63dg54n	cmhopr1d100a47rlurc1v80qb	cmhoost5m00007refpcjkkep3	Telefoon	2025-11-07 10:29:09.926	2025-11-07 10:29:09.926
cmhopr1d200a77rlu10x6ccta	cmhopr1d100a47rlurc1v80qb	cmhoost6300017refg0dkno6u	Téléphone	2025-11-07 10:29:09.926	2025-11-07 10:29:09.926
cmhopr1df00aa7rlut2nfz475	cmhopr1df00a87rlustui0cb2	cmhoost5m00007refpcjkkep3	Locatie	2025-11-07 10:29:09.939	2025-11-07 10:29:09.939
cmhopr1df00ab7rluaj82gkub	cmhopr1df00a87rlustui0cb2	cmhoost6300017refg0dkno6u	Localisation	2025-11-07 10:29:09.939	2025-11-07 10:29:09.939
cmhopr1dt00ae7rluryod3qyz	cmhopr1dt00ac7rluf616acjo	cmhoost5m00007refpcjkkep3	Openingstijden	2025-11-07 10:29:09.954	2025-11-07 10:29:09.954
cmhopr1dt00af7rlujotqa12o	cmhopr1dt00ac7rluf616acjo	cmhoost6300017refg0dkno6u	Heures d'ouverture	2025-11-07 10:29:09.954	2025-11-07 10:29:09.954
cmhopr1e700ai7rluddr6v8p6	cmhopr1e700ag7rlu1gniczri	cmhoost5m00007refpcjkkep3	Maandag - Vrijdag	2025-11-07 10:29:09.967	2025-11-07 10:29:09.967
cmhopr1e700aj7rlud34hpcxw	cmhopr1e700ag7rlu1gniczri	cmhoost6300017refg0dkno6u	Lundi - Vendredi	2025-11-07 10:29:09.967	2025-11-07 10:29:09.967
cmhopr1ep00am7rlupjs1tmek	cmhopr1ep00ak7rluvh72ukvz	cmhoost5m00007refpcjkkep3	Zaterdag	2025-11-07 10:29:09.985	2025-11-07 10:29:09.985
cmhopr1ep00an7rlu6blnkx6j	cmhopr1ep00ak7rluvh72ukvz	cmhoost6300017refg0dkno6u	Samedi	2025-11-07 10:29:09.985	2025-11-07 10:29:09.985
cmhopr1f600aq7rlud9z7nzw5	cmhopr1f600ao7rlukvcgwbia	cmhoost5m00007refpcjkkep3	Zondag	2025-11-07 10:29:10.002	2025-11-07 10:29:10.002
cmhopr1f600ar7rlu7qgla5mz	cmhopr1f600ao7rlukvcgwbia	cmhoost6300017refg0dkno6u	Dimanche	2025-11-07 10:29:10.002	2025-11-07 10:29:10.002
cmhopr1fm00au7rluuoaqaotw	cmhopr1fl00as7rluuda7dd2q	cmhoost5m00007refpcjkkep3	Gesloten	2025-11-07 10:29:10.018	2025-11-07 10:29:10.018
cmhopr1fm00av7rlu6yck14nx	cmhopr1fl00as7rluuda7dd2q	cmhoost6300017refg0dkno6u	Fermé	2025-11-07 10:29:10.018	2025-11-07 10:29:10.018
cmhopr1g100ay7rluoj2w3997	cmhopr1g000aw7rlug1p4ofkj	cmhoost5m00007refpcjkkep3	Snelle reactie	2025-11-07 10:29:10.033	2025-11-07 10:29:10.033
cmhopr1g100az7rlu2hisrxj5	cmhopr1g000aw7rlug1p4ofkj	cmhoost6300017refg0dkno6u	Réponse rapide	2025-11-07 10:29:10.033	2025-11-07 10:29:10.033
cmhopr1gg00b27rlu0g10ct5w	cmhopr1gg00b07rlufctdg1w5	cmhoost5m00007refpcjkkep3	We reageren meestal op alle vragen binnen 24 uur tijdens werkdagen.	2025-11-07 10:29:10.048	2025-11-07 10:29:10.048
cmhopr1gg00b37rluhn80mwxc	cmhopr1gg00b07rlufctdg1w5	cmhoost6300017refg0dkno6u	Nous répondons généralement à toutes les demandes dans les 24 heures pendant les jours ouvrables.	2025-11-07 10:29:10.048	2025-11-07 10:29:10.048
cmhopr1gy00b67rluec5q31p5	cmhopr1gx00b47rluhfzquvjn	cmhoost5m00007refpcjkkep3	← Terug naar Home	2025-11-07 10:29:10.066	2025-11-07 10:29:10.066
cmhopr1gy00b77rlue01wc0z9	cmhopr1gx00b47rluhfzquvjn	cmhoost6300017refg0dkno6u	← Retour à l'accueil	2025-11-07 10:29:10.066	2025-11-07 10:29:10.066
cmhopr1hc00ba7rlu46wit09d	cmhopr1hc00b87rlu2wxkf97d	cmhoost5m00007refpcjkkep3	Paginainstellingen	2025-11-07 10:29:10.081	2025-11-07 10:29:10.081
cmhopr1hc00bb7rlun6zb1wwf	cmhopr1hc00b87rlu2wxkf97d	cmhoost6300017refg0dkno6u	Paramètres de page	2025-11-07 10:29:10.081	2025-11-07 10:29:10.081
cmhopr1hv00be7rluh1pytntd	cmhopr1hu00bc7rlu67xzji0w	cmhoost5m00007refpcjkkep3	Slug	2025-11-07 10:29:10.098	2025-11-07 10:29:10.098
cmhopr1hv00bf7rlu8teerxj3	cmhopr1hu00bc7rlu67xzji0w	cmhoost6300017refg0dkno6u	Slug	2025-11-07 10:29:10.098	2025-11-07 10:29:10.098
cmhopr1ic00bi7rlu3gx446lw	cmhopr1ic00bg7rlu5ov23kvx	cmhoost5m00007refpcjkkep3	Genereer van titel	2025-11-07 10:29:10.116	2025-11-07 10:29:10.116
cmhopr1ic00bj7rluwf5r5cx9	cmhopr1ic00bg7rlu5ov23kvx	cmhoost6300017refg0dkno6u	Générer à partir du titre	2025-11-07 10:29:10.116	2025-11-07 10:29:10.116
cmhopr1ir00bm7rluywbgicl7	cmhopr1iq00bk7rlu3qz8znas	cmhoost5m00007refpcjkkep3	Gepubliceerd	2025-11-07 10:29:10.131	2025-11-07 10:29:10.131
cmhopr1ir00bn7rlu7avnym0d	cmhopr1iq00bk7rlu3qz8znas	cmhoost6300017refg0dkno6u	Publié	2025-11-07 10:29:10.131	2025-11-07 10:29:10.131
cmhopr1j200bq7rlu9pt2eb3g	cmhopr1j200bo7rluj5rya0to	cmhoost5m00007refpcjkkep3	Titel	2025-11-07 10:29:10.143	2025-11-07 10:29:10.143
cmhopr1j200br7rluek6d6sh7	cmhopr1j200bo7rluj5rya0to	cmhoost6300017refg0dkno6u	Titre	2025-11-07 10:29:10.143	2025-11-07 10:29:10.143
cmhopr1ji00bu7rlulccehj17	cmhopr1jh00bs7rlucorjst05	cmhoost5m00007refpcjkkep3	Voer paginatitel in...	2025-11-07 10:29:10.158	2025-11-07 10:29:10.158
cmhopr1ji00bv7rlu6sgle9uq	cmhopr1jh00bs7rlucorjst05	cmhoost6300017refg0dkno6u	Entrez le titre de la page...	2025-11-07 10:29:10.158	2025-11-07 10:29:10.158
cmhopr1jy00by7rlu8x688uhu	cmhopr1jx00bw7rluigp1l5pu	cmhoost5m00007refpcjkkep3	Inhoud	2025-11-07 10:29:10.174	2025-11-07 10:29:10.174
cmhopr1jy00bz7rlu11gsb0ma	cmhopr1jx00bw7rluigp1l5pu	cmhoost6300017refg0dkno6u	Contenu	2025-11-07 10:29:10.174	2025-11-07 10:29:10.174
cmhopr1kf00c27rlua5i4144v	cmhopr1ke00c07rluo1i9tv6n	cmhoost5m00007refpcjkkep3	Schrijf inhoud in {language}...	2025-11-07 10:29:10.191	2025-11-07 10:29:10.191
cmhopr1kf00c37rludr5saj7z	cmhopr1ke00c07rluo1i9tv6n	cmhoost6300017refg0dkno6u	Écrivez le contenu en {language}...	2025-11-07 10:29:10.191	2025-11-07 10:29:10.191
cmhopr1kr00c67rluvi015a81	cmhopr1kr00c47rlu4wlvk76p	cmhoost5m00007refpcjkkep3	Standaard	2025-11-07 10:29:10.203	2025-11-07 10:29:10.203
cmhopr1kr00c77rlun6hdxy9g	cmhopr1kr00c47rlu4wlvk76p	cmhoost6300017refg0dkno6u	Par défaut	2025-11-07 10:29:10.203	2025-11-07 10:29:10.203
cmhopr1l800ca7rlunans9h19	cmhopr1l800c87rluj7ureh0t	cmhoost5m00007refpcjkkep3	Voorbeeld	2025-11-07 10:29:10.22	2025-11-07 10:29:10.22
cmhopr1l800cb7rlubadl34b6	cmhopr1l800c87rluj7ureh0t	cmhoost6300017refg0dkno6u	Aperçu	2025-11-07 10:29:10.22	2025-11-07 10:29:10.22
cmhopr1lm00ce7rlurndvvlry	cmhopr1lm00cc7rlu73vpdv70	cmhoost5m00007refpcjkkep3	Pagina aanmaken	2025-11-07 10:29:10.234	2025-11-07 10:29:10.234
cmhopr1lm00cf7rluirtda5up	cmhopr1lm00cc7rlu73vpdv70	cmhoost6300017refg0dkno6u	Créer la page	2025-11-07 10:29:10.234	2025-11-07 10:29:10.234
cmhopr1m100ci7rlu1i3cawc1	cmhopr1m000cg7rlugzqqax46	cmhoost5m00007refpcjkkep3	Wijzigingen opslaan	2025-11-07 10:29:10.249	2025-11-07 10:29:10.249
cmhopr1m100cj7rlun7wr9vco	cmhopr1m000cg7rlugzqqax46	cmhoost6300017refg0dkno6u	Enregistrer les modifications	2025-11-07 10:29:10.249	2025-11-07 10:29:10.249
cmhopr1mh00cm7rluof7ebelf	cmhopr1mh00ck7rlu5ochbus4	cmhoost5m00007refpcjkkep3	Bewerk in {language}	2025-11-07 10:29:10.266	2025-11-07 10:29:10.266
cmhopr1mh00cn7rlud2lii8gj	cmhopr1mh00ck7rlu5ochbus4	cmhoost6300017refg0dkno6u	Modifier en {language}	2025-11-07 10:29:10.266	2025-11-07 10:29:10.266
cmhopr1my00cq7rlu3mtrfl0h	cmhopr1my00co7rlu7o9smww6	cmhoost5m00007refpcjkkep3	Vertaal naar alle talen	2025-11-07 10:29:10.282	2025-11-07 10:29:10.282
cmhopr1my00cr7rlu6utnln7z	cmhopr1my00co7rlu7o9smww6	cmhoost6300017refg0dkno6u	Traduire vers toutes les langues	2025-11-07 10:29:10.282	2025-11-07 10:29:10.282
cmhopr1nd00cu7rluobzg8a11	cmhopr1nc00cs7rlut5hd3421	cmhoost5m00007refpcjkkep3	Inhoudspagina's	2025-11-07 10:29:10.297	2025-11-07 10:29:10.297
cmhopr1nd00cv7rluhc241r19	cmhopr1nc00cs7rlut5hd3421	cmhoost6300017refg0dkno6u	Pages de contenu	2025-11-07 10:29:10.297	2025-11-07 10:29:10.297
cmhopr1nq00cy7rluwokrbi0c	cmhopr1nq00cw7rlupemf36nq	cmhoost5m00007refpcjkkep3	Beheer uw website inhoudspagina's	2025-11-07 10:29:10.31	2025-11-07 10:29:10.31
cmhopr1nq00cz7rluf0ocp0rs	cmhopr1nq00cw7rlupemf36nq	cmhoost6300017refg0dkno6u	Gérez les pages de contenu de votre site web	2025-11-07 10:29:10.31	2025-11-07 10:29:10.31
cmhopr1o500d27rlusfv9jn37	cmhopr1o500d07rludaqc76qu	cmhoost5m00007refpcjkkep3	Nieuwe pagina	2025-11-07 10:29:10.326	2025-11-07 10:29:10.326
cmhopr1o500d37rlu3r88is4h	cmhopr1o500d07rludaqc76qu	cmhoost6300017refg0dkno6u	Nouvelle page	2025-11-07 10:29:10.326	2025-11-07 10:29:10.326
cmhopr1of00d67rluq72ixm97	cmhopr1of00d47rluxodknptw	cmhoost5m00007refpcjkkep3	Zoek pagina's...	2025-11-07 10:29:10.335	2025-11-07 10:29:10.335
cmhopr1of00d77rluwpvsl6en	cmhopr1of00d47rluxodknptw	cmhoost6300017refg0dkno6u	Rechercher des pages...	2025-11-07 10:29:10.335	2025-11-07 10:29:10.335
cmhopr1os00da7rluntfdghjn	cmhopr1os00d87rlu7nrb2slb	cmhoost5m00007refpcjkkep3	Alle talen	2025-11-07 10:29:10.348	2025-11-07 10:29:10.348
cmhopr1os00db7rlu2p1cwpmr	cmhopr1os00d87rlu7nrb2slb	cmhoost6300017refg0dkno6u	Toutes les langues	2025-11-07 10:29:10.348	2025-11-07 10:29:10.348
cmhopr1p800de7rludia8mqc1	cmhopr1p800dc7rlu2cpy61wr	cmhoost5m00007refpcjkkep3	Alle statussen	2025-11-07 10:29:10.364	2025-11-07 10:29:10.364
cmhopr1p800df7rluocsgt01q	cmhopr1p800dc7rlu2cpy61wr	cmhoost6300017refg0dkno6u	Tous les statuts	2025-11-07 10:29:10.364	2025-11-07 10:29:10.364
cmhopr1pk00di7rlurmygow18	cmhopr1pj00dg7rlucbk3fjgw	cmhoost5m00007refpcjkkep3	Gepubliceerd	2025-11-07 10:29:10.376	2025-11-07 10:29:10.376
cmhopr1pk00dj7rlu21e306mp	cmhopr1pj00dg7rlucbk3fjgw	cmhoost6300017refg0dkno6u	Publié	2025-11-07 10:29:10.376	2025-11-07 10:29:10.376
cmhopr1pu00dm7rlumn7mr941	cmhopr1pu00dk7rlu7cyk9t3u	cmhoost5m00007refpcjkkep3	Niet gepubliceerd	2025-11-07 10:29:10.386	2025-11-07 10:29:10.386
cmhopr1pu00dn7rlu2eklhzjp	cmhopr1pu00dk7rlu7cyk9t3u	cmhoost6300017refg0dkno6u	Non publié	2025-11-07 10:29:10.386	2025-11-07 10:29:10.386
cmhopr1q600dq7rluy7j40trp	cmhopr1q600do7rluztrulmz7	cmhoost5m00007refpcjkkep3	Project aanmaken	2025-11-07 10:29:10.398	2025-11-07 10:29:10.398
cmhopr1q600dr7rlucirqc6fx	cmhopr1q600do7rluztrulmz7	cmhoost6300017refg0dkno6u	Créer un projet	2025-11-07 10:29:10.398	2025-11-07 10:29:10.398
cmhopr1qh00du7rluoc7qrwz1	cmhopr1qh00ds7rlu271ifq3c	cmhoost5m00007refpcjkkep3	Zoek projecten...	2025-11-07 10:29:10.409	2025-11-07 10:29:10.409
cmhopr1qh00dv7rlubdycip4h	cmhopr1qh00ds7rlu271ifq3c	cmhoost6300017refg0dkno6u	Rechercher des projets...	2025-11-07 10:29:10.409	2025-11-07 10:29:10.409
cmhopr1qu00dy7rlun6s76za3	cmhopr1qu00dw7rlul7qytdbe	cmhoost5m00007refpcjkkep3	Alle projecten	2025-11-07 10:29:10.422	2025-11-07 10:29:10.422
cmhopr1qu00dz7rlu1r7t6ko9	cmhopr1qu00dw7rlul7qytdbe	cmhoost6300017refg0dkno6u	Tous les projets	2025-11-07 10:29:10.422	2025-11-07 10:29:10.422
cmhopr1r800e27rluucc5wcom	cmhopr1r800e07rlu3cd3l80b	cmhoost5m00007refpcjkkep3	Uitgelicht	2025-11-07 10:29:10.436	2025-11-07 10:29:10.436
cmhopr1r900e37rlu05ff2esd	cmhopr1r800e07rlu3cd3l80b	cmhoost6300017refg0dkno6u	En vedette	2025-11-07 10:29:10.436	2025-11-07 10:29:10.436
cmhopr1rn00e67rluu5z4etut	cmhopr1rn00e47rluok5rsn0c	cmhoost5m00007refpcjkkep3	Niet uitgelicht	2025-11-07 10:29:10.451	2025-11-07 10:29:10.451
cmhopr1rn00e77rluba9ui7ni	cmhopr1rn00e47rluok5rsn0c	cmhoost6300017refg0dkno6u	Non en vedette	2025-11-07 10:29:10.451	2025-11-07 10:29:10.451
cmhopr1s200ea7rlu2a381lcf	cmhopr1s200e87rlu7lpez189	cmhoost5m00007refpcjkkep3	Concept	2025-11-07 10:29:10.466	2025-11-07 10:29:10.466
cmhopr1s200eb7rlus8mkbxts	cmhopr1s200e87rlu7lpez189	cmhoost6300017refg0dkno6u	Brouillon	2025-11-07 10:29:10.466	2025-11-07 10:29:10.466
cmhopr1sf00ee7rlunxhyeu5e	cmhopr1sf00ec7rlu746do9yu	cmhoost5m00007refpcjkkep3	Project	2025-11-07 10:29:10.48	2025-11-07 10:29:10.48
cmhopr1sf00ef7rlup0srqy0f	cmhopr1sf00ec7rlu746do9yu	cmhoost6300017refg0dkno6u	Projet	2025-11-07 10:29:10.48	2025-11-07 10:29:10.48
cmhopr1sw00ei7rluz883okhx	cmhopr1sw00eg7rluzsr4u93b	cmhoost5m00007refpcjkkep3	Status	2025-11-07 10:29:10.497	2025-11-07 10:29:10.497
cmhopr1sw00ej7rlu9yrodcx0	cmhopr1sw00eg7rluzsr4u93b	cmhoost6300017refg0dkno6u	Statut	2025-11-07 10:29:10.497	2025-11-07 10:29:10.497
cmhopr1ta00em7rlu578op6c1	cmhopr1ta00ek7rluoztg2yv1	cmhoost5m00007refpcjkkep3	Afbeeldingen	2025-11-07 10:29:10.51	2025-11-07 10:29:10.51
cmhopr1ta00en7rlu3i1m2g0g	cmhopr1ta00ek7rluoztg2yv1	cmhoost6300017refg0dkno6u	Images	2025-11-07 10:29:10.51	2025-11-07 10:29:10.51
cmhopr1tr00eq7rluq96wvpoq	cmhopr1tr00eo7rlupzzj66me	cmhoost5m00007refpcjkkep3	Aangemaakt	2025-11-07 10:29:10.527	2025-11-07 10:29:10.527
cmhopr1tr00er7rlugvhsf5n2	cmhopr1tr00eo7rlupzzj66me	cmhoost6300017refg0dkno6u	Créé	2025-11-07 10:29:10.527	2025-11-07 10:29:10.527
cmhopr1u400eu7rlufad1ibrg	cmhopr1u400es7rlusvktt7hs	cmhoost5m00007refpcjkkep3	Acties	2025-11-07 10:29:10.54	2025-11-07 10:29:10.54
cmhopr1u400ev7rlux0ai0j84	cmhopr1u400es7rlusvktt7hs	cmhoost6300017refg0dkno6u	Actions	2025-11-07 10:29:10.54	2025-11-07 10:29:10.54
cmhopr1uh00ey7rlumrby3nwv	cmhopr1uh00ew7rlu3k3so9kb	cmhoost5m00007refpcjkkep3	Geen projecten gevonden. Maak uw eerste project aan om te beginnen.	2025-11-07 10:29:10.553	2025-11-07 10:29:10.553
cmhopr1uh00ez7rluyk0zik6x	cmhopr1uh00ew7rlu3k3so9kb	cmhoost6300017refg0dkno6u	Aucun projet trouvé. Créez votre premier projet pour commencer.	2025-11-07 10:29:10.553	2025-11-07 10:29:10.553
cmhopr1uw00f27rlu21ap4nab	cmhopr1uw00f07rlu13drbwll	cmhoost5m00007refpcjkkep3	vertaling(en)	2025-11-07 10:29:10.568	2025-11-07 10:29:10.568
cmhopr1uw00f37rlut5zjpjrn	cmhopr1uw00f07rlu13drbwll	cmhoost6300017refg0dkno6u	traduction(s)	2025-11-07 10:29:10.568	2025-11-07 10:29:10.568
cmhopr1vb00f67rlugrjuq8yt	cmhopr1va00f47rlu9yzkaq3j	cmhoost5m00007refpcjkkep3	Laden...	2025-11-07 10:29:10.583	2025-11-07 10:29:10.583
cmhopr1vb00f77rlu83h9puvd	cmhopr1va00f47rlu9yzkaq3j	cmhoost6300017refg0dkno6u	Chargement...	2025-11-07 10:29:10.583	2025-11-07 10:29:10.583
cmhopr1vr00fa7rluhn1d9msu	cmhopr1vr00f87rlub0kldgtf	cmhoost5m00007refpcjkkep3	Projecten laden...	2025-11-07 10:29:10.599	2025-11-07 10:29:10.599
cmhopr1vr00fb7rlua5kz5wdy	cmhopr1vr00f87rlub0kldgtf	cmhoost6300017refg0dkno6u	Chargement des projets...	2025-11-07 10:29:10.599	2025-11-07 10:29:10.599
cmhopr1wb00fe7rlujhbbvr5u	cmhopr1wb00fc7rlu0mpqh1ua	cmhoost5m00007refpcjkkep3	Fout	2025-11-07 10:29:10.619	2025-11-07 10:29:10.619
cmhopr1wb00ff7rlut1lf2x8j	cmhopr1wb00fc7rlu0mpqh1ua	cmhoost6300017refg0dkno6u	Erreur	2025-11-07 10:29:10.619	2025-11-07 10:29:10.619
cmhopr1wq00fi7rlusub7v8ne	cmhopr1wp00fg7rlu3dpbiahf	cmhoost5m00007refpcjkkep3	Opnieuw proberen	2025-11-07 10:29:10.634	2025-11-07 10:29:10.634
cmhopr1wq00fj7rluyihp2sa2	cmhopr1wp00fg7rlu3dpbiahf	cmhoost6300017refg0dkno6u	Réessayer	2025-11-07 10:29:10.634	2025-11-07 10:29:10.634
cmhopr1x500fm7rluqnd6j2yb	cmhopr1x500fk7rlu0ejwtku0	cmhoost5m00007refpcjkkep3	Onze Projecten	2025-11-07 10:29:10.65	2025-11-07 10:29:10.65
cmhopr1x500fn7rlufwqwh76s	cmhopr1x500fk7rlu0ejwtku0	cmhoost6300017refg0dkno6u	Nos Projets	2025-11-07 10:29:10.65	2025-11-07 10:29:10.65
cmhopr1xl00fq7rlusj1imm49	cmhopr1xl00fo7rluyaad38bi	cmhoost5m00007refpcjkkep3	Ontdek onze collectie van op maat gemaakte meubels. Elk stuk wordt in huis ontworpen en handgemaakt in onze werkplaats met aandacht voor detail en duurzaamheid.	2025-11-07 10:29:10.665	2025-11-07 10:29:10.665
cmhopr1xl00fr7rlunc832b7o	cmhopr1xl00fo7rluyaad38bi	cmhoost6300017refg0dkno6u	Explorez notre collection de meubles sur mesure. Chaque pièce est conçue en interne et fabriquée à la main dans notre atelier avec attention aux détails et durabilité.	2025-11-07 10:29:10.665	2025-11-07 10:29:10.665
cmhopr1y300fu7rlu15ba0qae	cmhopr1y200fs7rlunj9bhs34	cmhoost5m00007refpcjkkep3	← Terug naar Projecten	2025-11-07 10:29:10.683	2025-11-07 10:29:10.683
cmhopr1y300fv7rlui6nzd8zf	cmhopr1y200fs7rlunj9bhs34	cmhoost6300017refg0dkno6u	← Retour aux projets	2025-11-07 10:29:10.683	2025-11-07 10:29:10.683
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_preferences (id, "sessionId", language, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (id, "userId", role, permissions, "createdAt", "updatedAt") FROM stdin;
cmhopvsj2000z7r2jtwkt2np2	cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	admin	{"users": {"read": true, "create": true, "delete": true, "update": true}, "content": {"read": true, "create": true, "delete": true, "update": true}, "messages": {"read": true, "delete": true, "update": true}, "projects": {"read": true, "create": true, "delete": true, "update": true}, "settings": {"read": true, "update": true}, "analytics": {"read": true}}	2025-11-07 10:32:51.759	2025-11-07 10:32:51.759
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, "emailVerified", image, "createdAt", "updatedAt") FROM stdin;
cQImRh8HwVk86zOK9WeoSC8AjEHjzmBP	Rein	admin@reinartdesign.be	f	\N	2025-11-07 10:06:24.8	2025-11-07 10:06:24.8
\.


--
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verifications (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: component_translations component_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_translations
    ADD CONSTRAINT component_translations_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: content_page_translations content_page_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_page_translations
    ADD CONSTRAINT content_page_translations_pkey PRIMARY KEY (id);


--
-- Name: content_pages content_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_pages
    ADD CONSTRAINT content_pages_pkey PRIMARY KEY (id);


--
-- Name: content_types content_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_types
    ADD CONSTRAINT content_types_pkey PRIMARY KEY (id);


--
-- Name: cookie_consents cookie_consents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cookie_consents
    ADD CONSTRAINT cookie_consents_pkey PRIMARY KEY (id);


--
-- Name: instagram_posts instagram_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instagram_posts
    ADD CONSTRAINT instagram_posts_pkey PRIMARY KEY (id);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: project_images project_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_images
    ADD CONSTRAINT project_images_pkey PRIMARY KEY (id);


--
-- Name: project_translations project_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_translations
    ADD CONSTRAINT project_translations_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: social_integrations social_integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_integrations
    ADD CONSTRAINT social_integrations_pkey PRIMARY KEY (id);


--
-- Name: translation_keys translation_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translation_keys
    ADD CONSTRAINT translation_keys_pkey PRIMARY KEY (id);


--
-- Name: translations translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT translations_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verifications verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_pkey PRIMARY KEY (id);


--
-- Name: accounts_accountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "accounts_accountId_key" ON public.accounts USING btree ("accountId");


--
-- Name: analytics_events_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "analytics_events_createdAt_idx" ON public.analytics_events USING btree ("createdAt");


--
-- Name: analytics_events_eventType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "analytics_events_eventType_idx" ON public.analytics_events USING btree ("eventType");


--
-- Name: analytics_events_pagePath_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "analytics_events_pagePath_idx" ON public.analytics_events USING btree ("pagePath");


--
-- Name: analytics_events_sessionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "analytics_events_sessionId_idx" ON public.analytics_events USING btree ("sessionId");


--
-- Name: component_translations_componentId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "component_translations_componentId_idx" ON public.component_translations USING btree ("componentId");


--
-- Name: component_translations_componentId_pageBuilderId_languageId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "component_translations_componentId_pageBuilderId_languageId_key" ON public.component_translations USING btree ("componentId", "pageBuilderId", "languageId", "fieldPath");


--
-- Name: component_translations_pageBuilderId_languageId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "component_translations_pageBuilderId_languageId_idx" ON public.component_translations USING btree ("pageBuilderId", "languageId");


--
-- Name: content_page_translations_pageId_languageId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "content_page_translations_pageId_languageId_key" ON public.content_page_translations USING btree ("pageId", "languageId");


--
-- Name: content_pages_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX content_pages_slug_key ON public.content_pages USING btree (slug);


--
-- Name: content_types_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX content_types_name_key ON public.content_types USING btree (name);


--
-- Name: cookie_consents_sessionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "cookie_consents_sessionId_key" ON public.cookie_consents USING btree ("sessionId");


--
-- Name: instagram_posts_instagramId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "instagram_posts_instagramId_key" ON public.instagram_posts USING btree ("instagramId");


--
-- Name: instagram_posts_projectId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "instagram_posts_projectId_key" ON public.instagram_posts USING btree ("projectId");


--
-- Name: languages_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX languages_code_key ON public.languages USING btree (code);


--
-- Name: project_translations_projectId_languageId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "project_translations_projectId_languageId_key" ON public.project_translations USING btree ("projectId", "languageId");


--
-- Name: sessions_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING btree (token);


--
-- Name: site_settings_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX site_settings_key_key ON public.site_settings USING btree (key);


--
-- Name: social_integrations_platform_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX social_integrations_platform_key ON public.social_integrations USING btree (platform);


--
-- Name: translation_keys_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX translation_keys_category_idx ON public.translation_keys USING btree (category);


--
-- Name: translation_keys_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX translation_keys_key_key ON public.translation_keys USING btree (key);


--
-- Name: translations_keyId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "translations_keyId_idx" ON public.translations USING btree ("keyId");


--
-- Name: translations_keyId_languageId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "translations_keyId_languageId_key" ON public.translations USING btree ("keyId", "languageId");


--
-- Name: translations_languageId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "translations_languageId_idx" ON public.translations USING btree ("languageId");


--
-- Name: user_preferences_sessionId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "user_preferences_sessionId_key" ON public.user_preferences USING btree ("sessionId");


--
-- Name: user_roles_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "user_roles_userId_key" ON public.user_roles USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: component_translations component_translations_languageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.component_translations
    ADD CONSTRAINT "component_translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: content_page_translations content_page_translations_languageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_page_translations
    ADD CONSTRAINT "content_page_translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: content_page_translations content_page_translations_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_page_translations
    ADD CONSTRAINT "content_page_translations_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public.content_pages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: instagram_posts instagram_posts_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.instagram_posts
    ADD CONSTRAINT "instagram_posts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: project_images project_images_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_images
    ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_translations project_translations_languageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_translations
    ADD CONSTRAINT "project_translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: project_translations project_translations_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_translations
    ADD CONSTRAINT "project_translations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects projects_contentTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES public.content_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: projects projects_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: translations translations_keyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT "translations_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES public.translation_keys(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: translations translations_languageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.translations
    ADD CONSTRAINT "translations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES public.languages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict T2aXMiZwrS3vb74MAI65rU6aS1JOBhS2WB1eN4fNBM3xBkygwcPV2U4WcoYpg6u

