import { Migration } from '@mikro-orm/migrations';

export class Migration20230603030156 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" drop constraint "users_items_user_foreign";');

    this.addSql('alter table "users" drop constraint "users_map_user_foreign";');

    this.addSql('create table "location" ("user_id" int not null, "name" varchar(255) not null, "visited" boolean not null default false, constraint "location_pkey" primary key ("user_id","name"));');

    this.addSql('create table "item" ("user_id" int not null, "name" varchar(255) not null, constraint "item_pkey" primary key ("user_id", "name"));');

    this.addSql('alter table "location" add constraint "location_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "item" add constraint "item_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');

    this.addSql('drop table if exists "inventory" cascade;');

    this.addSql('drop table if exists "location_history" cascade;');

    this.addSql('alter table "users" drop constraint "users_items_user_unique";');
    this.addSql('alter table "users" drop constraint "users_map_user_unique";');
    this.addSql('alter table "users" drop column "items_user";');
    this.addSql('alter table "users" drop column "map_user";');
  }

  async down(): Promise<void> {
    this.addSql('create table "inventory" ("user" varchar not null default null, "shovel" varchar not null default null, "lucky_coin" varchar not null default null, constraint "inventory_pkey" primary key ("user"));');

    this.addSql('create table "location_history" ("user" varchar not null default null, "farm" varchar not null default null, "castle_gate" varchar not null default null, "outside_castle_walls" varchar not null default null, "backstreets" varchar not null default null, "town_center" varchar not null default null, constraint "location_history_pkey" primary key ("user"));');

    this.addSql('drop table if exists "location" cascade;');

    this.addSql('drop table if exists "item" cascade;');

    this.addSql('alter table "users" add column "items_user" varchar not null default null, add column "map_user" varchar not null default null;');
    this.addSql('alter table "users" add constraint "users_items_user_foreign" foreign key ("items_user") references "inventory" ("user") on update cascade on delete no action;');
    this.addSql('alter table "users" add constraint "users_map_user_foreign" foreign key ("map_user") references "location_history" ("user") on update cascade on delete no action;');
    this.addSql('alter table "users" add constraint "users_items_user_unique" unique ("items_user");');
    this.addSql('alter table "users" add constraint "users_map_user_unique" unique ("map_user");');
  }

}
