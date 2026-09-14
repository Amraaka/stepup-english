-- Onboarding: self-assessed English level + learning goals, collected once
-- after the first sign-in. Also picks up the display name Google provides.

alter table public.profiles
  add column english_level text
    check (english_level in ('beginner', 'elementary', 'intermediate', 'advanced', 'unsure')),
  add column learning_goals text[] not null default '{}'
    check (learning_goals <@ array['school', 'work', 'exam', 'travel', 'self']::text[]),
  add column onboarded_at timestamptz;

-- Email signups pass display_name; Google (OIDC) sends full_name / name.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(
      coalesce(
        nullif(new.raw_user_meta_data ->> 'display_name', ''),
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'name',
        ''
      ),
      60
    )
  );
  return new;
end;
$$;

-- Trigger-only function: nobody needs to call it directly.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
