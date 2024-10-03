const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddTransactions1727963760522 {
    name = 'AddTransactions1727963760522'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."Bank_account_currency_index"`);
        await queryRunner.query(`DROP INDEX "public"."Bank_account_affiliation_index"`);
        await queryRunner.query(`CREATE TYPE "public"."fiat_transaction_type_enum" AS ENUM('ADD', 'SUB')`);
        await queryRunner.query(`CREATE TYPE "public"."fiat_transaction_article_enum" AS ENUM('DEBIT', 'CREDIT', 'TRANSFER', 'CASH_WITHDRAW', 'CASH_DEPOSIT', 'DIRECT_DEBIT', 'LOAN', 'CHECK', 'INVESTMENT')`);
        await queryRunner.query(`CREATE TYPE "public"."fiat_transaction_tx_status_enum" AS ENUM('CONFIRM', 'PENDING', 'BLOCKING', 'EXAMINATION')`);
        await queryRunner.query(`CREATE TABLE "fiat_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "type" "public"."fiat_transaction_type_enum" NOT NULL, "article" "public"."fiat_transaction_article_enum" NOT NULL, "tx_amount" integer NOT NULL, "tx_fee" integer NOT NULL DEFAULT '0', "tx_status" "public"."fiat_transaction_tx_status_enum" NOT NULL DEFAULT 'PENDING', "sender_card_id" uuid, "recipient_card_id" uuid, CONSTRAINT "PK_1a9da62b254ccdd8681a9ab4bc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bank_crypto_wallet_crypto_currency_enum" AS ENUM('ETH', 'USDT', 'ARC', 'BTC')`);
        await queryRunner.query(`CREATE TABLE "bank_crypto_wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "crypto_currency" "public"."bank_crypto_wallet_crypto_currency_enum" NOT NULL, "public_key" character varying NOT NULL, "private_key" character varying NOT NULL, "address" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_db81beda91b57a4597776a71688" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."crypto_transaction_crypto_currency_enum" AS ENUM('ETH', 'USDT', 'ARC', 'BTC')`);
        await queryRunner.query(`CREATE TYPE "public"."crypto_transaction_type_enum" AS ENUM('ADD', 'SUB')`);
        await queryRunner.query(`CREATE TYPE "public"."crypto_transaction_article_enum" AS ENUM('DEBIT', 'CREDIT', 'TRANSFER', 'CASH_WITHDRAW', 'CASH_DEPOSIT', 'DIRECT_DEBIT', 'LOAN', 'CHECK', 'INVESTMENT')`);
        await queryRunner.query(`CREATE TYPE "public"."crypto_transaction_tx_status_enum" AS ENUM('CONFIRM', 'PENDING', 'BLOCKING', 'EXAMINATION')`);
        await queryRunner.query(`CREATE TABLE "crypto_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "network_tx_hash" character varying, "crypto_currency" "public"."crypto_transaction_crypto_currency_enum" NOT NULL, "tx_amount" integer NOT NULL, "tx_fee" integer NOT NULL, "type" "public"."crypto_transaction_type_enum" NOT NULL, "article" "public"."crypto_transaction_article_enum" NOT NULL, "tx_status" "public"."crypto_transaction_tx_status_enum" NOT NULL DEFAULT 'PENDING', "sender_crypto_wallet_id" uuid, "recipient_crypto_wallet_id" uuid, CONSTRAINT "UQ_fcd4b80548e679494741b8a20af" UNIQUE ("network_tx_hash", "crypto_currency"), CONSTRAINT "PK_7107601dbf52f2f9d52d8890467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "Crypto_tx_network_tx_hash_index" ON "crypto_transaction" ("network_tx_hash") `);
        await queryRunner.query(`ALTER TABLE "bank_card" ADD "has_plastic" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."bank_account_currency_enum" RENAME TO "bank_account_currency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bank_account_currency_enum" AS ENUM('RUB', 'USD', 'EUR')`);
        await queryRunner.query(`ALTER TABLE "bank_account" ALTER COLUMN "currency" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bank_account" ALTER COLUMN "currency" TYPE "public"."bank_account_currency_enum" USING "currency"::"text"::"public"."bank_account_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "bank_account" ALTER COLUMN "currency" SET DEFAULT 'RUB'`);
        await queryRunner.query(`DROP TYPE "public"."bank_account_currency_enum_old"`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ADD CONSTRAINT "FK_8422e8d39974c43b4ccb8594b63" FOREIGN KEY ("sender_card_id") REFERENCES "bank_card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ADD CONSTRAINT "FK_cd0132fc87d9f6f391dedf64e96" FOREIGN KEY ("recipient_card_id") REFERENCES "bank_card"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_crypto_wallet" ADD CONSTRAINT "FK_0f007665292328b23162231bd02" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ADD CONSTRAINT "FK_85530e86aef510e308dba5fdd3b" FOREIGN KEY ("sender_crypto_wallet_id") REFERENCES "bank_crypto_wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ADD CONSTRAINT "FK_d583b911662ec05f267a5467072" FOREIGN KEY ("recipient_crypto_wallet_id") REFERENCES "bank_crypto_wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "crypto_transaction" DROP CONSTRAINT "FK_d583b911662ec05f267a5467072"`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" DROP CONSTRAINT "FK_85530e86aef510e308dba5fdd3b"`);
        await queryRunner.query(`ALTER TABLE "bank_crypto_wallet" DROP CONSTRAINT "FK_0f007665292328b23162231bd02"`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" DROP CONSTRAINT "FK_cd0132fc87d9f6f391dedf64e96"`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" DROP CONSTRAINT "FK_8422e8d39974c43b4ccb8594b63"`);
        await queryRunner.query(`CREATE TYPE "public"."bank_account_currency_enum_old" AS ENUM('RUB', 'USD', 'EUR', 'BTC', 'ETH', 'USDT', 'ARC')`);
        await queryRunner.query(`ALTER TABLE "bank_account" ALTER COLUMN "currency" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bank_account" ALTER COLUMN "currency" TYPE "public"."bank_account_currency_enum_old" USING "currency"::"text"::"public"."bank_account_currency_enum_old"`);
        await queryRunner.query(`ALTER TABLE "bank_account" ALTER COLUMN "currency" SET DEFAULT 'RUB'`);
        await queryRunner.query(`DROP TYPE "public"."bank_account_currency_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bank_account_currency_enum_old" RENAME TO "bank_account_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "bank_card" DROP COLUMN "has_plastic"`);
        await queryRunner.query(`DROP INDEX "public"."Crypto_tx_network_tx_hash_index"`);
        await queryRunner.query(`DROP TABLE "crypto_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."crypto_transaction_tx_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."crypto_transaction_article_enum"`);
        await queryRunner.query(`DROP TYPE "public"."crypto_transaction_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."crypto_transaction_crypto_currency_enum"`);
        await queryRunner.query(`DROP TABLE "bank_crypto_wallet"`);
        await queryRunner.query(`DROP TYPE "public"."bank_crypto_wallet_crypto_currency_enum"`);
        await queryRunner.query(`DROP TABLE "fiat_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."fiat_transaction_tx_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."fiat_transaction_article_enum"`);
        await queryRunner.query(`DROP TYPE "public"."fiat_transaction_type_enum"`);
        await queryRunner.query(`CREATE INDEX "Bank_account_affiliation_index" ON "bank_account" ("affiliation") `);
        await queryRunner.query(`CREATE INDEX "Bank_account_currency_index" ON "bank_account" ("currency") `);
    }
}
