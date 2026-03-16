--
-- PostgreSQL database dump
--

\restrict 3X2rWe6AzaAyDfrI1fZCbTuc6cd8dpjNplsBYuB10RuKJ38T9dasXjhje0qENm7

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
    created_at timestamp with time zone DEFAULT now()
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
1	001_initial_schema.sql	2026-03-11 00:00:50.933256+00
2	002_add_categories.sql	2026-03-11 00:00:50.948948+00
3	003_add_metadata.sql	2026-03-11 00:00:50.960507+00
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: girish
--

COPY public.projects (id, name, description, owner_id, created_at) FROM stdin;
1	Task App	main project	1	2026-03-11 00:00:51.440474+00
2	Blog API	blog backend	2	2026-03-11 00:00:51.440474+00
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

COPY public.tasks (id, title, completed, user_id, created_at) FROM stdin;
11	Perf task 0	f	1	2026-03-11 00:07:50.680281+00
12	Perf task 1	f	2	2026-03-11 00:07:50.682332+00
13	Perf task 2	f	3	2026-03-11 00:07:50.684296+00
14	Perf task 3	f	4	2026-03-11 00:07:50.685938+00
15	Perf task 4	f	5	2026-03-11 00:07:50.687789+00
16	Perf task 5	f	1	2026-03-11 00:07:50.690029+00
17	Perf task 6	f	2	2026-03-11 00:07:50.691888+00
18	Perf task 7	f	3	2026-03-11 00:07:50.693418+00
19	Perf task 8	f	4	2026-03-11 00:07:50.695351+00
20	Perf task 9	f	5	2026-03-11 00:07:50.697003+00
21	Perf task 10	f	1	2026-03-11 00:07:50.698645+00
22	Perf task 11	f	2	2026-03-11 00:07:50.700462+00
23	Perf task 12	f	3	2026-03-11 00:07:50.702056+00
24	Perf task 13	f	4	2026-03-11 00:07:50.703733+00
25	Perf task 14	f	5	2026-03-11 00:07:50.705193+00
26	Perf task 15	f	1	2026-03-11 00:07:50.70752+00
27	Perf task 16	f	2	2026-03-11 00:07:50.709311+00
28	Perf task 17	f	3	2026-03-11 00:07:50.711364+00
29	Perf task 18	f	4	2026-03-11 00:07:50.713041+00
30	Perf task 19	f	5	2026-03-11 00:07:50.715164+00
31	Perf task 20	f	1	2026-03-11 00:07:50.71691+00
32	Perf task 21	f	2	2026-03-11 00:07:50.718885+00
33	Perf task 22	f	3	2026-03-11 00:07:50.72064+00
34	Perf task 23	f	4	2026-03-11 00:07:50.72253+00
35	Perf task 24	f	5	2026-03-11 00:07:50.724575+00
36	Perf task 25	f	1	2026-03-11 00:07:50.726287+00
37	Perf task 26	f	2	2026-03-11 00:07:50.728005+00
38	Perf task 27	f	3	2026-03-11 00:07:50.729783+00
39	Perf task 28	f	4	2026-03-11 00:07:50.731542+00
40	Perf task 29	f	5	2026-03-11 00:07:50.733274+00
41	Perf task 30	f	1	2026-03-11 00:07:50.735275+00
42	Perf task 31	f	2	2026-03-11 00:07:50.736967+00
43	Perf task 32	f	3	2026-03-11 00:07:50.738438+00
44	Perf task 33	f	4	2026-03-11 00:07:50.739963+00
45	Perf task 34	f	5	2026-03-11 00:07:50.741319+00
46	Perf task 35	f	1	2026-03-11 00:07:50.742599+00
47	Perf task 36	f	2	2026-03-11 00:07:50.743905+00
48	Perf task 37	f	3	2026-03-11 00:07:50.74528+00
49	Perf task 38	f	4	2026-03-11 00:07:50.74656+00
50	Perf task 39	f	5	2026-03-11 00:07:50.747797+00
51	Perf task 40	f	1	2026-03-11 00:07:50.749138+00
52	Perf task 41	f	2	2026-03-11 00:07:50.751486+00
53	Perf task 42	f	3	2026-03-11 00:07:50.754578+00
54	Perf task 43	f	4	2026-03-11 00:07:50.756037+00
55	Perf task 44	f	5	2026-03-11 00:07:50.757281+00
56	Perf task 45	f	1	2026-03-11 00:07:50.758527+00
57	Perf task 46	f	2	2026-03-11 00:07:50.759806+00
58	Perf task 47	f	3	2026-03-11 00:07:50.761115+00
59	Perf task 48	f	4	2026-03-11 00:07:50.76295+00
60	Perf task 49	f	5	2026-03-11 00:07:50.764598+00
61	Perf task 50	f	1	2026-03-11 00:07:50.768604+00
62	Perf task 51	f	2	2026-03-11 00:07:50.772221+00
63	Perf task 52	f	3	2026-03-11 00:07:50.774381+00
64	Perf task 53	f	4	2026-03-11 00:07:50.7762+00
65	Perf task 54	f	5	2026-03-11 00:07:50.777904+00
66	Perf task 55	f	1	2026-03-11 00:07:50.779661+00
67	Perf task 56	f	2	2026-03-11 00:07:50.782994+00
68	Perf task 57	f	3	2026-03-11 00:07:50.787176+00
69	Perf task 58	f	4	2026-03-11 00:07:50.789632+00
70	Perf task 59	f	5	2026-03-11 00:07:50.792143+00
71	Perf task 60	f	1	2026-03-11 00:07:50.794649+00
72	Perf task 61	f	2	2026-03-11 00:07:50.798217+00
73	Perf task 62	f	3	2026-03-11 00:07:50.801823+00
74	Perf task 63	f	4	2026-03-11 00:07:50.804388+00
75	Perf task 64	f	5	2026-03-11 00:07:50.806979+00
76	Perf task 65	f	1	2026-03-11 00:07:50.809258+00
77	Perf task 66	f	2	2026-03-11 00:07:50.811936+00
78	Perf task 67	f	3	2026-03-11 00:07:50.81434+00
79	Perf task 68	f	4	2026-03-11 00:07:50.816241+00
80	Perf task 69	f	5	2026-03-11 00:07:50.817828+00
81	Perf task 70	f	1	2026-03-11 00:07:50.819377+00
82	Perf task 71	f	2	2026-03-11 00:07:50.820796+00
83	Perf task 72	f	3	2026-03-11 00:07:50.822465+00
84	Perf task 73	f	4	2026-03-11 00:07:50.824493+00
85	Perf task 74	f	5	2026-03-11 00:07:50.826551+00
86	Perf task 75	f	1	2026-03-11 00:07:50.828202+00
87	Perf task 76	f	2	2026-03-11 00:07:50.829882+00
88	Perf task 77	f	3	2026-03-11 00:07:50.831628+00
89	Perf task 78	f	4	2026-03-11 00:07:50.833126+00
90	Perf task 79	f	5	2026-03-11 00:07:50.834648+00
91	Perf task 80	f	1	2026-03-11 00:07:50.836156+00
92	Perf task 81	f	2	2026-03-11 00:07:50.837624+00
93	Perf task 82	f	3	2026-03-11 00:07:50.839307+00
94	Perf task 83	f	4	2026-03-11 00:07:50.840805+00
95	Perf task 84	f	5	2026-03-11 00:07:50.842185+00
96	Perf task 85	f	1	2026-03-11 00:07:50.843572+00
97	Perf task 86	f	2	2026-03-11 00:07:50.854502+00
98	Perf task 87	f	3	2026-03-11 00:07:50.857653+00
99	Perf task 88	f	4	2026-03-11 00:07:50.860464+00
100	Perf task 89	f	5	2026-03-11 00:07:50.862947+00
101	Perf task 90	f	1	2026-03-11 00:07:50.865807+00
102	Perf task 91	f	2	2026-03-11 00:07:50.868613+00
103	Perf task 92	f	3	2026-03-11 00:07:50.871639+00
104	Perf task 93	f	4	2026-03-11 00:07:50.875088+00
105	Perf task 94	f	5	2026-03-11 00:07:50.879244+00
106	Perf task 95	f	1	2026-03-11 00:07:50.881516+00
107	Perf task 96	f	2	2026-03-11 00:07:50.883513+00
108	Perf task 97	f	3	2026-03-11 00:07:50.885794+00
109	Perf task 98	f	4	2026-03-11 00:07:50.888143+00
110	Perf task 99	f	5	2026-03-11 00:07:50.891885+00
111	Perf task 100	f	1	2026-03-11 00:07:50.893782+00
112	Perf task 101	f	2	2026-03-11 00:07:50.895811+00
113	Perf task 102	f	3	2026-03-11 00:07:50.897512+00
114	Perf task 103	f	4	2026-03-11 00:07:50.899231+00
115	Perf task 104	f	5	2026-03-11 00:07:50.901043+00
116	Perf task 105	f	1	2026-03-11 00:07:50.903372+00
117	Perf task 106	f	2	2026-03-11 00:07:50.905757+00
118	Perf task 107	f	3	2026-03-11 00:07:50.907689+00
119	Perf task 108	f	4	2026-03-11 00:07:50.909806+00
120	Perf task 109	f	5	2026-03-11 00:07:50.911443+00
121	Perf task 110	f	1	2026-03-11 00:07:50.913112+00
122	Perf task 111	f	2	2026-03-11 00:07:50.914902+00
123	Perf task 112	f	3	2026-03-11 00:07:50.916462+00
124	Perf task 113	f	4	2026-03-11 00:07:50.918129+00
125	Perf task 114	f	5	2026-03-11 00:07:50.919655+00
126	Perf task 115	f	1	2026-03-11 00:07:50.921067+00
127	Perf task 116	f	2	2026-03-11 00:07:50.922756+00
128	Perf task 117	f	3	2026-03-11 00:07:50.924279+00
129	Perf task 118	f	4	2026-03-11 00:07:50.925759+00
130	Perf task 119	f	5	2026-03-11 00:07:50.927292+00
131	Perf task 120	f	1	2026-03-11 00:07:50.928755+00
132	Perf task 121	f	2	2026-03-11 00:07:50.930023+00
133	Perf task 122	f	3	2026-03-11 00:07:50.931452+00
134	Perf task 123	f	4	2026-03-11 00:07:50.933078+00
135	Perf task 124	f	5	2026-03-11 00:07:50.934466+00
136	Perf task 125	f	1	2026-03-11 00:07:50.935914+00
137	Perf task 126	f	2	2026-03-11 00:07:50.937317+00
138	Perf task 127	f	3	2026-03-11 00:07:50.938927+00
139	Perf task 128	f	4	2026-03-11 00:07:50.940341+00
140	Perf task 129	f	5	2026-03-11 00:07:50.941689+00
141	Perf task 130	f	1	2026-03-11 00:07:50.942981+00
142	Perf task 131	f	2	2026-03-11 00:07:50.944315+00
143	Perf task 132	f	3	2026-03-11 00:07:50.945809+00
144	Perf task 133	f	4	2026-03-11 00:07:50.947277+00
145	Perf task 134	f	5	2026-03-11 00:07:50.948901+00
146	Perf task 135	f	1	2026-03-11 00:07:50.95103+00
147	Perf task 136	f	2	2026-03-11 00:07:50.952928+00
148	Perf task 137	f	3	2026-03-11 00:07:50.95476+00
149	Perf task 138	f	4	2026-03-11 00:07:50.956251+00
150	Perf task 139	f	5	2026-03-11 00:07:50.958193+00
151	Perf task 140	f	1	2026-03-11 00:07:50.95956+00
152	Perf task 141	f	2	2026-03-11 00:07:50.96098+00
153	Perf task 142	f	3	2026-03-11 00:07:50.962762+00
154	Perf task 143	f	4	2026-03-11 00:07:50.964835+00
155	Perf task 144	f	5	2026-03-11 00:07:50.966574+00
156	Perf task 145	f	1	2026-03-11 00:07:50.968301+00
157	Perf task 146	f	2	2026-03-11 00:07:50.97006+00
158	Perf task 147	f	3	2026-03-11 00:07:50.971589+00
159	Perf task 148	f	4	2026-03-11 00:07:50.973244+00
160	Perf task 149	f	5	2026-03-11 00:07:50.974699+00
161	Perf task 150	f	1	2026-03-11 00:07:50.976321+00
162	Perf task 151	f	2	2026-03-11 00:07:50.977767+00
163	Perf task 152	f	3	2026-03-11 00:07:50.981199+00
164	Perf task 153	f	4	2026-03-11 00:07:50.98459+00
165	Perf task 154	f	5	2026-03-11 00:07:50.988335+00
166	Perf task 155	f	1	2026-03-11 00:07:50.990593+00
167	Perf task 156	f	2	2026-03-11 00:07:50.992452+00
168	Perf task 157	f	3	2026-03-11 00:07:50.994374+00
169	Perf task 158	f	4	2026-03-11 00:07:50.997491+00
170	Perf task 159	f	5	2026-03-11 00:07:50.9994+00
171	Perf task 160	f	1	2026-03-11 00:07:51.001303+00
172	Perf task 161	f	2	2026-03-11 00:07:51.003306+00
173	Perf task 162	f	3	2026-03-11 00:07:51.005124+00
174	Perf task 163	f	4	2026-03-11 00:07:51.006982+00
175	Perf task 164	f	5	2026-03-11 00:07:51.008973+00
176	Perf task 165	f	1	2026-03-11 00:07:51.010842+00
177	Perf task 166	f	2	2026-03-11 00:07:51.012315+00
178	Perf task 167	f	3	2026-03-11 00:07:51.01401+00
179	Perf task 168	f	4	2026-03-11 00:07:51.015816+00
180	Perf task 169	f	5	2026-03-11 00:07:51.017432+00
181	Perf task 170	f	1	2026-03-11 00:07:51.019269+00
182	Perf task 171	f	2	2026-03-11 00:07:51.020676+00
183	Perf task 172	f	3	2026-03-11 00:07:51.022074+00
184	Perf task 173	f	4	2026-03-11 00:07:51.023486+00
185	Perf task 174	f	5	2026-03-11 00:07:51.025181+00
186	Perf task 175	f	1	2026-03-11 00:07:51.026712+00
187	Perf task 176	f	2	2026-03-11 00:07:51.028025+00
188	Perf task 177	f	3	2026-03-11 00:07:51.029313+00
189	Perf task 178	f	4	2026-03-11 00:07:51.030686+00
190	Perf task 179	f	5	2026-03-11 00:07:51.032085+00
191	Perf task 180	f	1	2026-03-11 00:07:51.033601+00
192	Perf task 181	f	2	2026-03-11 00:07:51.035086+00
193	Perf task 182	f	3	2026-03-11 00:07:51.036587+00
194	Perf task 183	f	4	2026-03-11 00:07:51.038139+00
195	Perf task 184	f	5	2026-03-11 00:07:51.039668+00
196	Perf task 185	f	1	2026-03-11 00:07:51.041297+00
197	Perf task 186	f	2	2026-03-11 00:07:51.042776+00
198	Perf task 187	f	3	2026-03-11 00:07:51.044337+00
199	Perf task 188	f	4	2026-03-11 00:07:51.045804+00
200	Perf task 189	f	5	2026-03-11 00:07:51.047335+00
201	Perf task 190	f	1	2026-03-11 00:07:51.048983+00
202	Perf task 191	f	2	2026-03-11 00:07:51.050806+00
203	Perf task 192	f	3	2026-03-11 00:07:51.0524+00
204	Perf task 193	f	4	2026-03-11 00:07:51.054183+00
205	Perf task 194	f	5	2026-03-11 00:07:51.055807+00
206	Perf task 195	f	1	2026-03-11 00:07:51.057696+00
207	Perf task 196	f	2	2026-03-11 00:07:51.059537+00
208	Perf task 197	f	3	2026-03-11 00:07:51.061441+00
209	Perf task 198	f	4	2026-03-11 00:07:51.063051+00
210	Perf task 199	f	5	2026-03-11 00:07:51.065242+00
211	Perf task 200	f	1	2026-03-11 00:07:51.067188+00
212	Perf task 201	f	2	2026-03-11 00:07:51.069471+00
213	Perf task 202	f	3	2026-03-11 00:07:51.071494+00
214	Perf task 203	f	4	2026-03-11 00:07:51.073183+00
215	Perf task 204	f	5	2026-03-11 00:07:51.074889+00
216	Perf task 205	f	1	2026-03-11 00:07:51.076732+00
217	Perf task 206	f	2	2026-03-11 00:07:51.078599+00
218	Perf task 207	f	3	2026-03-11 00:07:51.080267+00
219	Perf task 208	f	4	2026-03-11 00:07:51.082074+00
220	Perf task 209	f	5	2026-03-11 00:07:51.083692+00
221	Perf task 210	f	1	2026-03-11 00:07:51.085752+00
222	Perf task 211	f	2	2026-03-11 00:07:51.088195+00
223	Perf task 212	f	3	2026-03-11 00:07:51.090684+00
224	Perf task 213	f	4	2026-03-11 00:07:51.092884+00
225	Perf task 214	f	5	2026-03-11 00:07:51.094723+00
226	Perf task 215	f	1	2026-03-11 00:07:51.096787+00
227	Perf task 216	f	2	2026-03-11 00:07:51.098569+00
228	Perf task 217	f	3	2026-03-11 00:07:51.100894+00
229	Perf task 218	f	4	2026-03-11 00:07:51.104707+00
230	Perf task 219	f	5	2026-03-11 00:07:51.109011+00
231	Perf task 220	f	1	2026-03-11 00:07:51.111203+00
232	Perf task 221	f	2	2026-03-11 00:07:51.113309+00
233	Perf task 222	f	3	2026-03-11 00:07:51.115352+00
234	Perf task 223	f	4	2026-03-11 00:07:51.118237+00
235	Perf task 224	f	5	2026-03-11 00:07:51.121952+00
236	Perf task 225	f	1	2026-03-11 00:07:51.124194+00
237	Perf task 226	f	2	2026-03-11 00:07:51.126045+00
238	Perf task 227	f	3	2026-03-11 00:07:51.127977+00
239	Perf task 228	f	4	2026-03-11 00:07:51.129639+00
240	Perf task 229	f	5	2026-03-11 00:07:51.131551+00
241	Perf task 230	f	1	2026-03-11 00:07:51.135907+00
242	Perf task 231	f	2	2026-03-11 00:07:51.138112+00
243	Perf task 232	f	3	2026-03-11 00:07:51.140066+00
244	Perf task 233	f	4	2026-03-11 00:07:51.141803+00
245	Perf task 234	f	5	2026-03-11 00:07:51.143564+00
246	Perf task 235	f	1	2026-03-11 00:07:51.145577+00
247	Perf task 236	f	2	2026-03-11 00:07:51.148074+00
248	Perf task 237	f	3	2026-03-11 00:07:51.151837+00
249	Perf task 238	f	4	2026-03-11 00:07:51.154347+00
250	Perf task 239	f	5	2026-03-11 00:07:51.156731+00
251	Perf task 240	f	1	2026-03-11 00:07:51.158771+00
252	Perf task 241	f	2	2026-03-11 00:07:51.16091+00
253	Perf task 242	f	3	2026-03-11 00:07:51.163027+00
254	Perf task 243	f	4	2026-03-11 00:07:51.165577+00
255	Perf task 244	f	5	2026-03-11 00:07:51.1698+00
256	Perf task 245	f	1	2026-03-11 00:07:51.171731+00
257	Perf task 246	f	2	2026-03-11 00:07:51.173478+00
258	Perf task 247	f	3	2026-03-11 00:07:51.17516+00
259	Perf task 248	f	4	2026-03-11 00:07:51.176737+00
260	Perf task 249	f	5	2026-03-11 00:07:51.179103+00
261	Perf task 250	f	1	2026-03-11 00:07:51.182566+00
262	Perf task 251	f	2	2026-03-11 00:07:51.184358+00
263	Perf task 252	f	3	2026-03-11 00:07:51.186139+00
264	Perf task 253	f	4	2026-03-11 00:07:51.18796+00
265	Perf task 254	f	5	2026-03-11 00:07:51.189676+00
266	Perf task 255	f	1	2026-03-11 00:07:51.191611+00
267	Perf task 256	f	2	2026-03-11 00:07:51.193936+00
268	Perf task 257	f	3	2026-03-11 00:07:51.196027+00
269	Perf task 258	f	4	2026-03-11 00:07:51.198033+00
270	Perf task 259	f	5	2026-03-11 00:07:51.199734+00
271	Perf task 260	f	1	2026-03-11 00:07:51.20139+00
272	Perf task 261	f	2	2026-03-11 00:07:51.203371+00
273	Perf task 262	f	3	2026-03-11 00:07:51.204976+00
274	Perf task 263	f	4	2026-03-11 00:07:51.206667+00
275	Perf task 264	f	5	2026-03-11 00:07:51.208813+00
276	Perf task 265	f	1	2026-03-11 00:07:51.211924+00
277	Perf task 266	f	2	2026-03-11 00:07:51.213845+00
278	Perf task 267	f	3	2026-03-11 00:07:51.215703+00
279	Perf task 268	f	4	2026-03-11 00:07:51.217307+00
280	Perf task 269	f	5	2026-03-11 00:07:51.218979+00
281	Perf task 270	f	1	2026-03-11 00:07:51.220665+00
282	Perf task 271	f	2	2026-03-11 00:07:51.222603+00
283	Perf task 272	f	3	2026-03-11 00:07:51.224358+00
284	Perf task 273	f	4	2026-03-11 00:07:51.226296+00
285	Perf task 274	f	5	2026-03-11 00:07:51.228054+00
286	Perf task 275	f	1	2026-03-11 00:07:51.229721+00
287	Perf task 276	f	2	2026-03-11 00:07:51.231363+00
288	Perf task 277	f	3	2026-03-11 00:07:51.232933+00
289	Perf task 278	f	4	2026-03-11 00:07:51.234417+00
290	Perf task 279	f	5	2026-03-11 00:07:51.236164+00
291	Perf task 280	f	1	2026-03-11 00:07:51.237678+00
292	Perf task 281	f	2	2026-03-11 00:07:51.239062+00
293	Perf task 282	f	3	2026-03-11 00:07:51.240463+00
294	Perf task 283	f	4	2026-03-11 00:07:51.241835+00
295	Perf task 284	f	5	2026-03-11 00:07:51.24325+00
296	Perf task 285	f	1	2026-03-11 00:07:51.244653+00
297	Perf task 286	f	2	2026-03-11 00:07:51.246031+00
298	Perf task 287	f	3	2026-03-11 00:07:51.247513+00
299	Perf task 288	f	4	2026-03-11 00:07:51.249022+00
300	Perf task 289	f	5	2026-03-11 00:07:51.250429+00
301	Perf task 290	f	1	2026-03-11 00:07:51.252186+00
302	Perf task 291	f	2	2026-03-11 00:07:51.254184+00
303	Perf task 292	f	3	2026-03-11 00:07:51.256046+00
304	Perf task 293	f	4	2026-03-11 00:07:51.257622+00
305	Perf task 294	f	5	2026-03-11 00:07:51.259098+00
306	Perf task 295	f	1	2026-03-11 00:07:51.260544+00
307	Perf task 296	f	2	2026-03-11 00:07:51.261932+00
308	Perf task 297	f	3	2026-03-11 00:07:51.263373+00
309	Perf task 298	f	4	2026-03-11 00:07:51.264783+00
310	Perf task 299	f	5	2026-03-11 00:07:51.266203+00
311	Perf task 300	f	1	2026-03-11 00:07:51.26763+00
312	Perf task 301	f	2	2026-03-11 00:07:51.269021+00
313	Perf task 302	f	3	2026-03-11 00:07:51.270453+00
314	Perf task 303	f	4	2026-03-11 00:07:51.271918+00
315	Perf task 304	f	5	2026-03-11 00:07:51.273434+00
316	Perf task 305	f	1	2026-03-11 00:07:51.27492+00
317	Perf task 306	f	2	2026-03-11 00:07:51.276524+00
318	Perf task 307	f	3	2026-03-11 00:07:51.278202+00
319	Perf task 308	f	4	2026-03-11 00:07:51.279937+00
320	Perf task 309	f	5	2026-03-11 00:07:51.281735+00
321	Perf task 310	f	1	2026-03-11 00:07:51.284664+00
322	Perf task 311	f	2	2026-03-11 00:07:51.28676+00
323	Perf task 312	f	3	2026-03-11 00:07:51.288793+00
324	Perf task 313	f	4	2026-03-11 00:07:51.290959+00
325	Perf task 314	f	5	2026-03-11 00:07:51.293028+00
326	Perf task 315	f	1	2026-03-11 00:07:51.294967+00
327	Perf task 316	f	2	2026-03-11 00:07:51.296844+00
328	Perf task 317	f	3	2026-03-11 00:07:51.298912+00
329	Perf task 318	f	4	2026-03-11 00:07:51.300935+00
330	Perf task 319	f	5	2026-03-11 00:07:51.302925+00
331	Perf task 320	f	1	2026-03-11 00:07:51.30495+00
332	Perf task 321	f	2	2026-03-11 00:07:51.30718+00
333	Perf task 322	f	3	2026-03-11 00:07:51.309292+00
334	Perf task 323	f	4	2026-03-11 00:07:51.311462+00
335	Perf task 324	f	5	2026-03-11 00:07:51.314093+00
336	Perf task 325	f	1	2026-03-11 00:07:51.316415+00
337	Perf task 326	f	2	2026-03-11 00:07:51.319849+00
338	Perf task 327	f	3	2026-03-11 00:07:51.322055+00
339	Perf task 328	f	4	2026-03-11 00:07:51.324257+00
340	Perf task 329	f	5	2026-03-11 00:07:51.326441+00
341	Perf task 330	f	1	2026-03-11 00:07:51.328796+00
342	Perf task 331	f	2	2026-03-11 00:07:51.331657+00
343	Perf task 332	f	3	2026-03-11 00:07:51.336011+00
344	Perf task 333	f	4	2026-03-11 00:07:51.339379+00
345	Perf task 334	f	5	2026-03-11 00:07:51.341708+00
346	Perf task 335	f	1	2026-03-11 00:07:51.343551+00
347	Perf task 336	f	2	2026-03-11 00:07:51.346108+00
348	Perf task 337	f	3	2026-03-11 00:07:51.349708+00
349	Perf task 338	f	4	2026-03-11 00:07:51.351671+00
350	Perf task 339	f	5	2026-03-11 00:07:51.353596+00
351	Perf task 340	f	1	2026-03-11 00:07:51.355624+00
352	Perf task 341	f	2	2026-03-11 00:07:51.357698+00
353	Perf task 342	f	3	2026-03-11 00:07:51.35975+00
354	Perf task 343	f	4	2026-03-11 00:07:51.361918+00
355	Perf task 344	f	5	2026-03-11 00:07:51.366608+00
356	Perf task 345	f	1	2026-03-11 00:07:51.369001+00
357	Perf task 346	f	2	2026-03-11 00:07:51.371055+00
358	Perf task 347	f	3	2026-03-11 00:07:51.373162+00
359	Perf task 348	f	4	2026-03-11 00:07:51.377211+00
360	Perf task 349	f	5	2026-03-11 00:07:51.381379+00
361	Perf task 350	f	1	2026-03-11 00:07:51.383611+00
362	Perf task 351	f	2	2026-03-11 00:07:51.386007+00
363	Perf task 352	f	3	2026-03-11 00:07:51.387851+00
364	Perf task 353	f	4	2026-03-11 00:07:51.389782+00
365	Perf task 354	f	5	2026-03-11 00:07:51.391674+00
366	Perf task 355	f	1	2026-03-11 00:07:51.393387+00
367	Perf task 356	f	2	2026-03-11 00:07:51.395103+00
368	Perf task 357	f	3	2026-03-11 00:07:51.396892+00
369	Perf task 358	f	4	2026-03-11 00:07:51.398638+00
370	Perf task 359	f	5	2026-03-11 00:07:51.400332+00
371	Perf task 360	f	1	2026-03-11 00:07:51.402233+00
372	Perf task 361	f	2	2026-03-11 00:07:51.404031+00
373	Perf task 362	f	3	2026-03-11 00:07:51.406051+00
374	Perf task 363	f	4	2026-03-11 00:07:51.408278+00
375	Perf task 364	f	5	2026-03-11 00:07:51.41032+00
376	Perf task 365	f	1	2026-03-11 00:07:51.412319+00
377	Perf task 366	f	2	2026-03-11 00:07:51.414209+00
378	Perf task 367	f	3	2026-03-11 00:07:51.415941+00
379	Perf task 368	f	4	2026-03-11 00:07:51.417528+00
380	Perf task 369	f	5	2026-03-11 00:07:51.419293+00
381	Perf task 370	f	1	2026-03-11 00:07:51.420802+00
382	Perf task 371	f	2	2026-03-11 00:07:51.422658+00
383	Perf task 372	f	3	2026-03-11 00:07:51.42459+00
384	Perf task 373	f	4	2026-03-11 00:07:51.427708+00
385	Perf task 374	f	5	2026-03-11 00:07:51.43206+00
386	Perf task 375	f	1	2026-03-11 00:07:51.433638+00
387	Perf task 376	f	2	2026-03-11 00:07:51.435061+00
388	Perf task 377	f	3	2026-03-11 00:07:51.436519+00
389	Perf task 378	f	4	2026-03-11 00:07:51.439323+00
390	Perf task 379	f	5	2026-03-11 00:07:51.442538+00
391	Perf task 380	f	1	2026-03-11 00:07:51.44443+00
392	Perf task 381	f	2	2026-03-11 00:07:51.445807+00
393	Perf task 382	f	3	2026-03-11 00:07:51.447102+00
394	Perf task 383	f	4	2026-03-11 00:07:51.44843+00
395	Perf task 384	f	5	2026-03-11 00:07:51.449743+00
396	Perf task 385	f	1	2026-03-11 00:07:51.4511+00
397	Perf task 386	f	2	2026-03-11 00:07:51.452612+00
398	Perf task 387	f	3	2026-03-11 00:07:51.455794+00
399	Perf task 388	f	4	2026-03-11 00:07:51.457465+00
400	Perf task 389	f	5	2026-03-11 00:07:51.459039+00
401	Perf task 390	f	1	2026-03-11 00:07:51.460644+00
402	Perf task 391	f	2	2026-03-11 00:07:51.462143+00
403	Perf task 392	f	3	2026-03-11 00:07:51.463661+00
404	Perf task 393	f	4	2026-03-11 00:07:51.46519+00
405	Perf task 394	f	5	2026-03-11 00:07:51.467008+00
406	Perf task 395	f	1	2026-03-11 00:07:51.469364+00
407	Perf task 396	f	2	2026-03-11 00:07:51.471536+00
408	Perf task 397	f	3	2026-03-11 00:07:51.473734+00
409	Perf task 398	f	4	2026-03-11 00:07:51.475792+00
410	Perf task 399	f	5	2026-03-11 00:07:51.477734+00
411	Perf task 400	f	1	2026-03-11 00:07:51.479531+00
412	Perf task 401	f	2	2026-03-11 00:07:51.481332+00
413	Perf task 402	f	3	2026-03-11 00:07:51.483239+00
414	Perf task 403	f	4	2026-03-11 00:07:51.485143+00
415	Perf task 404	f	5	2026-03-11 00:07:51.48691+00
416	Perf task 405	f	1	2026-03-11 00:07:51.488658+00
417	Perf task 406	f	2	2026-03-11 00:07:51.490464+00
418	Perf task 407	f	3	2026-03-11 00:07:51.492211+00
419	Perf task 408	f	4	2026-03-11 00:07:51.494198+00
420	Perf task 409	f	5	2026-03-11 00:07:51.495886+00
421	Perf task 410	f	1	2026-03-11 00:07:51.497491+00
422	Perf task 411	f	2	2026-03-11 00:07:51.499361+00
423	Perf task 412	f	3	2026-03-11 00:07:51.501027+00
424	Perf task 413	f	4	2026-03-11 00:07:51.502769+00
425	Perf task 414	f	5	2026-03-11 00:07:51.504614+00
426	Perf task 415	f	1	2026-03-11 00:07:51.506311+00
427	Perf task 416	f	2	2026-03-11 00:07:51.508077+00
428	Perf task 417	f	3	2026-03-11 00:07:51.50987+00
429	Perf task 418	f	4	2026-03-11 00:07:51.511301+00
430	Perf task 419	f	5	2026-03-11 00:07:51.512727+00
431	Perf task 420	f	1	2026-03-11 00:07:51.514305+00
432	Perf task 421	f	2	2026-03-11 00:07:51.515795+00
433	Perf task 422	f	3	2026-03-11 00:07:51.517318+00
434	Perf task 423	f	4	2026-03-11 00:07:51.518803+00
435	Perf task 424	f	5	2026-03-11 00:07:51.520225+00
436	Perf task 425	f	1	2026-03-11 00:07:51.521556+00
437	Perf task 426	f	2	2026-03-11 00:07:51.5229+00
438	Perf task 427	f	3	2026-03-11 00:07:51.524282+00
439	Perf task 428	f	4	2026-03-11 00:07:51.525643+00
440	Perf task 429	f	5	2026-03-11 00:07:51.52709+00
441	Perf task 430	f	1	2026-03-11 00:07:51.529025+00
442	Perf task 431	f	2	2026-03-11 00:07:51.53073+00
443	Perf task 432	f	3	2026-03-11 00:07:51.532435+00
444	Perf task 433	f	4	2026-03-11 00:07:51.533975+00
445	Perf task 434	f	5	2026-03-11 00:07:51.535499+00
446	Perf task 435	f	1	2026-03-11 00:07:51.536828+00
447	Perf task 436	f	2	2026-03-11 00:07:51.538191+00
448	Perf task 437	f	3	2026-03-11 00:07:51.539472+00
449	Perf task 438	f	4	2026-03-11 00:07:51.540871+00
450	Perf task 439	f	5	2026-03-11 00:07:51.54236+00
451	Perf task 440	f	1	2026-03-11 00:07:51.543759+00
452	Perf task 441	f	2	2026-03-11 00:07:51.546665+00
453	Perf task 442	f	3	2026-03-11 00:07:51.550127+00
454	Perf task 443	f	4	2026-03-11 00:07:51.551679+00
455	Perf task 444	f	5	2026-03-11 00:07:51.553047+00
456	Perf task 445	f	1	2026-03-11 00:07:51.554394+00
457	Perf task 446	f	2	2026-03-11 00:07:51.555697+00
458	Perf task 447	f	3	2026-03-11 00:07:51.55706+00
459	Perf task 448	f	4	2026-03-11 00:07:51.558358+00
460	Perf task 449	f	5	2026-03-11 00:07:51.560778+00
461	Perf task 450	f	1	2026-03-11 00:07:51.56498+00
462	Perf task 451	f	2	2026-03-11 00:07:51.566684+00
463	Perf task 452	f	3	2026-03-11 00:07:51.568377+00
464	Perf task 453	f	4	2026-03-11 00:07:51.570179+00
465	Perf task 454	f	5	2026-03-11 00:07:51.571717+00
466	Perf task 455	f	1	2026-03-11 00:07:51.573252+00
467	Perf task 456	f	2	2026-03-11 00:07:51.574859+00
468	Perf task 457	f	3	2026-03-11 00:07:51.577712+00
469	Perf task 458	f	4	2026-03-11 00:07:51.579456+00
470	Perf task 459	f	5	2026-03-11 00:07:51.581125+00
471	Perf task 460	f	1	2026-03-11 00:07:51.582734+00
472	Perf task 461	f	2	2026-03-11 00:07:51.584097+00
473	Perf task 462	f	3	2026-03-11 00:07:51.585444+00
474	Perf task 463	f	4	2026-03-11 00:07:51.586743+00
475	Perf task 464	f	5	2026-03-11 00:07:51.588053+00
476	Perf task 465	f	1	2026-03-11 00:07:51.5896+00
477	Perf task 466	f	2	2026-03-11 00:07:51.591132+00
478	Perf task 467	f	3	2026-03-11 00:07:51.592506+00
479	Perf task 468	f	4	2026-03-11 00:07:51.59376+00
480	Perf task 469	f	5	2026-03-11 00:07:51.595095+00
481	Perf task 470	f	1	2026-03-11 00:07:51.596368+00
482	Perf task 471	f	2	2026-03-11 00:07:51.597958+00
483	Perf task 472	f	3	2026-03-11 00:07:51.599467+00
484	Perf task 473	f	4	2026-03-11 00:07:51.601444+00
485	Perf task 474	f	5	2026-03-11 00:07:51.603105+00
486	Perf task 475	f	1	2026-03-11 00:07:51.604705+00
487	Perf task 476	f	2	2026-03-11 00:07:51.606314+00
488	Perf task 477	f	3	2026-03-11 00:07:51.608028+00
489	Perf task 478	f	4	2026-03-11 00:07:51.609704+00
490	Perf task 479	f	5	2026-03-11 00:07:51.61179+00
491	Perf task 480	f	1	2026-03-11 00:07:51.613516+00
492	Perf task 481	f	2	2026-03-11 00:07:51.615123+00
493	Perf task 482	f	3	2026-03-11 00:07:51.616712+00
494	Perf task 483	f	4	2026-03-11 00:07:51.618195+00
495	Perf task 484	f	5	2026-03-11 00:07:51.61984+00
496	Perf task 485	f	1	2026-03-11 00:07:51.621699+00
497	Perf task 486	f	2	2026-03-11 00:07:51.625552+00
498	Perf task 487	f	3	2026-03-11 00:07:51.627446+00
499	Perf task 488	f	4	2026-03-11 00:07:51.629162+00
500	Perf task 489	f	5	2026-03-11 00:07:51.631038+00
501	Perf task 490	f	1	2026-03-11 00:07:51.632492+00
502	Perf task 491	f	2	2026-03-11 00:07:51.633987+00
503	Perf task 492	f	3	2026-03-11 00:07:51.635563+00
504	Perf task 493	f	4	2026-03-11 00:07:51.638665+00
505	Perf task 494	f	5	2026-03-11 00:07:51.640458+00
506	Perf task 495	f	1	2026-03-11 00:07:51.64208+00
507	Perf task 496	f	2	2026-03-11 00:07:51.643904+00
508	Perf task 497	f	3	2026-03-11 00:07:51.645431+00
509	Perf task 498	f	4	2026-03-11 00:07:51.647345+00
510	Perf task 499	f	5	2026-03-11 00:07:51.649179+00
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
1	girish@example.com	Girish	2026-03-11 00:07:50.672126+00
2	revanth@example.com	Revanth	2026-03-11 00:07:50.672126+00
3	kiran@example.com	Kiran	2026-03-11 00:07:50.672126+00
4	priya@example.com	Priya	2026-03-11 00:07:50.672126+00
5	arun@example.com	Arun	2026-03-11 00:07:50.672126+00
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

SELECT pg_catalog.setval('public.migrations_id_seq', 3, true);


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

SELECT pg_catalog.setval('public.tasks_id_seq', 510, true);


--
-- Name: user_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.user_preferences_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: girish
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


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
-- Name: task_tags task_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: girish
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 3X2rWe6AzaAyDfrI1fZCbTuc6cd8dpjNplsBYuB10RuKJ38T9dasXjhje0qENm7

