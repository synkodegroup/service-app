package handler

import (
  "net/http"
  "github.com/gin-gonic/gin"
  "service-app/internal/model"
)

func RegisterHealthRoutes(r *gin.RouterGroup) {
  r.GET("/healthz", func(c *gin.Context) {
    c.JSON(http.StatusOK, model.Ok{Status: "ok"})
  })
}