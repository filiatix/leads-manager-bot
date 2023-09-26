import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1695734738408 implements MigrationInterface {
  name = 'Migrations1695734738408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lead" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "countryId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca96c1888f7dcfccab72b72fffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "isSent" boolean NOT NULL DEFAULT false, "userId" integer, "leadId" integer, CONSTRAINT "REL_0b3249cbaaacc149df0989862f" UNIQUE ("leadId"), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer NOT NULL, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastMessageSentAt" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_0b3249cbaaacc149df0989862f1" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_0b3249cbaaacc149df0989862f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "lead"`);
  }
}
