package repository

import (
  "strings"
  "time"

  "gorm.io/gorm"
  p "service-app/internal/product"
)

type GormProductRepository struct{ db *gorm.DB }

func NewGormProductRepository(db *gorm.DB) *GormProductRepository { return &GormProductRepository{db: db} }

func (g *GormProductRepository) List(params p.ListParams) (p.ListResponse, error) {
  var items []p.Product
  q := g.db.Model(&p.Product{})
  if s := strings.TrimSpace(params.Search); s != "" {
    like := "%" + strings.ToLower(s) + "%"
    q = q.Where("LOWER(name) LIKE ?", like)
  }
  if params.Status == p.StatusActive || params.Status == p.StatusInactive {
    q = q.Where("status = ?", string(params.Status))
  }
  switch params.SortBy {
  case "name":
    q = q.Order("name")
  case "price":
    q = q.Order("price")
  case "stock":
    q = q.Order("stock")
  case "updated_at":
    q = q.Order("updated_at")
  default:
    q = q.Order("updated_at")
  }
  if strings.ToLower(params.SortDir) == "desc" { q = q.Order("id DESC") }

  var total int64
  if err := q.Count(&total).Error; err != nil { return p.ListResponse{}, err }
  if params.PageSize <= 0 { params.PageSize = 10 }
  if params.Page <= 0 { params.Page = 1 }
  offset := (params.Page - 1) * params.PageSize
  if err := q.Offset(offset).Limit(params.PageSize).Find(&items).Error; err != nil { return p.ListResponse{}, err }
  totalPages := int((total + int64(params.PageSize) - 1) / int64(params.PageSize))
  return p.ListResponse{ Data: items, Pagination: p.Pagination{ Page: params.Page, PageSize: params.PageSize, TotalItems: int(total), TotalPages: totalPages } }, nil
}

func (g *GormProductRepository) Get(id string) (p.Product, bool) {
  var out p.Product
  if err := g.db.First(&out, "id = ?", id).Error; err != nil { return p.Product{}, false }
  return out, true
}

func (g *GormProductRepository) Create(prod p.Product) (p.Product, error) {
  prod.CreatedAt = time.Now().UTC()
  prod.UpdatedAt = prod.CreatedAt
  if err := g.db.Create(&prod).Error; err != nil { return p.Product{}, err }
  return prod, nil
}

func (g *GormProductRepository) Update(id string, prod p.Product) (p.Product, error) {
  prod.UpdatedAt = time.Now().UTC()
  if err := g.db.Model(&p.Product{}).Where("id = ?", id).Updates(prod).Error; err != nil { return p.Product{}, err }
  var out p.Product
  _ = g.db.First(&out, "id = ?", id)
  return out, nil
}

func (g *GormProductRepository) Delete(id string) bool {
  res := g.db.Delete(&p.Product{}, "id = ?", id)
  return res.Error == nil && res.RowsAffected > 0
}

func (g *GormProductRepository) ExistsByName(name string, excludeID string) bool {
  var cnt int64
  q := g.db.Model(&p.Product{}).Where("LOWER(name) = LOWER(?)", strings.TrimSpace(name))
  if excludeID != "" { q = q.Where("id <> ?", excludeID) }
  q.Count(&cnt)
  return cnt > 0
}