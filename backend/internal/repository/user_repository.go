package repository

import "service-app/internal/model"

type UserRepository interface {
  List() ([]model.User, error)
  GetByID(id string) (model.User, bool)
  Create(in model.CreateUserInput) (model.User, error)
  Update(id string, in model.UpdateUserInput) (model.User, error)
  Delete(id string) bool
  ExistsByEmail(email string, excludeID string) bool
}