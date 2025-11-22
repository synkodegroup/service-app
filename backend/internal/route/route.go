package route

import (
  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
  "service-app/internal/config"
  h "service-app/internal/handler"
  "service-app/internal/middleware"
)

func Register(r *gin.Engine, cfg config.Config, user *h.UserHandler, product *h.ProductHandler) {
  r.Use(middleware.Auth())

  r.Use(cors.New(cors.Config{
    AllowOrigins:     cfg.CorsOrigins,
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
  }))

  v1 := r.Group("/api/v1")
  h.RegisterHealthRoutes(v1)

  users := v1.Group("/users")
  user.Register(users)

  if product != nil {
    products := v1.Group("/products")
    products.GET("", product.List)
    products.GET(":id", product.Get)
    products.POST("", product.Create)
    products.PUT(":id", product.Update)
    products.DELETE(":id", product.Delete)
  }
}