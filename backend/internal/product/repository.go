package product

import (
    "sort"
    "strings"
)

type Repository interface {
    List(params ListParams) (ListResponse, error)
    Get(id string) (Product, bool)
    Create(p Product) (Product, error)
    Update(id string, p Product) (Product, error)
    Delete(id string) bool
    ExistsByName(name string, excludeID string) bool
}

type MemoryRepository struct {
    items map[string]Product
}

func NewMemoryRepository() *MemoryRepository {
    return &MemoryRepository{items: make(map[string]Product)}
}

type ListParams struct {
    Page     int
    PageSize int
    Search   string
    Status   Status
    SortBy   string
    SortDir  string // asc|desc
}

func (m *MemoryRepository) List(params ListParams) (ListResponse, error) {
    var arr []Product
    for _, p := range m.items {
        arr = append(arr, p)
    }

    // Filter search
    if params.Search != "" {
        q := strings.ToLower(strings.TrimSpace(params.Search))
        tmp := arr[:0]
        for _, p := range arr {
            if strings.Contains(strings.ToLower(p.Name), q) {
                tmp = append(tmp, p)
            }
        }
        arr = tmp
    }
    // Filter status
    if params.Status == StatusActive || params.Status == StatusInactive {
        tmp := arr[:0]
        for _, p := range arr {
            if p.Status == params.Status {
                tmp = append(tmp, p)
            }
        }
        arr = tmp
    }

    // Sort
    sort.Slice(arr, func(i, j int) bool {
        less := false
        switch params.SortBy {
        case "name":
            less = strings.ToLower(arr[i].Name) < strings.ToLower(arr[j].Name)
        case "price":
            less = arr[i].Price < arr[j].Price
        case "stock":
            less = arr[i].Stock < arr[j].Stock
        case "updated_at":
            less = arr[i].UpdatedAt.Before(arr[j].UpdatedAt)
        default:
            less = arr[i].UpdatedAt.Before(arr[j].UpdatedAt)
        }
        if params.SortDir == "desc" {
            return !less
        }
        return less
    })

    total := len(arr)
    if params.PageSize <= 0 {
        params.PageSize = 10
    }
    if params.Page <= 0 {
        params.Page = 1
    }
    start := (params.Page - 1) * params.PageSize
    if start > total {
        start = total
    }
    end := start + params.PageSize
    if end > total {
        end = total
    }
    pageItems := make([]Product, end-start)
    copy(pageItems, arr[start:end])

    totalPages := (total + params.PageSize - 1) / params.PageSize

    return ListResponse{
        Data: pageItems,
        Pagination: Pagination{
            Page:       params.Page,
            PageSize:   params.PageSize,
            TotalItems: total,
            TotalPages: totalPages,
        },
    }, nil
}

func (m *MemoryRepository) Get(id string) (Product, bool) {
    p, ok := m.items[id]
    return p, ok
}

func (m *MemoryRepository) Create(p Product) (Product, error) {
    m.items[p.ID] = p
    return p, nil
}

func (m *MemoryRepository) Update(id string, p Product) (Product, error) {
    m.items[id] = p
    return p, nil
}

func (m *MemoryRepository) Delete(id string) bool {
    if _, ok := m.items[id]; ok {
        delete(m.items, id)
        return true
    }
    return false
}

func (m *MemoryRepository) ExistsByName(name string, excludeID string) bool {
    lower := strings.ToLower(strings.TrimSpace(name))
    for id, p := range m.items {
        if excludeID != "" && id == excludeID {
            continue
        }
        if strings.ToLower(p.Name) == lower {
            return true
        }
    }
    return false
}