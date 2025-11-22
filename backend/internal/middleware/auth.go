package middleware

import (
  "net/http"
  "strings"
  "github.com/gin-gonic/gin"
)

func Auth() gin.HandlerFunc {
  return func(c *gin.Context) {
    h := c.GetHeader("Authorization")
    if h == "" {
      c.Next()
      return
    }
    if strings.HasPrefix(h, "Bearer ") {
      c.Next()
      return
    }
    c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "unauthorized", "message": "invalid token"}})
  }
}