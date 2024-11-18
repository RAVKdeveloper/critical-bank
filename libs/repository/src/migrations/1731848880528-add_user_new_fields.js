const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddUserNewFields1731848880528 {
    name = 'AddUserNewFields1731848880528'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "password_hash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "is_verify" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ALTER COLUMN "tx_amount" TYPE numeric(100,7)`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ALTER COLUMN "tx_fee" TYPE numeric(40,5)`);
        await queryRunner.query(`ALTER TABLE "bank_card" ALTER COLUMN "card_balance" TYPE numeric(70,5)`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ALTER COLUMN "tx_amount" TYPE numeric(130,5)`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ALTER COLUMN "tx_fee" TYPE numeric(50,5)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ALTER COLUMN "tx_fee" TYPE numeric(5,20)`);
        await queryRunner.query(`ALTER TABLE "crypto_transaction" ALTER COLUMN "tx_amount" TYPE numeric(10,50)`);
        await queryRunner.query(`ALTER TABLE "bank_card" ALTER COLUMN "card_balance" TYPE numeric(20,5)`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ALTER COLUMN "tx_fee" TYPE numeric(10,10)`);
        await queryRunner.query(`ALTER TABLE "fiat_transaction" ALTER COLUMN "tx_amount" TYPE numeric(10,50)`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verify"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password_hash"`);
    }
}
