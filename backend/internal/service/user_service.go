package service

import (
  "errors"
  "regexp"
  "strings"

  "service-app/internal/model"
  "service-app/internal/repository"
)

var (
  ErrValidation = errors.New("validation_error")
  ErrNotFound   = errors.New("not_found")
  ErrConflict   = errors.New("conflict")
)

type UserService struct {
  repo repository.UserRepository
}

func NewUserService(r repository.UserRepository) *UserService { return &UserService{repo: r} }

func (s *UserService) List() ([]model.User, error) { return s.repo.List() }

func (s *UserService) Get(id string) (model.User, error) {
  u, ok := s.repo.GetByID(id)
  if !ok {
    return model.User{}, ErrNotFound
  }
  return u, nil
}

func (s *UserService) Create(in model.CreateUserInput) (model.User, error) {
  if err := validate(in.Name, in.Email); err != nil {
    return model.User{}, err
  }
  if s.repo.ExistsByEmail(in.Email, "") {
    return model.User{}, ErrConflict
  }
  return s.repo.Create(in)
}

func (s *UserService) Update(id string, in model.UpdateUserInput) (model.User, error) {
  if _, ok := s.repo.GetByID(id); !ok {
    return model.User{}, ErrNotFound
  }
  if err := validate(in.Name, in.Email); err != nil {
    return model.User{}, err
  }
  if s.repo.ExistsByEmail(in.Email, id) {
    return model.User{}, ErrConflict
  }
  return s.repo.Update(id, in)
}

func (s *UserService) Delete(id string) error {
  if !s.repo.Delete(id) {
    return ErrNotFound
  }
  return nil
}

func validate(name, email string) error {
  n := strings.TrimSpace(name)
  if len(n) < 2 || len(n) > 100 {
    return ErrValidation
  }
  e := strings.TrimSpace(email)
  re := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
  if !re.MatchString(e) {
    return ErrValidation
  }
  return nil
}