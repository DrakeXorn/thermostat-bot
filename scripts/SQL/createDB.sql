create table "user"(
    id integer generated always as identity primary key,
    name text,
    discord_id text not null,
    constraint discord_id_unique unique(discord_id)
);

create table banned_word(
    id integer generated always as identity primary key,
    word text not null,
    match_as_full_sentence boolean not null,
    ban_date timestamptz,
    update_date timestamptz not null,
    constraint word_unique unique(word),
    constraint update_date_check check(update_date >= ban_date)
);

create table announcements(
    id integer generated always as identity primary key,
    user_id integer not null,
    content text not null
);

create table automatic_kick(
    id integer generated always as identity primary key,
    user_id integer not null,
    expiration_date timestamptz
);

create table playlist_item(
    id integer generated always as identity primary key,
    name text not null,
    youtube_id text,
    spotify_id text,
    soundcloud_id text,
    server_id text not null,
    played boolean not null,
    issuing_time timestamptz not null
);

create function check_playlist_services() returns trigger as $check_playlist_services$
    begin
        if new.youtube_id is null and new.spotify_id is null and new.soundcloud_id is null then
            raise exception 'You are obliged to give one service provider between YouTube, Spotify and Soundcloud!';
        end if;

        if new.youtube_id is not null and new.spotify_id is not null then
            raise exception 'You cannot set multiple service providers for a song!';
        end if;

        if new.soundcloud_id is not null and new.spotify_id is not null then
            raise exception 'You cannot set multiple service providers for a song!';
        end if;

        if new.soundcloud_id is not null and new.youtube_id is not null then
            raise exception 'You cannot set multiple service providers for a song!';
        end if;

        return new;
    end;
$check_playlist_services$ language plpgsql;

create trigger playlist_item_check_service
    before insert
    on playlist_item
    execute procedure check_playlist_services()
