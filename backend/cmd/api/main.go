package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"

    product "service-app/internal/product"
)

func getEnv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}

func main() {
    port := getEnv("PORT", "8080")
    origins := getEnv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174")

    r := gin.New()
    r.Use(gin.Recovery())
    r.Use(gin.Logger())
    r.Use(cors.New(cors.Config{
        AllowOrigins:     splitCSV(origins),
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    r.GET("/healthz", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "ok"})
    })

    repo := product.NewMemoryRepository()
    svc := product.NewService(repo)
    h := product.NewHandler(svc)

    v1 := r.Group("/api/v1")
    {
        products := v1.Group("/products")
        products.GET("", h.List)
        products.GET(":id", h.Get)
        products.POST("", h.Create)
        products.PUT(":id", h.Update)
        products.DELETE(":id", h.Delete)
    }

    srv := &http.Server{Addr: ":" + port, Handler: r}

    go func() {
        log.Printf("backend listening on http://localhost:%s", port)
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %v", err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatalf("Server Shutdown: %v", err)
    }
}

func splitCSV(s string) []string {
    var out []string
    curr := ""
    for i := 0; i < len(s); i++ {
        if s[i] == ',' {
            if curr != "" {
                out = append(out, curr)
                curr = ""
            }
        } else {
            curr += string(s[i])
        }
    }
    if curr != "" {
        out = append(out, curr)
    }
    return out
}