package service

import (
    "strings"
    "time"

    "service-app/internal/model"
    "service-app/internal/repository"
)

type ProductService struct { repo repository.ProductRepository }
func NewProductService(r repository.ProductRepository) *ProductService { return &ProductService{repo: r} }

func (s *ProductService) List(params model.ListParams) (model.ListResponse, error) { return s.repo.List(params) }
func (s *ProductService) Get(id string) (model.Product, error) { p, ok := s.repo.Get(id); if !ok { return model.Product{}, ErrNotFound }; return p, nil }

func validateProduct(name string, price float64, stock int, status model.Status) error {
    n := strings.TrimSpace(name)
    if len(n) < 3 || len(n) > 100 { return ErrValidation }
    if price <= 0 { return ErrValidation }
    if stock < 0 { return ErrValidation }
    if status != model.StatusActive && status != model.StatusInactive { return ErrValidation }
    return nil
}

func (s *ProductService) Create(name string, price float64, stock int, status model.Status) (model.Product, error) {
    if err := validateProduct(name, price, stock, status); err != nil { return model.Product{}, err }
    if s.repo.ExistsByName(name, "") { return model.Product{}, ErrConflict }
    now := time.Now().UTC()
    p := model.Product{ ID: repository.Gen(), Name: strings.TrimSpace(name), Price: round2(price), Stock: stock, Status: status, CreatedAt: now, UpdatedAt: now }
    return s.repo.Create(p)
}

func (s *ProductService) Update(id string, name string, price float64, stock int, status model.Status) (model.Product, error) {
    if err := validateProduct(name, price, stock, status); err != nil { return model.Product{}, err }
    old, ok := s.repo.Get(id); if !ok { return model.Product{}, ErrNotFound }
    if s.repo.ExistsByName(name, id) { return model.Product{}, ErrConflict }
    old.Name = strings.TrimSpace(name)
    old.Price = round2(price)
    old.Stock = stock
    old.Status = status
    old.UpdatedAt = time.Now().UTC()
    return s.repo.Update(id, old)
}

func (s *ProductService) Delete(id string) error { if !s.repo.Delete(id) { return ErrNotFound }; return nil }

func round2(v float64) float64 { return float64(int(v*100+0.5)) / 100.0 }