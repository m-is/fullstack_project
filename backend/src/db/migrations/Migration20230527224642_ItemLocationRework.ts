import { Migration } from '@mikro-orm/migrations';

export class Migration20230527224642 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" drop constraint "users_map_user_id_foreign";');

    this.addSql('alter table "users" drop constraint "users_items_user_id_foreign";');

    this.addSql('create table "location" ("user_id" int not null, "name" varchar(255) not null, "visited" boolean not null default false, constraint "location_pkey" primary key ("user_id"));');

    this.addSql('create table "item" ("user_id" int not null, "name" varchar(255) not null, constraint "item_pkey" primary key ("user_id", "name"));');

    this.addSql('alter table "location" add constraint "location_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "item" add constraint "item_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');

    this.addSql('drop table if exists "location_history" cascade;');

    this.addSql('drop table if exists "inventory" cascade;');

    this.addSql('alter table "users" drop constraint "users_items_user_id_unique";');
    this.addSql('alter table "users" drop constraint "users_map_user_id_unique";');
    this.addSql('alter table "users" drop column "items_user_id";');
    this.addSql('alter table "users" drop column "map_user_id";');
  }

  async down(): Promise<void> {
    this.addSql('create table "location_history" ("user_id" int not null, "farm" int not null default 1, "castle_gate" int not null default 0, "outside_castle_walls" int not null default 0, "backstreets" int not null default 0, "town_center" int not null default 0, constraint "location_history_pkey" primary key ("user_id"));');

    this.addSql('create table "inventory" ("user_id" int not null, "shovel" boolean not null default false, "lucky_coin" boolean not null default false, constraint "inventory_pkey" primary key ("user_id"));');

    this.addSql('alter table "location_history" add constraint "location_history_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "inventory" add constraint "inventory_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "location" cascade;');

    this.addSql('drop table if exists "item" cascade;');

    this.addSql('alter table "users" add column "items_user_id" int null, add column "map_user_id" int null;');
    this.addSql('alter table "users" add constraint "users_items_user_id_foreign" foreign key ("items_user_id") references "inventory" ("user_id") on update cascade on delete set null;');
    this.addSql('alter table "users" add constraint "users_map_user_id_foreign" foreign key ("map_user_id") references "location_history" ("user_id") on update cascade on delete set null;');
    this.addSql('alter table "users" add constraint "users_items_user_id_unique" unique ("items_user_id");');
    this.addSql('alter table "users" add constraint "users_map_user_id_unique" unique ("map_user_id");');
  }

}
