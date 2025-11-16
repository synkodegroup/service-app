package repository

import (
  "strings"
  "time"

  "service-app/internal/model"
  "gorm.io/gorm"
)

type GormUserRepository struct{ db *gorm.DB }

func NewGormUserRepository(db *gorm.DB) *GormUserRepository { return &GormUserRepository{db: db} }

func (g *GormUserRepository) List() ([]model.User, error) {
  var users []model.User
  if err := g.db.Order("created_at desc").Find(&users).Error; err != nil { return nil, err }
  return users, nil
}

func (g *GormUserRepository) GetByID(id string) (model.User, bool) {
  var u model.User
  if err := g.db.First(&u, "id = ?", id).Error; err != nil { return model.User{}, false }
  return u, true
}

func (g *GormUserRepository) Create(in model.CreateUserInput) (model.User, error) {
  now := time.Now().UTC()
  u := model.User{ID: newID(), Name: strings.TrimSpace(in.Name), Email: strings.ToLower(strings.TrimSpace(in.Email)), CreatedAt: now, UpdatedAt: now}
  if err := g.db.Create(&u).Error; err != nil { return model.User{}, err }
  return u, nil
}

func (g *GormUserRepository) Update(id string, in model.UpdateUserInput) (model.User, error) {
  var u model.User
  if err := g.db.First(&u, "id = ?", id).Error; err != nil { return model.User{}, err }
  u.Name = strings.TrimSpace(in.Name)
  u.Email = strings.ToLower(strings.TrimSpace(in.Email))
  u.UpdatedAt = time.Now().UTC()
  if err := g.db.Save(&u).Error; err != nil { return model.User{}, err }
  return u, nil
}

func (g *GormUserRepository) Delete(id string) bool {
  res := g.db.Delete(&model.User{}, "id = ?", id)
  return res.Error == nil && res.RowsAffected > 0
}

func (g *GormUserRepository) ExistsByEmail(email string, excludeID string) bool {
  var cnt int64
  q := g.db.Model(&model.User{}).Where("lower(email) = lower(?)", strings.TrimSpace(email))
  if excludeID != "" { q = q.Where("id <> ?", excludeID) }
  q.Count(&cnt)
  return cnt > 0
}

func newID() string { return gen() }
