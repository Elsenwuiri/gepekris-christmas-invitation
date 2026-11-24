create extension if not exists pgcrypto;

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  whatsapp text not null,
  attendance text not null check (attendance in ('attending', 'not_attending')),
  guest_count integer not null default 0 check (guest_count >= 0),
  message text,
  created_at timestamptz not null default now(),
  constraint rsvp_guest_count_consistency check (
    (attendance = 'attending' and guest_count >= 1)
    or (attendance = 'not_attending' and guest_count = 0)
  )
);

alter table public.rsvps enable row level security;

revoke all on table public.rsvps from anon, authenticated;

create or replace function public.submit_rsvp(
  p_guest_name text,
  p_whatsapp text,
  p_attendance text,
  p_guest_count integer,
  p_message text default null
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
  v_phone text;
  v_message text;
  v_count integer;
begin
  v_name := pg_catalog.btrim(coalesce(p_guest_name, ''));
  v_phone := pg_catalog.btrim(coalesce(p_whatsapp, ''));
  v_message := nullif(pg_catalog.btrim(coalesce(p_message, '')), '');

  if pg_catalog.length(v_name) < 2 or pg_catalog.length(v_name) > 120 then
    raise exception 'Nama harus terdiri dari 2–120 karakter.';
  end if;

  if pg_catalog.length(v_phone) < 8 or pg_catalog.length(v_phone) > 24
     or v_phone !~ '^[0-9+() .-]+$' then
    raise exception 'Nomor WhatsApp tidak valid.';
  end if;

  if p_attendance not in ('attending', 'not_attending') then
    raise exception 'Pilihan kehadiran tidak valid.';
  end if;

  if p_attendance = 'attending' then
    if p_guest_count is null or p_guest_count < 1 then
      raise exception 'Jumlah tamu minimal 1.';
    end if;
    v_count := p_guest_count;
  else
    v_count := 0;
  end if;

  if v_message is not null and pg_catalog.length(v_message) > 1000 then
    raise exception 'Pesan maksimal 1000 karakter.';
  end if;

  insert into public.rsvps (guest_name, whatsapp, attendance, guest_count, message)
  values (v_name, v_phone, p_attendance, v_count, v_message);

  return pg_catalog.json_build_object('success', true);
end;
$$;

revoke all on function public.submit_rsvp(text, text, text, integer, text) from public;
grant execute on function public.submit_rsvp(text, text, text, integer, text) to anon, authenticated;

comment on table public.rsvps is 'Private RSVP submissions. Public reads are intentionally disabled.';
