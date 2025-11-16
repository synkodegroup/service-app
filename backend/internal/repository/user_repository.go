package repository

import (
  "strings"
  "time"

  "github.com/google/uuid"
  "service-app/internal/model"
)

type UserRepository interface {
  List() ([]model.User, error)
  GetByID(id string) (model.User, bool)
  Create(in model.CreateUserInput) (model.User, error)
  Update(id string, in model.UpdateUserInput) (model.User, error)
  Delete(id string) bool
  ExistsByEmail(email string, excludeID string) bool
}

type MemoryUserRepository struct {
  items map[string]model.User
}

func NewMemoryUserRepository() *MemoryUserRepository {
  return &MemoryUserRepository{items: make(map[string]model.User)}
}

func (m *MemoryUserRepository) List() ([]model.User, error) {
  out := make([]model.User, 0, len(m.items))
  for _, u := range m.items {
    out = append(out, u)
  }
  return out, nil
}

func (m *MemoryUserRepository) GetByID(id string) (model.User, bool) {
  u, ok := m.items[id]
  return u, ok
}

func (m *MemoryUserRepository) Create(in model.CreateUserInput) (model.User, error) {
  now := time.Now().UTC()
  u := model.User{
    ID:        uuid.NewString(),
    Name:      strings.TrimSpace(in.Name),
    Email:     strings.ToLower(strings.TrimSpace(in.Email)),
    CreatedAt: now,
    UpdatedAt: now,
  }
  m.items[u.ID] = u
  return u, nil
}

func (m *MemoryUserRepository) Update(id string, in model.UpdateUserInput) (model.User, error) {
  old := m.items[id]
  old.Name = strings.TrimSpace(in.Name)
  old.Email = strings.ToLower(strings.TrimSpace(in.Email))
  old.UpdatedAt = time.Now().UTC()
  m.items[id] = old
  return old, nil
}

func (m *MemoryUserRepository) Delete(id string) bool {
  if _, ok := m.items[id]; ok {
    delete(m.items, id)
    return true
  }
  return false
}

func (m *MemoryUserRepository) ExistsByEmail(email string, excludeID string) bool {
  e := strings.ToLower(strings.TrimSpace(email))
  for id, u := range m.items {
    if excludeID != "" && id == excludeID {
      continue
    }
    if strings.ToLower(u.Email) == e {
      return true
    }
  }
  return false
}