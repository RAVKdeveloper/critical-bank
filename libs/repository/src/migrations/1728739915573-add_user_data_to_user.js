const { MigrationInterface, QueryRunner } = require('typeorm')

module.exports = class AddUserDataToUser1728739915573 {
  name = 'AddUserDataToUser1728739915573'

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" ADD "tg_id" bigint`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_b49f86c002c69c1203e10bdfcf9" UNIQUE ("tg_id")`,
    )
    await queryRunner.query(`ALTER TABLE "user" ADD "user_name" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "user" ADD "user_surname" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "user" ADD "user_last_name" character varying`)
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_last_name"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_surname"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_name"`)
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_b49f86c002c69c1203e10bdfcf9"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tg_id"`)
  }
}
