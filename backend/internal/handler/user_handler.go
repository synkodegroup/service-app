package handler

import (
  "net/http"
  "github.com/gin-gonic/gin"
  "service-app/internal/model"
  "service-app/internal/service"
)

type UserHandler struct { svc *service.UserService }

func NewUserHandler(s *service.UserService) *UserHandler { return &UserHandler{svc: s} }

func (h *UserHandler) Register(r *gin.RouterGroup) {
  r.GET("", h.List)
  r.GET(":id", h.Get)
  r.POST("", h.Create)
  r.PUT(":id", h.Update)
  r.DELETE(":id", h.Delete)
}

func (h *UserHandler) List(c *gin.Context) {
  users, _ := h.svc.List()
  c.JSON(http.StatusOK, users)
}

func (h *UserHandler) Get(c *gin.Context) {
  id := c.Param("id")
  u, err := h.svc.Get(id)
  if err != nil {
    c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "not_found", "message": "user not found"}})
    return
  }
  c.JSON(http.StatusOK, u)
}

func (h *UserHandler) Create(c *gin.Context) {
  var in model.CreateUserInput
  if err := c.ShouldBindJSON(&in); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "validation_error", "message": "invalid json"}})
    return
  }
  u, err := h.svc.Create(in)
  if err != nil {
    switch err {
    case service.ErrValidation:
      c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "validation_error", "message": "invalid fields"}})
    case service.ErrConflict:
      c.JSON(http.StatusConflict, gin.H{"error": gin.H{"code": "conflict", "message": "email exists"}})
    default:
      c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "internal", "message": "server error"}})
    }
    return
  }
  c.JSON(http.StatusCreated, u)
}

func (h *UserHandler) Update(c *gin.Context) {
  id := c.Param("id")
  var in model.UpdateUserInput
  if err := c.ShouldBindJSON(&in); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "validation_error", "message": "invalid json"}})
    return
  }
  u, err := h.svc.Update(id, in)
  if err != nil {
    switch err {
    case service.ErrValidation:
      c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "validation_error", "message": "invalid fields"}})
    case service.ErrConflict:
      c.JSON(http.StatusConflict, gin.H{"error": gin.H{"code": "conflict", "message": "email exists"}})
    case service.ErrNotFound:
      c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "not_found", "message": "user not found"}})
    default:
      c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "internal", "message": "server error"}})
    }
    return
  }
  c.JSON(http.StatusOK, u)
}

func (h *UserHandler) Delete(c *gin.Context) {
  id := c.Param("id")
  if err := h.svc.Delete(id); err != nil {
    c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "not_found", "message": "user not found"}})
    return
  }
  c.JSON(http.StatusOK, gin.H{"deleted": true})
}