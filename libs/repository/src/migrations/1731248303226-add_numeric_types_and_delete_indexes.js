const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddNumericTypesAndDeleteIndexes1731248303226 {
    name = 'AddNumericTypesAndDeleteIndexes1731248303226'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."Bank_card_type_index"`);
        await queryRunner.query(`DROP INDEX "public"."Bank_card_payment_system_index"`);
        await queryRunner.query(`DROP INDEX "public"."Bank_card_variant_index"`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" DROP COLUMN "tx_amount"`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ADD "tx_amount" numeric(10,50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" DROP COLUMN "tx_fee"`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ADD "tx_fee" numeric(10,10) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bank_crypto_wallet" ALTER COLUMN "public_key" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" DROP COLUMN "tx_amount"`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ADD "tx_amount" numeric(10,50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" DROP COLUMN "tx_fee"`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ADD "tx_fee" numeric(5,20) NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "crypto_transaction" DROP COLUMN "tx_fee"`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ADD "tx_fee" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" DROP COLUMN "tx_amount"`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ADD "tx_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_crypto_wallet" ALTER COLUMN "public_key" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" DROP COLUMN "tx_fee"`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ADD "tx_fee" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" DROP COLUMN "tx_amount"`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ADD "tx_amount" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "Bank_card_variant_index" ON "bank_card" ("card_variant") `);
        await queryRunner.query(`CREATE INDEX "Bank_card_payment_system_index" ON "bank_card" ("payment_system") `);
        await queryRunner.query(`CREATE INDEX "Bank_card_type_index" ON "bank_card" ("card_type") `);
    }
}
