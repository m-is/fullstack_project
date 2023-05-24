import { Migration } from '@mikro-orm/migrations';

export class Migration20230524044537 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "inventory" ("user" varchar(255) not null, "shovel" varchar(255) not null, "lucky_coin" varchar(255) not null, constraint "inventory_pkey" primary key ("user"));');

    this.addSql('create table "location_history" ("user" varchar(255) not null, "farm" varchar(255) not null, "castle_gate" varchar(255) not null, "outside_castle_walls" varchar(255) not null, "backstreets" varchar(255) not null, "town_center" varchar(255) not null, constraint "location_history_pkey" primary key ("user"));');

    this.addSql('create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "items_user" varchar(255) not null, "map_user" varchar(255) not null);');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
    this.addSql('alter table "users" add constraint "users_items_user_unique" unique ("items_user");');
    this.addSql('alter table "users" add constraint "users_map_user_unique" unique ("map_user");');

    this.addSql('alter table "users" add constraint "users_items_user_foreign" foreign key ("items_user") references "inventory" ("user") on update cascade;');
    this.addSql('alter table "users" add constraint "users_map_user_foreign" foreign key ("map_user") references "location_history" ("user") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop constraint "users_items_user_foreign";');

    this.addSql('alter table "users" drop constraint "users_map_user_foreign";');

    this.addSql('drop table if exists "inventory" cascade;');

    this.addSql('drop table if exists "location_history" cascade;');

    this.addSql('drop table if exists "users" cascade;');
  }

}
