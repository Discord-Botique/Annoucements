create table "public"."fortnite_subscriptions" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "disabled_at" timestamp with time zone,
    "server_id" text not null,
    "channel_id" text not null,
    "role_id" text
);


CREATE UNIQUE INDEX fortnite_subscriptions_id_key ON public.fortnite_subscriptions USING btree (id);

CREATE UNIQUE INDEX fortnite_subscriptions_pkey ON public.fortnite_subscriptions USING btree (id);

alter table "public"."fortnite_subscriptions" add constraint "fortnite_subscriptions_pkey" PRIMARY KEY using index "fortnite_subscriptions_pkey";

alter table "public"."fortnite_subscriptions" add constraint "fortnite_subscriptions_id_key" UNIQUE using index "fortnite_subscriptions_id_key";

grant delete on table "public"."fortnite_subscriptions" to "anon";

grant insert on table "public"."fortnite_subscriptions" to "anon";

grant references on table "public"."fortnite_subscriptions" to "anon";

grant select on table "public"."fortnite_subscriptions" to "anon";

grant trigger on table "public"."fortnite_subscriptions" to "anon";

grant truncate on table "public"."fortnite_subscriptions" to "anon";

grant update on table "public"."fortnite_subscriptions" to "anon";

grant delete on table "public"."fortnite_subscriptions" to "authenticated";

grant insert on table "public"."fortnite_subscriptions" to "authenticated";

grant references on table "public"."fortnite_subscriptions" to "authenticated";

grant select on table "public"."fortnite_subscriptions" to "authenticated";

grant trigger on table "public"."fortnite_subscriptions" to "authenticated";

grant truncate on table "public"."fortnite_subscriptions" to "authenticated";

grant update on table "public"."fortnite_subscriptions" to "authenticated";

grant delete on table "public"."fortnite_subscriptions" to "service_role";

grant insert on table "public"."fortnite_subscriptions" to "service_role";

grant references on table "public"."fortnite_subscriptions" to "service_role";

grant select on table "public"."fortnite_subscriptions" to "service_role";

grant trigger on table "public"."fortnite_subscriptions" to "service_role";

grant truncate on table "public"."fortnite_subscriptions" to "service_role";

grant update on table "public"."fortnite_subscriptions" to "service_role";

