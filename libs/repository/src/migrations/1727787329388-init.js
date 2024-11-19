const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class Init1727787329388 {
  name = 'Init1727787329388'

  async up(queryRunner) {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying, "phone_number" character varying, "is_blocked" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."bank_account_currency_enum" AS ENUM('RUB', 'USD', 'EUR', 'BTC', 'ETH', 'USDT', 'ARC')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."bank_account_payment_system_enum" AS ENUM('MASTERCARD', 'VISA', 'MIR')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."bank_account_affiliation_enum" AS ENUM('PERSONAL', 'CORPORATE')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."bank_account_account_type_enum" AS ENUM('COMMON', 'SAVING', 'DEPOSIT', 'MORTGAGE', 'INVESTING')`,
    )
    await queryRunner.query(
      `CREATE TABLE "bank_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "account_number" character varying(255) NOT NULL, "currency" "public"."bank_account_currency_enum" NOT NULL DEFAULT 'RUB', "payment_system" "public"."bank_account_payment_system_enum" NOT NULL DEFAULT 'MIR', "account_name" character varying(255), "balance" numeric(20,5) NOT NULL DEFAULT '0', "affiliation" "public"."bank_account_affiliation_enum" NOT NULL DEFAULT 'PERSONAL', "account_type" "public"."bank_account_account_type_enum" NOT NULL DEFAULT 'COMMON', "is_blocked" boolean NOT NULL DEFAULT false, "is_premium_account" boolean NOT NULL DEFAULT false, "is_default_account" boolean NOT NULL, "user_id" uuid, CONSTRAINT "UQ_f3ddf928fd6935ebc819ba11f7c" UNIQUE ("account_number"), CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "Bank_account_currency_index" ON "bank_account" ("currency") `,
    )
    await queryRunner.query(
      `CREATE INDEX "Bank_account_payment_system_index" ON "bank_account" ("payment_system") `,
    )
    await queryRunner.query(
      `CREATE INDEX "Bank_account_affiliation_index" ON "bank_account" ("affiliation") `,
    )
    await queryRunner.query(
      `ALTER TABLE "bank_account" ADD CONSTRAINT "FK_c8d57e8df596573a617476fdff2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "bank_account" DROP CONSTRAINT "FK_c8d57e8df596573a617476fdff2"`,
    )
    await queryRunner.query(`DROP INDEX "public"."Bank_account_affiliation_index"`)
    await queryRunner.query(`DROP INDEX "public"."Bank_account_payment_system_index"`)
    await queryRunner.query(`DROP INDEX "public"."Bank_account_currency_index"`)
    await queryRunner.query(`DROP TABLE "bank_account"`)
    await queryRunner.query(`DROP TYPE "public"."bank_account_account_type_enum"`)
    await queryRunner.query(`DROP TYPE "public"."bank_account_affiliation_enum"`)
    await queryRunner.query(`DROP TYPE "public"."bank_account_payment_system_enum"`)
    await queryRunner.query(`DROP TYPE "public"."bank_account_currency_enum"`)
    await queryRunner.query(`DROP TABLE "user"`)
  }
}
