package product

import (
    "errors"
    "strings"
    "time"
    "github.com/google/uuid"
)

var (
    ErrValidation = errors.New("validation_error")
    ErrNotFound   = errors.New("not_found")
    ErrConflict   = errors.New("conflict")
)

type Service struct { repo Repository }
func NewService(r Repository) *Service { return &Service{repo: r} }

func (s *Service) List(params ListParams) (ListResponse, error) { return s.repo.List(params) }
func (s *Service) Get(id string) (Product, error) { p, ok := s.repo.Get(id); if !ok { return Product{}, ErrNotFound }; return p, nil }

func validateInput(name string, price float64, stock int, status Status) error {
    n := strings.TrimSpace(name)
    if len(n) < 3 || len(n) > 100 { return ErrValidation }
    if price <= 0 { return ErrValidation }
    if stock < 0 { return ErrValidation }
    if status != StatusActive && status != StatusInactive { return ErrValidation }
    return nil
}

func (s *Service) Create(name string, price float64, stock int, status Status) (Product, error) {
    if err := validateInput(name, price, stock, status); err != nil { return Product{}, err }
    if s.repo.ExistsByName(name, "") { return Product{}, ErrConflict }
    now := time.Now().UTC()
    p := Product{ ID: uuid.NewString(), Name: strings.TrimSpace(name), Price: round2(price), Stock: stock, Status: status, CreatedAt: now, UpdatedAt: now }
    return s.repo.Create(p)
}

func (s *Service) Update(id string, name string, price float64, stock int, status Status) (Product, error) {
    if err := validateInput(name, price, stock, status); err != nil { return Product{}, err }
    old, ok := s.repo.Get(id); if !ok { return Product{}, ErrNotFound }
    if s.repo.ExistsByName(name, id) { return Product{}, ErrConflict }
    old.Name = strings.TrimSpace(name)
    old.Price = round2(price)
    old.Stock = stock
    old.Status = status
    old.UpdatedAt = time.Now().UTC()
    return s.repo.Update(id, old)
}

func (s *Service) Delete(id string) error { if !s.repo.Delete(id) { return ErrNotFound }; return nil }
func round2(v float64) float64 { return float64(int(v*100+0.5)) / 100.0 }