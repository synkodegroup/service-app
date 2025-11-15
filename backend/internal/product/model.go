package product

import "time"

type Status string

const (
    StatusActive   Status = "active"
    StatusInactive Status = "inactive"
)

type Product struct {
    ID        string    `json:"id"`
    Name      string    `json:"name"`
    Price     float64   `json:"price"`
    Stock     int       `json:"stock"`
    Status    Status    `json:"status"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type Pagination struct {
    Page       int `json:"page"`
    PageSize   int `json:"page_size"`
    TotalItems int `json:"total_items"`
    TotalPages int `json:"total_pages"`
}

type ListResponse struct {
    Data       []Product  `json:"data"`
    Pagination Pagination `json:"pagination"`
}