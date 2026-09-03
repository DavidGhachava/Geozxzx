alter table public.phrases
  add column audio_slow_url text,
  add column tags text[] not null default '{}',
  add column difficulty smallint not null default 1 check (difficulty between 1 and 5),
  add column speech_register text not null default 'neutral' check (speech_register in ('neutral', 'formal', 'informal')),
  add column context_note text,
  add column content_version integer not null default 1 check (content_version > 0),
  add column publication_status text not null default 'published' check (publication_status in ('draft', 'review', 'published', 'archived')),
  add column published_at timestamptz not null default now();

alter table public.profiles
  add column interface_language text not null default 'en' check (interface_language in ('en', 'ru', 'ka'));

create index phrases_tags_idx on public.phrases using gin (tags);
create index phrases_publication_idx on public.phrases (publication_status, is_free, category_slug, sort_order);
