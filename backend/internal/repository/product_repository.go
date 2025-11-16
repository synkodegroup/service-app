package repository

import "service-app/internal/model"

type ProductRepository interface {
    List(params model.ListParams) (model.ListResponse, error)
    Get(id string) (model.Product, bool)
    Create(p model.Product) (model.Product, error)
    Update(id string, p model.Product) (model.Product, error)
    Delete(id string) bool
    ExistsByName(name string, excludeID string) bool
}