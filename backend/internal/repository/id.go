package repository

import "github.com/google/uuid"

func gen() string { return uuid.NewString() }
func Gen() string { return gen() }