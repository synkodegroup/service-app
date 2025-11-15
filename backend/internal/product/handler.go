package product

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
)

type Handler struct {
    svc *Service
}

func NewHandler(s *Service) *Handler { return &Handler{svc: s} }

func (h *Handler) List(c *gin.Context) {
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
    search := c.Query("search")
    status := Status(c.Query("status"))
    sortBy := c.DefaultQuery("sort_by", "updated_at")
    sortDir := c.DefaultQuery("sort_dir", "desc")
    res, _ := h.svc.List(ListParams{
        Page:     page,
        PageSize: pageSize,
        Search:   search,
        Status:   status,
        SortBy:   sortBy,
        SortDir:  sortDir,
    })
    c.JSON(http.StatusOK, res)
}

func (h *Handler) Get(c *gin.Context) {
    id := c.Param("id")
    p, err := h.svc.Get(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "not_found", "message": "product not found"}})
        return
    }
    c.JSON(http.StatusOK, p)
}

type productInput struct {
    Name   string  `json:"name"`
    Price  float64 `json:"price"`
    Stock  int     `json:"stock"`
    Status Status  `json:"status"`
}

func (h *Handler) Create(c *gin.Context) {
    var in productInput
    if err := c.ShouldBindJSON(&in); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "validation_error", "message": "invalid json"}})
        return
    }
    p, err := h.svc.Create(in.Name, in.Price, in.Stock, in.Status)
    if err != nil {
        switch err {
        case ErrValidation:
            c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "validation_error", "message": "invalid fields"}})
        case ErrConflict:
            c.JSON(http.StatusConflict, gin.H{"error": gin.H{"code": "conflict", "message": "name already exists"}})
        default:
            c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "internal", "message": "server error"}})
        }
        return
    }
    c.JSON(http.StatusCreated, p)
}

func (h *Handler) Update(c *gin.Context) {
    id := c.Param("id")
    var in productInput
    if err := c.ShouldBindJSON(&in); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "validation_error", "message": "invalid json"}})
        return
    }
    p, err := h.svc.Update(id, in.Name, in.Price, in.Stock, in.Status)
    if err != nil {
        switch err {
        case ErrValidation:
            c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "validation_error", "message": "invalid fields"}})
        case ErrConflict:
            c.JSON(http.StatusConflict, gin.H{"error": gin.H{"code": "conflict", "message": "name already exists"}})
        case ErrNotFound:
            c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "not_found", "message": "product not found"}})
        default:
            c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "internal", "message": "server error"}})
        }
        return
    }
    c.JSON(http.StatusOK, p)
}

func (h *Handler) Delete(c *gin.Context) {
    id := c.Param("id")
    if err := h.svc.Delete(id); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "not_found", "message": "product not found"}})
        return
    }
    c.JSON(http.StatusOK, gin.H{"deleted": true})
}