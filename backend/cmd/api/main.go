package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-gonic/gin"
    "service-app/internal/config"
    h "service-app/internal/handler"
    "service-app/internal/repository"
    "service-app/internal/route"
    "service-app/internal/service"
)

func main() {
    cfg := config.Load()

    r := gin.New()
    r.Use(gin.Recovery())
    r.Use(gin.Logger())

    dsn := cfg.DatabaseURL
    if dsn == "" {
        dsn = cfg.DirectURL
    }
    db, err := repository.OpenPostgres(dsn)
    if err != nil { log.Fatalf("db: %v", err) }
    sqlDB, _ := db.DB()
    sqlDB.SetMaxOpenConns(25)
    sqlDB.SetMaxIdleConns(25)
    sqlDB.SetConnMaxLifetime(30 * time.Minute)

    userRepo := repository.NewGormUserRepository(db)
    userSvc := service.NewUserService(userRepo)
    userHandler := h.NewUserHandler(userSvc)

    prodRepo := repository.NewGormProductRepository(db)
    prodSvc := service.NewProductService(prodRepo)
    prodHandler := h.NewProductHandler(prodSvc)


    route.Register(r, cfg, userHandler, prodHandler)

    srv := &http.Server{Addr: ":" + cfg.Port, Handler: r}

    go func() {
        log.Printf("backend listening on http://localhost:%s", cfg.Port)
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