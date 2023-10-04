import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1696421730788 implements MigrationInterface {
  name = 'Migrations1696421730788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "UQ_82927bc307d97fe09c616cd3f58" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" ADD CONSTRAINT "UQ_dc3c65c297bc24457653569e136" UNIQUE ("phone")`,
    );
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "countryId"`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "countryId" character varying(2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lead" DROP COLUMN "countryId"`);
    await queryRunner.query(
      `ALTER TABLE "lead" ADD "countryId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "UQ_dc3c65c297bc24457653569e136"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead" DROP CONSTRAINT "UQ_82927bc307d97fe09c616cd3f58"`,
    );
  }
}
