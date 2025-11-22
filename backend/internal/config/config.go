package config

import (
  "os"
  "strings"
  "github.com/joho/godotenv"
)

type Config struct {
  Port        string
  CorsOrigins []string
  Env         string
  DatabaseURL string
  DirectURL   string
}

func Load() Config {
  _ = godotenv.Load()
  return Config{
    Port:        get("PORT", "8080"),
    CorsOrigins: splitCSV(get("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174")),
    Env:         get("APP_ENV", "development"),
    DatabaseURL: get("DATABASE_URL", ""),
    DirectURL:   get("DIRECT_URL", ""),
  }
}

func get(key, def string) string {
  if v := os.Getenv(key); v != "" {
    return v
  }
  return def
}

func splitCSV(s string) []string {
  if s == "" {
    return nil
  }
  parts := strings.Split(s, ",")
  out := make([]string, 0, len(parts))
  for _, p := range parts {
    p = strings.TrimSpace(p)
    if p != "" {
      out = append(out, p)
    }
  }
  return out
}