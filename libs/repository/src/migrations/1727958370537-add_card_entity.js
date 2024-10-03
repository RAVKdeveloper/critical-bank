const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddCardEntity1727958370537 {
    name = 'AddCardEntity1727958370537'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."Bank_account_payment_system_index"`);
        await queryRunner.query(`CREATE TABLE "card_limits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "max_un_commission_money_per_day" integer NOT NULL, "max_un_commission_nal_money_per_day" integer NOT NULL, "default_card_percent_per_tx" real NOT NULL, "limit_percent_per_tx" real NOT NULL, "card_id" uuid, CONSTRAINT "REL_08906fd541d8e2d9f22564b311" UNIQUE ("card_id"), CONSTRAINT "PK_77f3a6a45d91e3778419806e1bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bank_card_card_type_enum" AS ENUM('DEBIT', 'CREDIT')`);
        await queryRunner.query(`CREATE TYPE "public"."bank_card_payment_system_enum" AS ENUM('MASTERCARD', 'VISA', 'MIR')`);
        await queryRunner.query(`CREATE TYPE "public"."bank_card_card_variant_enum" AS ENUM('COMMON', 'PREMIUM', 'HUGE_CREDIT')`);
        await queryRunner.query(`CREATE TABLE "bank_card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "card_number" character varying(16) NOT NULL, "card_type" "public"."bank_card_card_type_enum" NOT NULL DEFAULT 'DEBIT', "expiration_time" character varying(5) NOT NULL, "cvv_code" character varying NOT NULL, "is_named_card" boolean NOT NULL DEFAULT false, "is_blocked" boolean NOT NULL DEFAULT false, "card_balance" numeric(20,5) NOT NULL DEFAULT '0', "payment_system" "public"."bank_card_payment_system_enum" NOT NULL DEFAULT 'MIR', "pin_code" character varying, "card_issue_date" TIMESTAMP NOT NULL, "card_variant" "public"."bank_card_card_variant_enum" NOT NULL DEFAULT 'COMMON', "bank_account_id" uuid, "card_limits_id" uuid, CONSTRAINT "UQ_7b71bb8ac0df449ec67b392658e" UNIQUE ("card_number"), CONSTRAINT "REL_54d1a188f28a2bda422e578d99" UNIQUE ("card_limits_id"), CONSTRAINT "PK_309e54c6f6af3ee8ed268a8be9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "Bank_card_type_index" ON "bank_card" ("card_type") `);
        await queryRunner.query(`CREATE INDEX "Bank_card_payment_system_index" ON "bank_card" ("payment_system") `);
        await queryRunner.query(`CREATE INDEX "Bank_card_variant_index" ON "bank_card" ("card_variant") `);
        await queryRunner.query(`ALTER TABLE "bank_account" DROP COLUMN "payment_system"`);
        await queryRunner.query(`DROP TYPE "public"."bank_account_payment_system_enum"`);
        await queryRunner.query(`ALTER TABLE "card_limits" ADD CONSTRAINT "FK_08906fd541d8e2d9f22564b311f" FOREIGN KEY ("card_id") REFERENCES "bank_card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_card" ADD CONSTRAINT "FK_2e5e336df341d511324b053543d" FOREIGN KEY ("bank_account_id") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_card" ADD CONSTRAINT "FK_54d1a188f28a2bda422e578d99c" FOREIGN KEY ("card_limits_id") REFERENCES "card_limits"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "bank_card" DROP CONSTRAINT "FK_54d1a188f28a2bda422e578d99c"`);
        await queryRunner.query(`ALTER TABLE "bank_card" DROP CONSTRAINT "FK_2e5e336df341d511324b053543d"`);
        await queryRunner.query(`ALTER TABLE "card_limits" DROP CONSTRAINT "FK_08906fd541d8e2d9f22564b311f"`);
        await queryRunner.query(`CREATE TYPE "public"."bank_account_payment_system_enum" AS ENUM('MASTERCARD', 'VISA', 'MIR')`);
        await queryRunner.query(`ALTER TABLE "bank_account" ADD "payment_system" "public"."bank_account_payment_system_enum" NOT NULL DEFAULT 'MIR'`);
        await queryRunner.query(`DROP INDEX "public"."Bank_card_variant_index"`);
        await queryRunner.query(`DROP INDEX "public"."Bank_card_payment_system_index"`);
        await queryRunner.query(`DROP INDEX "public"."Bank_card_type_index"`);
        await queryRunner.query(`DROP TABLE "bank_card"`);
        await queryRunner.query(`DROP TYPE "public"."bank_card_card_variant_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bank_card_payment_system_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bank_card_card_type_enum"`);
        await queryRunner.query(`DROP TABLE "card_limits"`);
        await queryRunner.query(`CREATE INDEX "Bank_account_payment_system_index" ON "bank_account" ("payment_system") `);
    }
}
