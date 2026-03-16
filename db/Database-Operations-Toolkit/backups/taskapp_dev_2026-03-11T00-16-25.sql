--
-- PostgreSQL database dump
--

\restrict 3GHWWw9f2yer9UQiNlIFAr6SPNWg8zWEZnzbOdx7bCovAf6tVzpHZg9FJGJjrKC

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    color text
);


ALTER TABLE public.categories OWNER TO girish;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: girish
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO girish;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: girish
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    task_id integer,
    author_id integer,
    body text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT comments_body_check CHECK ((length(body) > 0))
);


ALTER TABLE public.comments OWNER TO girish;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: girish
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO girish;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: girish
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    filename text NOT NULL,
    applied_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.migrations OWNER TO girish;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: girish
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO girish;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: girish
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    owner_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.projects OWNER TO girish;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: girish
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO girish;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: girish
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.tags OWNER TO girish;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: girish
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO girish;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: girish
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: task_tags; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.task_tags (
    task_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.task_tags OWNER TO girish;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title text NOT NULL,
    completed boolean DEFAULT false,
    user_id integer,
    project_id integer,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT tasks_title_check CHECK ((length(title) > 0))
);


ALTER TABLE public.tasks OWNER TO girish;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: girish
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO girish;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: girish
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.user_preferences (
    id integer NOT NULL,
    user_id integer,
    settings jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.user_preferences OWNER TO girish;

--
-- Name: user_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: girish
--

CREATE SEQUENCE public.user_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_preferences_id_seq OWNER TO girish;

--
-- Name: user_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: girish
--

ALTER SEQUENCE public.user_preferences_id_seq OWNED BY public.user_preferences.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: girish
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO girish;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: girish
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO girish;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: girish
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: user_preferences id; Type: DEFAULT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.user_preferences ALTER COLUMN id SET DEFAULT nextval('public.user_preferences_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.categories (id, name, color) FROM stdin;
1	Backend	blue
2	Frontend	green
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.comments (id, task_id, author_id, body, created_at) FROM stdin;
1	1	2	Looks good, almost done!	2026-03-10 07:09:33.192848+00
2	1	1	Thanks, will finish today.	2026-03-10 07:09:33.194848+00
3	2	1	Need help with deployment.	2026-03-10 07:09:33.196916+00
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.migrations (id, filename, applied_at) FROM stdin;
1	001_initial_schema.sql	2026-03-11 00:16:20.593382+00
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.projects (id, name, description, owner_id, created_at) FROM stdin;
1	Task App	main project	1	2026-03-11 00:16:20.597624+00
2	Blog API	blog backend	2	2026-03-11 00:16:20.597624+00
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.tags (id, name) FROM stdin;
1	urgent
2	office
\.


--
-- Data for Name: task_tags; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.task_tags (task_id, tag_id) FROM stdin;
1	1
1	2
2	2
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.tasks (id, title, completed, user_id, project_id, metadata, created_at) FROM stdin;
1	Setup database	t	1	1	{}	2026-03-11 00:16:20.597624+00
2	Build API	t	1	1	{}	2026-03-11 00:16:20.597624+00
3	Write docs	f	1	1	{}	2026-03-11 00:16:20.597624+00
4	Design schema	f	2	2	{}	2026-03-11 00:16:20.597624+00
5	Add auth	f	2	2	{}	2026-03-11 00:16:20.597624+00
6	Code review	f	3	1	{}	2026-03-11 00:16:20.597624+00
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.user_preferences (id, user_id, settings) FROM stdin;
1	1	{"theme": "dark", "language": "en", "notifications": true}
2	2	{"theme": "light", "language": "te", "notifications": false}
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.users (id, email, name, created_at) FROM stdin;
1	girish@example.com	Girish	2026-03-11 00:16:20.597624+00
2	revanth@example.com	Revanth	2026-03-11 00:16:20.597624+00
3	kiran@example.com	Kiran	2026-03-11 00:16:20.597624+00
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.categories_id_seq', 2, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.comments_id_seq', 3, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.projects_id_seq', 2, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.tags_id_seq', 2, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.tasks_id_seq', 6, true);


--
-- Name: user_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.user_preferences_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_filename_key; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_filename_key UNIQUE (filename);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: task_tags task_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_pkey PRIMARY KEY (task_id, tag_id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_tasks_metadata; Type: INDEX; Schema: public; Owner: girish
--

CREATE INDEX idx_tasks_metadata ON public.tasks USING gin (metadata);


--
-- Name: idx_tasks_project_id; Type: INDEX; Schema: public; Owner: girish
--

CREATE INDEX idx_tasks_project_id ON public.tasks USING btree (project_id);


--
-- Name: idx_tasks_user_id; Type: INDEX; Schema: public; Owner: girish
--

CREATE INDEX idx_tasks_user_id ON public.tasks USING btree (user_id);


--
-- Name: projects projects_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: task_tags task_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 3GHWWw9f2yer9UQiNlIFAr6SPNWg8zWEZnzbOdx7bCovAf6tVzpHZg9FJGJjrKC

