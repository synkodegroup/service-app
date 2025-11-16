package repository

import (
  "gorm.io/driver/postgres"
  "gorm.io/gorm"
)

func OpenPostgres(dsn string) (*gorm.DB, error) {
  return gorm.Open(postgres.New(postgres.Config{
    DSN:                  dsn,
    PreferSimpleProtocol: true,
  }), &gorm.Config{
    PrepareStmt: false,
  })
}